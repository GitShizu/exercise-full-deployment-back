import express, { query } from 'express';
import Album from '../models/Album.js';
import Musician from '../models/Musician.js';

const router = express.Router();
router.use(express.json());

router.get('/', async (req, res) => {
    try {
        const albums = await Album.find().populate('musician', 'stageName -_id');
        res.send(albums)
    } catch (e) {
        res.status(500).send(e.message)
    }
})

router.post('/', async (req, res) => {
    try {
        const newAlbum = req.body
        const referenceMusician = await Musician.find().where('stageName').equals(newAlbum.musician)
        console.log(referenceMusician._id);
        if (!referenceMusician) {
            throw new Error('No musicians with that name were found.')
        } else {
            const album = await Album.create({...newAlbum, musician:referenceMusician._id})
            res.send(album)
        }

    } catch (e) {
        res.status(400).send(e.message)
    }
})

router.get('/:id', async (req, res) => {
    try {
        const album = await Album.findById(req.params.id).populate('musician', 'stageName -_id')
        res.send(album);
    } catch (e) {
        res.status(404).send(e.message)
    }
})



router.delete('/:id', async (req, res) => {
    try {
        const album = await Album.findByIdAndDelete(req.params.id)
        res.send('Album deleted successfully')
    } catch (e) {
        res.status(404).send(e.message)
    }
})

router.put('/:id', async (req, res) => {
    try {
        const album = await Album.findByIdAndUpdate(req.params.id, req.body, {
            runValidators: true,
            new: true,
            context: 'query' //apply custom validators
        }).populate('musician', 'stageName -_id')
        // album.set(req.body) 
        // await album.save()
        res.send(album)
    } catch (e) {
        res.status(400).send(e.message)
    }
})

export default router