const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const noteSchema = new Schema({
        note: {
            type: Number,
            required: true
        },
        module: {
            type: String,
            required: true
        },
        professeur: {
            type: String,
            required: true
        },
        etudiant: {
            type: String,
            required: true
        }
    }
    , {timestamps: true})

const Note = mongoose.model('Note', noteSchema);
module.exports = Note;