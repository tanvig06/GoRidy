import express from 'express';
const router = express.Router();
import {body} from 'express-validator'
import { registerUser } from '../controller/user.controller.js';

router.post('/register',[
    body('email').isEmail().withMessage('Invalid Email'),
    body('fullname.firstName').isLength({ min: 3}).withMessage('First name must be atleast 3 character long'),
    body('password').isLength({ min: 6 }).withMessage('Password must be atleast 6 character long'),
    body('vehicle.color').isLength({ min: 6 }).withMessage('Password must be atleast 6 character long'),
    body('vehicle.plate').isLength({ min: 6 }).withMessage('Password must be atleast 6 character long'),   
    body('vehicle.capacity').isLength({ min: 6 }).withMessage('Password must be atleast 6 character long'),
    body('vehicle.vehicleType').isLength({ min: 6 }).withMessage('Password must be atleast 6 character long')
], registerUser)


export default router;