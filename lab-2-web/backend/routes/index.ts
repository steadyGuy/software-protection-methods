import express from "express";
import ValidatorController from "../controllers/ValidatorController";

const router = express.Router();

router.get("/generate-dataset", ValidatorController.insertDataset);
router.get("/generate-captcha", ValidatorController.insertCustomCaptcha);
router.post("/validateForm", ValidatorController.confrimCustomCaptcha);

router.post("/validateForm/:type", ValidatorController.googleFormValidation);

export default router;
