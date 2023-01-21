const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const modulesSchema = new Schema({
        nom: {
            type: String,
            required: true
        },
        professeur: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: false
        },
        classe: {
            type: String,
            required: true
        }
    }
    , {timestamps: true})

const Modules = mongoose.model('Modules', modulesSchema);
module.exports = Modules;