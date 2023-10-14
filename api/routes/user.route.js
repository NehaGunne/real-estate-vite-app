import express from "express";
import { deleteUser, updateUser } from "../controllers/user.controller.js";

const router = express.Router();

router.patch("/update", updateUser);

router.delete("/delete/:id", deleteUser);

export default router;
