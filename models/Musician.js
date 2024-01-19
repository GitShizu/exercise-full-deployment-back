import  { SchemaTypes, model, Schema } from "mongoose";

const musicianSchema = new Schema ({
    albums: {
        type: [SchemaTypes.ObjectId],
        ref: 'Album'
    },
    fistName: String,
    lastName: String, 
    stageName: String,
    birthDate: Date
})

const Musician = model('Musician', musicianSchema);

export default Musician;