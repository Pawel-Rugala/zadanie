import { Request, Response, NextFunction } from "express";
import { readJson, filePath } from "./FileHandler";

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
