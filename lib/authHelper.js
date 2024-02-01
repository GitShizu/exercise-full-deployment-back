import bcrypt from 'bcrypt';
import dotenv from 'dotenv'; dotenv.config();
import jwt from 'jsonwebtoken';
const { SECRET_KEY, PEPPER_KEY } = process.env;
export const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);

    const pepperedPsw = process.env.PEPPER_KEY + password

    const hashedPassword = bcrypt.hash(pepperedPsw, salt);

    return hashedPassword
}

export const comparePsw = async (password, hashedPassword) => {

    const pepperedPsw = PEPPER_KEY + password

    const match = await bcrypt.compare(pepperedPsw, hashedPassword)

    return match
}

export const generateToken = (_id) => {
    console.log(SECRET_KEY);
    const token = jwt.sign(
        { _id },
        SECRET_KEY,
        { expiresIn: '3d' }
    )
    return token
}

export const requireAuth = (req, res, next) => {
    try {
        const { token } = req.body
        if (!token) {
            throw new Error('Token required')
        }
        jwt.verify(token,SECRET_KEY)

    } catch (error) {
        console.error(error);
        return res.send(`Request is not authorized: ${error.message}`)
    }

    next()
}