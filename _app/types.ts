// create type for db/db.json file

type TGenres = string[];

type TMovie = {
  id: number;
  title: string;
  year: string;
  runtime: string;
  genres: TGenres;
  director: string;
  actors: string;
  plot: string;
  posterUrl: string;
};

type TMovies = {
  genres: TGenres;
  movies: TMovie[];
};
