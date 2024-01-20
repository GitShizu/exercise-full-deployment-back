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

const Musician = model('Musician', musicianSchema);

export default Musician;