import express from 'express';
import Course from '../models/Course.js';

const router = express.Router();

// --- GET a course by _id ---
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ error: 'Course not found' });
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// --- POST to create a new course ---
router.post('/', async (req, res) => {
  try {
    const course = new Course(req.body);
    await course.save();
    res.status(201).json(course);
  } catch (err) {
    res.status(400).json({ error: 'Invalid data', details: err.message });
  }
});

// --- PUT to update an existing course ---
router.put('/:id', async (req, res) => {
  try {
    const updated = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ error: 'Course not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Update failed', details: err.message });
  }
});

export default router;
