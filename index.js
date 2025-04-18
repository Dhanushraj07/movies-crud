const express = require('express');
const app = express();
const movieRoutes = require('./routes/movie.route');
const connectDb = require('./lib/db');
const cors = require('cors');
app.use(cors());
app.set('view engine', 'pug');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
connectDb();

app.get('/', (req, res) => {
  res.status(200).render('index');
});



app.use('/api/movies', movieRoutes);

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
