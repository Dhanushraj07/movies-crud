import { Schema,model } from "mongoose";


const schema = new Schema({
    title : {type: String, required: true},
    language: {type: String, required: true},
    year: {type:Number, required: true}
})

const Movie = model('Movie', schema);
export default Movie;