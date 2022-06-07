import mongoose from "mongoose";

const { MONGO_USERNAME, MONGO_PASSWORD, MONGO_HOSTNAME, MONGO_PORT, MONGO_DB } =
  process.env;

const url = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`;
const options = {
  useNewUrlParser: true,
  connectTimeoutMS: 10000,
};

mongoose
  .connect(url, options)
  .then(() => {
    console.log("MongoDB is connected");
  })
  .catch((err: unknown) => {
    console.log(err);
  });