import { model, Schema } from "mongoose";
import validator from "validator";
import { hashPassword, comparePsw } from '../lib/authHelper.js'
const { isEmail, isStrongPassword } = validator

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        index: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    }
}, { timestamps: true })

const passwordCriteria = {
    minLength: 8,
    minLowerCase: 1,
    minUpperCase: 1,
    minNumbers: 1,
    minSymbols: 1
}

userSchema.statics.signUp = async function (email, password) {
    if (!isEmail(email)) {
        throw new Error(`${email} is not a valid email`)
    }

    if (!isStrongPassword(password, passwordCriteria)) {
        throw new Error(`Password is not strong enough`)
    }

    const emailExists = await this.exists({ email });
    if (emailExists) {
        const error = new Error(`${email} is already in use`)
        error.statusCode= 401
        throw error
    }

    const hashedPassword = await hashPassword(password)

    const user = await this.create({ email, password: hashedPassword })
    return user;
}

userSchema.statics.logIn = async function (email, password) {
    const user = await this.findOne({ email });
    const passwordMatch = await comparePsw(password, user.password)
    if (!user || !passwordMatch) {
        const error = new Error('Incorrect email or password')
        error.statusCode= 401
        throw error
        // throw new Error({ message: 'Incorrect email or password', statusCode: 401 })
    }
    return user
}

const User = model('User', userSchema)

export default User;

