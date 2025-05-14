import { registeruser } from "../controller/controler.js";
import { Router } from "express";
import {upload} from '../middleware/Multer.modelwere.js'
const rooter = Router();

rooter.route('/register').post(
    upload.files([
        {
            name : 'avatar',
            maxCount : 1
        },
        {
            name : 'coverimage',
            maxCount : 1
        }
    ]),
    registeruser)

export {rooter};