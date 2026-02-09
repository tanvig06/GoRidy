import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import { jwt } from "jsonwebtoken";

const captainSchema = new mongoose.Schema({
    

    fullname: {
        firstName : {
            type: String,
            required : true,
            minlength : [3, 'First name must be atleast 3 characters long']
        },
        lastName : {
            type: String,
            required : true,
            minlength : [3, 'Last name must be atleast 3 characters long']
        }
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
    },

    password:{
        type: String,
        required: true,
        select: false
    },

    socketId:{
        type: String
    },

    status: {
        type: String,
        enum: [ 'active', 'inactive' ],
        default: 'inactive',
    },

    vehicle: {
        color: {
            type: String,
            required: true,
            minlength: [3, 'Color must be atleast 3 character long']
        },
        plate: {
            type: String,
            required: true,
            minlength: [3, 'Plate must be atleast 3 character long']
        },
        capacity: {
            type: Number,
            required: true,
            minlength: [1, 'Capacity must be atleast 1']
        },
        vehicleType: {
            type: String,
            required: true,
            enum: ['car', 'motorcycle', 'auto']
        }
    },

    location:{
        lat: {
            type: Number,
        },
        lng: {
            type: Number
        }
    }
})


captainSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {expiresIn: '24h'})
    return token;
}

captionSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

captionSchema.methods.hashPassword = async function (password) {
    return await bcrypt.hash(password, 10);
}

const captainModel = mongoose.model('caption', captainSchema)

export default captainModel;