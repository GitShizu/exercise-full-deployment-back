import  express from "express";
import User from "../models/User.js";
import { generateToken } from "../lib/authHelper.js";

const router = express.Router();
router.use(express.json());

router.post('/signup', async (req,res)=>{
    const {email,password} = req.body;
    console.log(req.body);
    if(!email || !password){
        return res.status(400).send('All fields must be filled')
    }

    try{
        const user = await User.signUp(email,password)
        const token = generateToken(user._id)
        return res.status(201).send({
            user,
            token
        })
    }catch(error){
        console.error(error)
        const code = error.statusCode || 500;
        res.status(code).send(error.message);
    }
})

router.post('/login', async (req,res)=>{
    const {email,password} = req.body;
    if(!email || !password){
        return res.status(400).send('All fields must be filled')
    }

    try{
        const user = await User.logIn(email,password)
        const token = generateToken(user._id)
        return res.status(202).send({
            user,
            token
        })
    }catch(error){
        console.error(error)
        const code = error.statusCode || 500;
        res.status(code).send(error.message);
    }
})

export default router