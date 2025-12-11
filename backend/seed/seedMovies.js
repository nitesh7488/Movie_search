require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Movie = require('../models/Movie');

const sampleMovies = Array.from({ length: 250 }).map((_, i) => {
  const rank = i + 1;
  return {
    title: `Top Movie ${rank}`,
    year: 1970 + (rank % 50),
    rating: +((8.0 + Math.random() * 1.5).toFixed(1)),
    duration: `${100 + (rank % 60)} min`,
    description: `Placeholder description for Top Movie ${rank}. This is seeded sample data (IMDb Top 250 placeholder).`,
    poster: `https://picsum.photos/seed/movie${rank}/300/450`,
    imdbRank: rank,

    // 🔥 ADD THIS → generate unique IMDb-style IDs
    imdbID: `tt${String(1000000 + rank)}`
  };
});

const seed = async () => {
  await connectDB();
  try {
    await Movie.deleteMany({});
    await Movie.insertMany(sampleMovies);
    console.log('Inserted', sampleMovies.length, 'movies');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();
