import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullname:{
        firstName: {
            type : String,
            required : true,
            minlength: [3, 'First name must be 3 characters long'],
        },
        lastName: {
            type : String,
            minlength: [3, 'Last name must be 3 characters long'],
        },
        email: {
            type : String,
            required : true,
            unique : true,
        },
        password: {
            type : String,
            required : true,
        },
        //to share the location of driver and user with each other
        soketId: {
            type : String,
        }
    }
})