const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const auth = require('../middleware/auth');
const {
  uploadSingle,
  uploadMultiple,
  deleteSingle,
  deleteMultiple,
} = require('../controllers/uploadController');

// Upload routes (auth protected)
router.post('/single', auth, upload.single('file'), uploadSingle);
router.post('/multiple', auth, upload.array('files', 10), uploadMultiple);

// Delete routes (auth protected)
router.delete('/delete/:public_id', auth, deleteSingle);
router.post('/delete-multiple', auth, deleteMultiple);

module.exports = router;
