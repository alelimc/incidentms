import mongoose from 'mongoose'
import crypto from 'crypto'
//const mongoose = require('mongoose');
const IncidentSchema = new mongoose.Schema({
    category: {
        type: String,
        trim: true,
        required: 'Category is required'
    },
    description: {
        type: String,
        trim: true
    },
    prioritization: {
        data: Buffer,
        contentType: String
    },
    status: {
        data: Buffer,
        contentType: String
    },
    owner: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    updated: Date,
    created: {
        type: Date,
        default: Date.now
    },
});
export default mongoose.model('Incident', IncidentSchema);
