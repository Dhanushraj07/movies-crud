import Movie from "../models/movies.model.js";
import User from "../models/userModel.js";
// export const movieCount = async (req, res) => {
//     try {
//         const count = await Movie.countDocuments();
//         console.log("Total movies in database:", count);
//         return res.status(200).json({ count});
        
//     } catch (error) {
//         return res.status(500).json({ error: error.message });
//     }
    
// };
//PAGINATION
export const movieShow = async (req, res) => {
    try {
        const page = req.query.page * 1 || 1;
        const limit = req.query.limit * 1 || 5;
        const skip = (page - 1) * limit;
        // Define base query
        let query = Movie.find().sort({title: 1});
        // Apply pagination
        query = query.skip(skip).limit(limit);
        // Execute the query
        const movies = await query;
        if (!movies || movies.length === 0) {
            return res.status(404).json({ message: 'No movies found' });
        }
        return res.status(200).json(movies);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
export const movieIndex = async(req, res) => {
    try {
        const movie = await Movie.find().sort({title: 1});
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

  export const userDetails = async (req, res) => {
    try {
        const user = await User.find();
        return res.status(200).json({
            status: 'success',
            results: user.length,
            user
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
  }