const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/role');

// GET /movies?limit=20&page=1
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 12, 100);
    const skip = (page - 1) * limit;
    const total = await Movie.countDocuments();
    const movies = await Movie.find().sort({ imdbRank: 1 }).skip(skip).limit(limit);
    res.json({ movies, total, page, pages: Math.ceil(total/limit) });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// search: /movies/search?q=shawshank
router.get('/search', async (req, res) => {
  try {
    const q = req.query.q || '';
    const regex = new RegExp(q, 'i');
    const movies = await Movie.find({ $or: [{ title: regex }, { description: regex }] }).limit(100);
    res.json(movies);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// sorted: /movies/sorted?by=rating&order=desc
router.get('/sorted', async (req, res) => {
  try {
    const by = req.query.by || 'title';
    const order = req.query.order === 'desc' ? -1 : 1;
    const movies = await Movie.find().sort({ [by]: order }).limit(200);
    res.json(movies);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /movies/:id
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const movie = new Movie({ ...req.body, createdBy: req.user._id });
    await movie.save();
    res.status(201).json(movie);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(movie);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Movie.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;