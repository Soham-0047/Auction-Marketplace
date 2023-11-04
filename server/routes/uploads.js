const express = require('express');
const fs = require('fs');
const util = require('util');
const unlinkFile = util.promisify(fs.unlink);
const router = express.Router();
const multer = require('multer');
const isAuth = require('../middlewares/isAuth');
const { uploadFile, getFileStream } = require('../utils/s3');

const cloudinary = require("../utils/cloudinary");


const upload = multer({ dest: 'uploads' });

// @route   POST /upload/image
// @desc    Upload product images
// @access  protected

router.post('/image', isAuth, upload.single('image'), async (req, res) => {
  const file = req.file.path;
  try {
    // const result = await uploadFile(file);

    const result = await cloudinary.uploader.upload(file);

    console.log(result)
    // await unlinkFile(file);
    console.log(result.url)
    res.status(200).json({imagePath:`${result.url}`});
    
  } catch (error) {
    console.log(error);
    res.status(500).json({ errors: { msg: 'Server error' } });
  }
});

// @route   GET /upload/image/:key
// @desc    Get image with key
// @access  protected

router.get('/image/:key', async (req, res) => {
  try {
    const fileBuffer = await getFileStream(req.params.key);

    res.status(200).send(fileBuffer);
    // readStream.pipe(res);
  } catch (error) {
    console.log(error);
    res.status(500).json({ errors: { msg: 'Server error' } });
  }
});

module.exports = router;
