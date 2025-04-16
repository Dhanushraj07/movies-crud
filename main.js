const express = require('express');
const app = express();
const movieRoutes = require('./routes/movie.route');
const connectDb = require('./lib/db');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
connectDb();
app.get('/', (req, res) => {
  res.json({ message: 'Hello, World!' });
});

app.use('/movies', movieRoutes);

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});