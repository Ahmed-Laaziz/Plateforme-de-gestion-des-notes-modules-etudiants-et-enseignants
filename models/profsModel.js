const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const profSchema = new Schema({
        nom: {
            type: String,
            required: true
        },
        prenom: {
            type: String,
            required: true
        },
        departement: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        image: {
            type: String,
            required: false,
            default: ""
        },
        classes: {
            type: String,
            required: true
        },
        role: {
            type: String,
            default: "professeur"
        }
    }
    , {timestamps: true})

const Prof = mongoose.model('Prof', profSchema);
module.exports = Prof;