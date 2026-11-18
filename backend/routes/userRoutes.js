const express = require('express');
const {updateProfile, deleteResume, uploadResume, getPublicProfile} = require('../controllers/userController');
const {protect} = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.put('/profile', protect, updateProfile);
router.delete('/resume', protect, deleteResume);
router.post('/resume', protect, upload.single('resume'), uploadResume);
router.get('/:id', getPublicProfile);

module.exports = router;
