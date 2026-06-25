const cloudinary = require('../config/cloudinary');

/**
 * Determine upload folder based on MIME type
 */
const getFolder = (mimetype) => {
  if (mimetype.startsWith('image/')) return 'images';
  if (mimetype === 'application/pdf') return 'pdfs';
  if (mimetype.startsWith('video/')) return 'videos';
  return 'others';
};

/**
 * Upload a single file buffer to Cloudinary
 */
const uploadToCloudinary = (buffer, mimetype) => {
  return new Promise((resolve, reject) => {
    const folder = getFolder(mimetype);
    const base64 = `data:${mimetype};base64,${buffer.toString('base64')}`;

    cloudinary.uploader.upload(
      base64,
      {
        folder,
        resource_type: 'auto',
      },
      (error, result) => {
        if (error) return reject(error);
        resolve({
          url: result.secure_url,
          public_id: result.public_id,
          asset_id: result.asset_id,
          format: result.format,
          resource_type: result.resource_type,
          bytes: result.bytes,
          original_filename: result.original_filename,
        });
      }
    );
  });
};

/**
 * Upload single file
 */
const uploadSingle = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file provided' });
    }

    const result = await uploadToCloudinary(req.file.buffer, req.file.mimetype);

    res.status(201).json({
      message: 'File uploaded successfully',
      data: result,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Upload multiple files
 */
const uploadMultiple = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files provided' });
    }

    const uploadPromises = req.files.map((file) =>
      uploadToCloudinary(file.buffer, file.mimetype)
    );

    const results = await Promise.all(uploadPromises);

    res.status(201).json({
      message: `${results.length} file(s) uploaded successfully`,
      data: results,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Delete a single file by public_id
 */
const deleteSingle = async (req, res) => {
  try {
    const { public_id } = req.params;

    if (!public_id) {
      return res.status(400).json({ message: 'public_id is required' });
    }

    const result = await cloudinary.uploader.destroy(public_id);

    if (result.result === 'not found') {
      return res.status(404).json({ message: 'File not found on Cloudinary' });
    }

    res.json({
      message: 'File deleted successfully',
      data: { public_id, result: result.result },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Delete multiple files by public_ids
 */
const deleteMultiple = async (req, res) => {
  try {
    const { public_ids } = req.body;

    if (!public_ids || !Array.isArray(public_ids) || public_ids.length === 0) {
      return res
        .status(400)
        .json({ message: 'public_ids array is required' });
    }

    const result = await cloudinary.api.delete_resources(public_ids);

    res.json({
      message: `${public_ids.length} file(s) deletion processed`,
      data: result,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  uploadSingle,
  uploadMultiple,
  deleteSingle,
  deleteMultiple,
};
