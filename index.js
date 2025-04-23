const express = require('express');
const app = express();
const movieRoutes = require('./routes/movie.route');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const connectDb = require('./lib/db');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
app.use(cors());
app.set('view engine', 'pug');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
connectDb();


app.use('/api', rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // Limit each IP to 100 requests per windowMs
}));
app.get('/', (req, res) => {
  res.status(200).render('index');
});



app.use('/api/movies', movieRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
