import { registeruser } from "../controller/controler.js";
import { Router } from "express";
const rooter = Router();

rooter.route('/register').post(registeruser)

export {rooter};