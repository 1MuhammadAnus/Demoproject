import { registeruser , functionlogedin, logout , sentAccessToken} from "../controller/controler.js";
import { Router } from "express";
import {upload} from '../middleware/Multer.modelwere.js'
import { authMiddleware } from "../middleware/authmiddleware.js";

const rooter = Router();

rooter.route('/register').post(
    upload.fields([
        {
            name : 'avatar',
            maxCount : 1
        },
        {
            name : 'coverImage',
            maxCount : 1
        }
    ]),
    registeruser)

rooter.route('/login').post(functionlogedin)
rooter.route('/logout').post(authMiddleware, logout)
rooter.route('/refreshtoken').post(sentAccessToken)
export {rooter};