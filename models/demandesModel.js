const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const demandeSchema = new Schema({
        type: {
            type: String,
            required: true
        },
        etudiant: {
            type: String,
            required: true
        },
        professeur: {
            type: String,
            required: true
        },
        module: {
            type: String,
            required: true
        },
        message: {
            type: String,
            required: true
        },
        etat: {
            type: String,
            required: true
        }
    }
    , {timestamps: true})

const Demande = mongoose.model('Demande', demandeSchema);
module.exports = Demande;