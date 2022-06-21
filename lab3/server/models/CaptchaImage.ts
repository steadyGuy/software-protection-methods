import mongoose from "mongoose";

export interface ICaptchaImage extends Document {
  url: string;
  type: string;
}

const schema = new mongoose.Schema({
  url: String,
  type: String,
});

export default mongoose.model<ICaptchaImage>("CaptchaImage", schema);
