const express = require('express');
const app = express();
const movieRoutes = require('./routes/movie.route');
const connectDb = require('./lib/db');
const cors = require('cors');
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
connectDb();

app.use('/movies', express.static('public'));



app.use('/api/movies', movieRoutes);

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
