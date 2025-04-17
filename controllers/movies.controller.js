import Movie from "../models/movies.model.js";

export const movieIndex = async(req, res) => {
    try {
        const movie = await Movie.find();
        return res.status(200).json(movie);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

  export const movieCreate = async (req, res) => {
    
    const newMovie = new Movie({
        title: req.body.title,
        language: req.body.language,
        year: req.body.year,
    });
    try{
        const movie = await newMovie.save();
        return res.status(201).json(movie);
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
  };
 
  export const movieUpdate = async(req, res) => {
    try {
        const movie = await Movie.findOneAndUpdate(
            {_id: req.params.id},
            {title: req.body.title, language: req.body.language, year: req.body.year},
            {new: true}
        );
        return res.status(200).json(movie);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
  };

  export const movieDelete = async (req, res) => {
    const id = req.params.id;
    try {
        await Movie.deleteOne({_id: id});
        return res.status(200).json({ message: 'Movie deleted successfully' });
        
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
  };