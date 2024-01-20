import express, { query } from 'express';
import Musician from '../models/Musician.js';

const router = express.Router();
router.use(express.json());

router.get('/', async (req,res)=>{
    try{
        const musicians = await Musician.find().populate('albums', 'title -_id');
        res.send(musicians)
    }catch(e){
        res.status(500).send(e.message)
    }
})

router.post('/', async(req,res)=>{
    try{
        const musician = await Musician.create(req.body)
        res.send(musician)
    }catch(e){
        res.status(400).send(e.message)
    }
})

router.get('/:id', async(req,res)=>{
    try{
        const musician = await Musician.findById(req.params.id).populate('albums', 'title -_id')
        res.send(musician);
    }catch(e){
        res.status(404).send(e.message)
    }
})

router.delete('/:id', async(req,res)=>{
    try{
        await Musician.findByIdAndDelete(req.params.id)
        res.send('musician deleted successfully')
    }catch(e){
        res.status(404).send(e.message)
    }
})

router.patch('/:id', async(req,res)=>{
    try{
        const musician = await Musician.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
            context: "query"
        })
        res.send(musician)
    }catch(e){
        res.status(400).send(e.message)
    }
})

export default router