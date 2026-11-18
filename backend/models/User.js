const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["jobseeker", "employer"],
        required: true
    },
    avatar: String,
    resume: String,
    resumePublicId: String,
    resumeResourceType: String,
    title: String,
    bio: String,
    location: String,
    phone: String,
    portfolio: String,
    skills: [String],
    experience: String,
    education: String,
    availability: String,
    // for employeer
    companyName: String,
    companyDescription: String,
    companyLogo: String,
},{timestamps: true});
// Hash the password before saving the user
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return;
    }
    this.password = await bcrypt.hash(this.password, 10);
});
// match entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};
module.exports = mongoose.model("User", userSchema);