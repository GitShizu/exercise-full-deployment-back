import { SchemaTypes, model, Schema } from "mongoose";
import Album from "./Album.js";

const musicianSchema = new Schema({
    albums: {
        type: Array,
    },
    albumsCount:{
        type: Number,
    },
    firstName: {
        type: String,
        minLength: 2,
        maxLength: 30
    },
    lastName: {
        type: String,
        minLength: 2,
        maxLength: 30
    },
    stageName: {
        type: String,
        minLength: 2,
        maxLength: 30,
        required: true
    },
    birthDate: Date,
    img: {
        type: String,
        default: 'https://source.unsplash.com/random/50x50/?headshot'
    },
    slug: {
        type: String,
        trim: true
    }
})

musicianSchema.methods.generateSlug = async function () {
    const Musician = this.constructor;
    const initialSlug = this.stageName.replaceAll(' ', '-').toLowerCase()
    let existentSlug = true;
    let slug = initialSlug;
    let i = 1;
    while(existentSlug){
        existentSlug = await Musician.exists({slug})
        if(existentSlug){
            slug = initialSlug + '-' + i
            i++;
        }
    }
    this.slug = slug
}

musicianSchema.methods.albumsCounter = async function () {
    const albumsCount = await Album.countDocuments({musician: this._id})
    this.albumsCount = albumsCount
}

musicianSchema.methods.removeAlbum = async function(albumId){
    const albums = this.albums.map(a=>a.toString());
    if(albums.includes(albumId)){
        albums.splice(albums.indexOf(albumId),1);
        this.albums = albums
        await this.save();
        console.log(`Album con ID ${albumId} rimosso con successo`);
    }
}

musicianSchema.methods.addAlbum = async function(albumId){
    this.albums.push(albumId);
    await this.save();
}

const Musician = model('Musician', musicianSchema);

export default Musician;