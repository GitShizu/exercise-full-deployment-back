import express, { query } from 'express';
import Musician from '../models/Musician.js';

const router = express.Router();
router.use(express.json());

router.get('/', async (req, res) => {
    try {
        const musicians = await Musician.find().populate('albums', 'title -_id');
        res.send(musicians)
    } catch (e) {
        res.status(500).send(e.message)
    }
})

router.post('/', async (req, res) => {
    try {
        const musician = new Musician(req.body)
        await musician.generateSlug();
        await musician.save()
        const responseMusician = await Musician.findById(musician._id.toString()).populate('albums', 'title -_id')
        res.send(responseMusician)
    } catch (e) {
        res.status(400).send(e.message)
    }
})

router.get('/:slug', async (req, res) => {
    try {
        const musician = await Musician.findOne({ slug: req.params.slug }).populate('albums', 'title -_id')
        if (musician === null) {
            throw new Error('Not found')
        }
        res.send(musician);
    } catch (e) {
        res.status(404).send(e.message)
    }
})

router.delete('/:slug', async (req, res) => {
    try {
        await Musician.findOneAndDelete({ slug: req.params.slug })
        res.send('musician deleted successfully')
    } catch (e) {
        res.status(404).send(e.message)
    }
})

router.patch('/:slug', async (req, res) => {
    if (!req.body || !Object.keys(req.body).length) {
        res.status(400).send('You must enter a body with at least one property')
    }
    try {
        const musician = await Musician.findOne({ slug: req.params.slug })
        const stageNameUpdated = musician.stageName !== req.body.stageName;
        Object.entries(req.body).forEach(([key, value]) => {
            if (key !== 'slug') {
                musician[key] = value
            }
        })
        if (stageNameUpdated) {
            await musician.generateSlug();
            console.log('Slug updated')
        }
        await musician.save();
        res.send(musician)
    } catch (e) {
        res.status(400).send(e.message)
    }
})


export default router