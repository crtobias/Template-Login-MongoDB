import express from "express";
import { register } from "../controllers/userRegister.js";
import { login } from "../controllers/userLogin.js";
import { verifyEmailController } from "../controllers/verifyEmail.js";
import { reSendVerify } from "../controllers/reSendVerify.js";
import { sendEmailChangePassword } from "../controllers/passwordEmail.js";
import { changePassword } from "../controllers/changePassword.js";
import { getUser } from "../controllers/getUser.js";

const router = express.Router();

router.post("/send-email-password", sendEmailChangePassword);
router.get("/change-password", changePassword);
router.post("/create", register);
router.post("/login", login);
router.post("/verify", reSendVerify);
router.get("/verify-email", verifyEmailController);
router.get("/getUser/:id", getUser);

const test = (req , res) => {
  console.log("ruta de test");
  return res.status(200).json({ message: 'ruta probada con exito' });
};

router.get("/test", test);

export default router;
