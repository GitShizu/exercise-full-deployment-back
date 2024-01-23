import express from 'express';
import Album from '../models/Album.js';

const router = express.Router();
router.use(express.json());

router.get('/', async (req, res) => {
    try {
        const albums = await Album.find().populate('musician', 'stageName -_id');
        res.send(albums)
    } catch (e) {
        res.status(500).send('Server error')
    }
})

router.post('/', async (req, res) => {
    try {
        const { _id } = await Album.create(req.body)
        const album = await Album.findById(_id).populate('musician', 'stageName -_id')
        res.send(album)

    } catch (e) {
        res.status(400).send(e)
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
        await Album.findByIdAndDelete(req.params.id)
        res.send('Album deleted successfully')
    } catch (e) {
        res.status(404).send(e.message)
    }
})

router.patch('/:id', async (req, res) => {
    if (!req.body || !Object.keys(req.body).length) {
        res.status(400).send('You must enter a body with at least one property')
    }

    try {
        const album = await Album.findById(req.params.id)
        Object.keys(req.body).forEach(k => {
            album[k] = req.body[k]
        })
        await album.save();
        // const album = await Album.findByIdAndUpdate(req.params.id, req.body, {
        //     runValidators: true,
        //     new: true,
        //     context: 'query' //apply custom validators
        // }).populate('musician', 'stageName -_id')
        res.send(album)
    } catch (e) {
        res.status(400).send(e.message)
    }
})

export default router