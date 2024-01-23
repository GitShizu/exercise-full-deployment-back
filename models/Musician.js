import { SchemaTypes, model, Schema } from "mongoose";

const musicianSchema = new Schema({
    albums: [{
        type: SchemaTypes.ObjectId,
        ref: 'Album',
        default: []
    }],
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
        maxLength: 30
    },
    birthDate: Date,
    img: {
        type: String,
        default: 'https://source.unsplash.com/random/50×50/?headshot'
    }
})

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