import { SchemaTypes, model, Schema } from "mongoose";
import Musician from "./Musician.js";

const albumSchema = new Schema({
    musician: {
        type: SchemaTypes.ObjectId,
        ref: 'Musician'
    },
    duration_seconds: Number,
    title: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 50
    },
    cover: {
        type: String,
        default: 'https://source.unsplash.com/random/100×100/?'
    },
    slug: {
        type: String,
        trim: true,
        immutable: true
    }
})

albumSchema.methods.generateSlug = async function () {
    const Album = this.constructor;
    const initialSlug = this.title.replaceAll(' ', '-').toLowerCase()
    let existentSlug = true;
    let slug = initialSlug;
    let i = 1;
    while(existentSlug){
        existentSlug = await Album.exists({slug})
        if(existentSlug){
            slug = initialSlug + '-' + i
            i++;
        }
    }
    this.slug = slug
}

albumSchema.pre('save', async function (next) {
    if (this.isModified('musician')) {
        const Album = this.constructor;
        const albumId = this._id.toString()
        const oldAlbum = await Album.findById(albumId);
        const oldMusicianId = oldAlbum?.musician?.toString();
        if (oldMusicianId) {
            const oldMusician = await Musician.findById(oldMusicianId);
            if (oldMusician) {
                await oldMusician.removeAlbum(albumId)
                console.log('Pre save');
            }
        }
    }
    next();
})

albumSchema.post('save', async function (doc, next) {
    const album = doc;
    const musicianId = album.musician?.toString();
    if (musicianId) {
        const musician = await Musician.findById(musicianId);
        if (musician) {
            await musician.addAlbum(album._id.toString())
            console.log('Post save');
        }
    }
    next()
})

albumSchema.pre('remove', async function (next) {

    const musicianId = this.musician?.toString();
    if (musicianId) {
        const musician = await Musician.findById(musicianId);
        if (musician) {
            const albumId = this._id.toString();
            await musician.removeAlbum(albumId);
            console.log('Pre-remove');
        }
    }
    next()
})

const Album = model('Album', albumSchema);





// //virtual per convertire secondi in minuti
// albumSchema.virtual('duration_minutes')
//     .get(function () {
//         return this.duration_seconds / 60
//     })
//     .set(function (minutes) {
//         this.duration_minutes = minutes
//         this.save()
//     })


export default Album;
