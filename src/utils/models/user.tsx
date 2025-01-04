import mongoose from "mongoose";

const schema = new mongoose.Schema({
    fullname : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true,
        match : /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/
    },
    password : {
        type : String,
        required : true,
        minLength : 6
    },
    img : {
        type : String,

    },
    gender : {
        type : String,
        enum : ['male', 'female'],
        required : true
    }
})

export const usersModel = mongoose.models.user || mongoose.model('user' , schema)