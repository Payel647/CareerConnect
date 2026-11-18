const mongoose = require("mongoose");
const JobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    requirements: {
        type: String,
        required: true
    },
    location: {
        type: String
    },
    category: {
        type: String
    },
    type: {
        type: String,
        enum: ["Full-time", "Remote", "Part-time", "Contract", "Internship"],
        required: true
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    salaryMin: {
        type: Number
    },
    salaryMax: {
        type: Number
    },
    isClosed: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });
module.exports = mongoose.model("Job", JobSchema);