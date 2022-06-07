import { Response, Request } from "express";
import CaptchaImage from "../models/CaptchaImage";
import { generateDataset, typesOfPhoto } from "../utils/generateDataset";
import validateByCustomHandler from "../utils/validateByCustomHandler";
import validateByGoogleRecaptcha from "../utils/validateByGoogleRecaptcha";
import Jimp from "jimp";
import path from "path";

let currentCustomCaptcha = {};

const ValidatorController = {
  async googleFormValidation(req: Request, res: Response) {
    const { type } = req.params;
    let isSuccess = false;
    console.log("currentCustomCaptcha", currentCustomCaptcha);
    if (!req.body.captcha)
      return res.status(400).json({ message: "Captcha wasn't passed!" });

    try {
      if (type === "google") {
        isSuccess = await validateByGoogleRecaptcha(req, res);
      } else if (type === "custom") {
        isSuccess = await validateByCustomHandler(req, res);
      }

      return res.json({ isSuccess });
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  },
  async insertDataset(req: Request, res: Response) {
    try {
      const amountOfItems = await CaptchaImage.estimatedDocumentCount();
      if (amountOfItems > 0) {
        return res.json("Already inserted");
      }
      await CaptchaImage.insertMany(generateDataset());
      return res.json("Successfully inserted");
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  },
  async insertCustomCaptcha(req: Request, res: Response) {
    const randomImageType =
      typesOfPhoto[Math.floor(Math.random() * typesOfPhoto.length)];
    const imagesOfSpecificType = await CaptchaImage.find({});
    const clientRemoteAddress = req.socket.remoteAddress;

    const randomImg =
      imagesOfSpecificType[
        Math.floor(Math.random() * imagesOfSpecificType.length)
      ];
    console.log("__dirname", __dirname);
    let watermark = await Jimp.read(
      path.resolve(__dirname, "../public/captcha/overlay.jpg")
    );

    watermark = watermark.resize(120, 120); // Resizing watermark image

    const captchaImg = await Jimp.read(randomImg.url);

    await captchaImg.composite(watermark, 0, 0, {
      mode: Jimp.BLEND_SOURCE_OVER,
      opacityDest: 1,
      opacitySource: 0.25,
    });

    await captchaImg.writeAsync(
      path.resolve(
        __dirname,
        `../public/captcha/${clientRemoteAddress?.replace(
          /\./g,
          "-"
        )}-captcha.jpg`
      )
    );
    currentCustomCaptcha = {
      name: randomImageType.name,
      imgPath: `../public/captcha/${clientRemoteAddress?.replace(
        /\./g,
        "-"
      )}-captcha.jpg`,
    };
    return res.json(randomImg);
  },
};

export default ValidatorController;
