import axios from "axios";
import { Response, Request } from "express";

const validateByGoogleRecaptcha = async (req: Request, res: Response) => {
  const { captcha } = req.body;

  const clientRemoteAddress =
    req.headers["x-forwarded-for"] || req.socket.remoteAddress;

  const axiosResponse = await axios.post(
    "https://www.google.com/recaptcha/api/siteverify",
    {
      secret: process.env.GOOGLE_RECAPTCHA_SECRET_KEY,
      response: captcha,
      remoteip: clientRemoteAddress,
    }
  );

  const verifyUrl = `https://www.google.com/recaptcha/api/siteverify`;

  axios.post(verifyUrl);
  return axiosResponse.data.success;
};

export default validateByGoogleRecaptcha;
