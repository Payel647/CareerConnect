const User = require("../models/User");
const jwt = require("jsonwebtoken");

//generate token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "30d"
    });
};
exports.register = async (req, res) => {
    try{
        const { name, email, password, avatar, role } = req.body;
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ error: "User already exists" });
        }
        const user = await User.create({
            name,
            email,
            password,
            avatar,
            role
        });
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            role: user.role,
            token: generateToken(user._id),
            title: user.title || "",
            bio: user.bio || "",
            location: user.location || "",
            phone: user.phone || "",
            portfolio: user.portfolio || "",
            skills: user.skills || [],
            experience: user.experience || "",
            education: user.education || "",
            availability: user.availability || "",
            companyName: user.companyName || "",
            companyDescription: user.companyDescription || "",
            companyLogo: user.companyLogo || "",
            resume: user.resume || ""
        });
    }catch(err){
        res.status(400).json({error: err.message});
    }
};
exports.login = async (req, res) => {
         try{
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ error: "Invalid email or password" });
        }
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            role: user.role,
            token: generateToken(user._id),
            title: user.title || "",
            bio: user.bio || "",
            location: user.location || "",
            phone: user.phone || "",
            portfolio: user.portfolio || "",
            skills: user.skills || [],
            experience: user.experience || "",
            education: user.education || "",
            availability: user.availability || "",
            companyName: user.companyName || "",
            companyDescription: user.companyDescription || "",
            companyLogo: user.companyLogo || "",
            resume: user.resume || ""
        });
    }catch(err){
        res.status(400).json({error: err.message});
    }
};
exports.getMe = async (req, res) => {
    res.json(req.user);
};