import bcrypt from 'bcrypt';
import dotenv from 'dotenv'; dotenv.config();

export const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);

    const pepperedPsw = process.env.PEPPER_KEY + password

    const hashedPassword = bcrypt.hash(pepperedPsw, salt);

    return hashedPassword
}

export const comparePsw = async (password, hashedPassword) => {
    
    const pepperedPsw = process.env.PEPPER_KEY + password

    const match = await bcrypt.compare(pepperedPsw, hashedPassword)

    return match
}