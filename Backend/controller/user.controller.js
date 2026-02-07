import userModel from "../model/user.model.js";
// import userService from '../services/user.service';
import { createUser } from '../services/user.service.js';
import { validationResult } from 'express-validator'

export const registerUser = async (req, res, next) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors : errors.array()});
    }

    const { fullname, email, password } = req.body;
    const { firstname, lastname } = fullname;

    const hashedPassword = await userModel.hashPassword(password);

    const user = await createUser({
        firstname,
        lastname,
        email,
        password : hashedPassword
    });

    const token = user.generateAuthToken();

    res.status(201).json({token, user})
}