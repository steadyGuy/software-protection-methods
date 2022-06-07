import { Response, Request } from "express";
import CaptchaImage from "../models/CaptchaImage";
import { typesOfPhoto } from "./generateDataset";

const validateByCustomHandler = async (req: Request, res: Response) => {
  const { captcha } = req.body;

  const randomImageType =
    typesOfPhoto[Math.floor(Math.random() * typesOfPhoto.length)];
  const imagesOfSpecificType = await CaptchaImage.find({ type: randomImageType.name });

  

  console.log('imagesOfSpecificType', imagesOfSpecificType)
  console.log("randomImageType", randomImageType);
  return false;
};

export default validateByCustomHandler;
