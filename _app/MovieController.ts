import { Request, Response, NextFunction } from "express";
import { readJson, filePath, writeJson } from "./FileHandler";

export const getMovies = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const file = await readJson(filePath);
    const { genres, movies } = file;
    let result: TMovie[] = movies;

    // no query params
    if (Object.keys(req.query).length === 0) {
      const randomMovie = movies[Math.floor(Math.random() * movies.length)];
      result = [randomMovie];
    }

    // with duration query param
    if (req.query.duration) {
      const duration = req.query.duration;
      result = movies.filter(
        (movie) =>
          +movie.runtime <= +duration + 10 && +movie.runtime >= +duration - 10
      );
      if (result.length === 0) {
        throw new Error("No movies found with provided duration");
      }
    }

    // with genre query param
    if (req.query.genres) {
      const genresArr = Array.isArray(req.query.genres)
        ? req.query.genres
        : [req.query.genres];

      const lowerGenresArr = genresArr.map((genre) => {
        if (typeof genre === "string") {
          return genre.toLowerCase();
        }
      });

      result = result.filter((movie) => {
        const movieGenres = movie.genres.map((genre) => genre.toLowerCase());
        return lowerGenresArr.some((genre) =>
          movieGenres.includes(genre as string)
        );
      });

      if (result.length === 0) {
        throw new Error("Provided genres do not match any movies");
      }

      result = result.sort((a, b) => {
        const aMovie = a.genres.filter((genre) =>
          lowerGenresArr.includes(genre.toLowerCase())
        );
        const bMovie = b.genres.filter((genre) =>
          lowerGenresArr.includes(genre.toLowerCase())
        );
        return aMovie.length > bMovie.length ? -1 : 1;
      });
    }

    // without genre and with duration return 1 movie
    if (!req.query.genres && req.query.duration) {
      const randomMovie = result[Math.floor(Math.random() * result.length)];
      result = [randomMovie];
    }

    res.send(result);
  } catch (err) {
    next(err);
  }
};

export const addMovie = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //check if request is type of json
    if (!req.is("application/json")) {
      throw new Error("Request body must be of type application/json");
    }

    const { genres, title, year, runtime, director } = req.body;

    if (!genres || !title || !year || !runtime || !director) {
      throw new Error("Missing required fields");
    }

    const data = await readJson(filePath);
    const { genres: dbGenres } = data;
    const validGenres = dbGenres.map((genre) => genre.toLowerCase());
    const invalidGenres = genres.filter(
      (genre: string) => !validGenres.includes(genre.toLowerCase())
    );
    if (invalidGenres.length > 0) {
      throw new Error(`Invalid genres: ${invalidGenres.join(", ")}`);
    }

    if (title.length > 255) {
      throw new Error("Title is too long");
    }
    // check if year is a number
    if (typeof year !== "number") {
      throw new Error("Year is not a number");
    }
    // check if runtime is a number
    if (typeof runtime !== "number") {
      throw new Error("Runtime is not a number");
    }
    if (director.length > 255) {
      throw new Error("Director name is too long");
    }

    const { movies } = data;
    const movieExist = movies.find(
      (movie) =>
        movie.title === title &&
        movie.year === year.toString() &&
        movie.director === director
    );
    if (movieExist) {
      throw new Error("Movie already exist");
    }

    const { actors, plot, posterUrl } = req.body;

    const newMovie: TMovie = {
      id: movies.length + 1,
      title,
      year: year.toString(),
      runtime: runtime.toString(),
      genres,
      director,
      actors,
      plot,
      posterUrl,
    };
    movies.push(newMovie);
    const writeRes = await writeJson(filePath, data);
    return res.status(201).send({ msg: writeRes, movie: req.body });
  } catch (err) {
    next(err);
  }
};