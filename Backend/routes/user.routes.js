import express from 'express';
const router = express.Router();
import { registerUser } from '../controller/user.controller.js';
import {body} from 'express-validator';


router.post('/register',[
    // body('email').isEmail().withmessage('Invalid Email'),
    body('email').isEmail(),
    body('fullname.firstname').isLength({min : 3}).withMessage('First name must be at least 3 characters long'),
    body('password').isLength({ min: 6}).withMessage('Password must be atleast 6 character long')
],
    registerUser
)


export default router;