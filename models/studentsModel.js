const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const studentSchema = new Schema({
        nom: {
            type: String,
            required: true
        },
        prenom: {
            type: String,
            required: true
        },
        filiere: {
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
            required: false
        },
        role: {
            type: String,
            default: "etudiant"
        }
    }
    , {timestamps: true})

const Student = mongoose.model('Student', studentSchema);
module.exports = Student;