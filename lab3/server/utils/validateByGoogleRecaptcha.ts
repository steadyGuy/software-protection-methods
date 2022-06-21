import axios from "axios";
import { Response, Request } from "express";

const validateByGoogleRecaptcha = async (req: Request, res: Response) => {
  const { captcha } = req.body;

  const verifyUrl = `https://www.google.com/recaptcha/api/siteverify`;

  const axiosResponse = await axios.post(
    verifyUrl,
    `secret=${process.env.GOOGLE_RECAPTCHA_SECRET_KEY}&response=${captcha}`,
    {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    }
  );

  return axiosResponse.data.success;
};

export default validateByGoogleRecaptcha;
