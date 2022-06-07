import { Response, Request } from "express";
import CaptchaImage from "../models/CaptchaImage";
import { generateDataset, typesOfPhoto } from "../utils/generateDataset";
import validateByGoogleRecaptcha from "../utils/validateByGoogleRecaptcha";
import Jimp from "jimp";
import path from "path";

let currentCustomCaptcha: Record<string, any> = {};

const ValidatorController = {
  async googleFormValidation(req: Request, res: Response) {
    const { type } = req.params;
    let isSuccess = false;
    if (!req.body.captcha)
      return res.status(400).json({ message: "Captcha wasn't passed!" });

    try {
      if (type === "google") {
        isSuccess = await validateByGoogleRecaptcha(req, res);
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
    let typeToSelect = "";
    const imagesOfSpecificType = await CaptchaImage.find({});
    const clientRemoteAddress = req.socket.remoteAddress?.replace(
      /\./g,
      "-"
    ) as string;

    const randomImages6 = [...Array(6).keys()].map(
      (_) =>
        imagesOfSpecificType[
          Math.floor(Math.random() * imagesOfSpecificType.length)
        ]
    );

    const randomImageType = randomImages6[Math.floor(Math.random() * 6)].type;

    let watermark = await Jimp.read(
      path.resolve(__dirname, "../public/captcha/overlay2.jpg")
    );

    watermark = watermark.resize(120, 120); // Resizing watermark image
    const results = await Promise.all(
      randomImages6.map(async (randomImg, idx) => {
        try {
          const captchaImg = await Jimp.read(randomImg.url);

          await captchaImg.sepia().composite(watermark, 0, 0, {
            mode: Jimp.BLEND_SOURCE_OVER,
            opacityDest: 1,
            opacitySource: 0.4,
          });

          // remote address is unique per user
          const urlTemplate = `/captcha/${clientRemoteAddress}-captcha-${idx}.jpg`;

          await captchaImg.writeAsync(
            path.resolve(__dirname, "../public" + urlTemplate)
          );

          return {
            type: randomImg.type,
            url: `${process.env.HOST}${urlTemplate}`,
          };
        } catch (error) {
          console.log("ERROR: ", error);
        }
      })
    );
    currentCustomCaptcha[clientRemoteAddress] = {
      arr: results.filter((i) => i),
      typeToSelect: randomImageType,
      expirationTime: new Date().getTime() + 600_000,
    };

    console.log("currentCustomCaptcha", currentCustomCaptcha);
    console.log("results", results);

    return res.json({
      toSelect: randomImageType,
      results: results
        .filter((itm) => Boolean(itm))
        .map((it) => ({ url: it?.url })),
    });
  },
  async confrimCustomCaptcha(req: Request, res: Response) {
    try {
      // answers - array of indexes with an appropriate image type
      // which is unknown for client
      const { answers } = req.body;
      const clientRemoteAddress = req.socket.remoteAddress?.replace(
        /\./g,
        "-"
      ) as string;

      if (
        currentCustomCaptcha[clientRemoteAddress].expirationTime <=
        new Date().getTime()
      ) {
        return res
          .status(400)
          .json({ error: "The time of captcha has expired" });
      }

      let error = "";
      answers.forEach((idx: number) => {
        // if one at least wrong - throwing error
        // but we can setup count of correct selections
        console.log(
          "currentCustomCaptcha[clientRemoteAddress].typeToSelect",
          currentCustomCaptcha[clientRemoteAddress].typeToSelect
        );
        console.log(
          "currentCustomCaptcha[clientRemoteAddress].arr[idx]",
          currentCustomCaptcha[clientRemoteAddress].arr[idx]
        );
        if (
          currentCustomCaptcha[clientRemoteAddress].typeToSelect !==
          currentCustomCaptcha[clientRemoteAddress].arr[idx].type
        ) {
          error = "You have selected wrong image";
        }
      });

      if (error) {
        return res.status(400).json({ error });
      }

      return res.json({ success: true });
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  },
};

export default ValidatorController;
