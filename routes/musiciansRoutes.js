import express from 'express';
import Musician from '../models/Musician.js';
import Album from '../models/Album.js'

const router = express.Router();
router.use(express.json());

router.get('/', async (req, res) => {
    try {
        const musicians = await Musician.find().select('-albums')
        const musiciansWithCount = await Promise.all(musicians.map(async (m) => {
           await m.albumsCounter()
            return m
        }))
        res.send(musiciansWithCount)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.post('/', async (req, res) => {
    try {
        const musician = new Musician(req.body)
        await musician.generateSlug();
        await musician.albumsCounter();
        musician.albums = [];
        await musician.save()
        const musicians = await Musician.find()
        res.send(musicians)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/:slug', async (req, res) => {
    try {
        const musician = await Musician.findOne({ slug: req.params.slug }).populate('albums', 'title -_id')
        if (musician === null) {
            throw new Error('Not found')
        }
        musician.albums = await Album.find({musician: musician._id})
        res.send(musician);
    } catch (e) {
        res.status(404).send(e.message)
    }
})

router.delete('/:slug', async (req, res) => {
    try {
        await Musician.findOneAndDelete({ slug: req.params.slug })
        const musicians = await Musician.find()
        res.send(musicians)
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
            if (key !== 'slug' && key !== 'albums') {
                musician[key] = value
            }
        })
        if (stageNameUpdated) {
            await musician.generateSlug();
            console.log('Slug updated')
        }
        musician.albums = [];
        await musician.save();
        musician.albums = await Album.find({musician: musician._id})
        const musicianToSend = await Musician.findOne({ slug: req.params.slug }).populate('albums', 'title -_id')
        res.send(musicianToSend)
    } catch (e) {
        res.status(400).send(e.message)
    }
})


export default router