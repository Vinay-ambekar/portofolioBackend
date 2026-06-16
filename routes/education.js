const express = require('express');
const Education = require('../models/Education');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    let data = await Education.findOne();
    if (!data) {
      data = await Education.create({});
    }
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const data = await Education.create(req.body);
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/update', auth, async (req, res) => {
  try {
    const { _id, ...updateData } = req.body;
    if (!_id) return res.status(400).json({ message: '_id is required in the request body' });

    const data = await Education.findByIdAndUpdate(
      _id,
      { $set: updateData },
      { new: true, runValidators: true }
    );
    if (!data) return res.status(404).json({ message: 'Education data not found' });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
