import { readJson, writeJson } from "../_app/FileHandler";
import path from "path";
const filePath = path.resolve(__dirname, "..", "data", "db.json");
const testFilePath = path.resolve(__dirname, "test.json");

//example movie from db.json
const example: TMovie = {
  id: 1,
  title: "Beetlejuice",
  year: "1988",
  runtime: "92",
  genres: ["Comedy", "Fantasy"],
  director: "Tim Burton",
  actors: "Alec Baldwin, Geena Davis, Annie McEnroe, Maurice Page",
  plot: 'A couple of recently deceased ghosts contract the services of a "bio-exorcist" in order to remove the obnoxious new owners of their house.',
  posterUrl:
    "https://images-na.ssl-images-amazon.com/images/M/MV5BMTUwODE3MDE0MV5BMl5BanBnXkFtZTgwNTk1MjI4MzE@._V1_SX300.jpg",
};

//helper function
expect.extend({
  toContainObject(received, argument) {
    const pass = this.equals(
      received,
      expect.arrayContaining([expect.objectContaining(argument)])
    );
    if (pass) {
      return {
        message: () =>
          `expected ${this.utils.printReceived(
            received
          )} not to contain object ${this.utils.printExpected(argument)}`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `expected ${this.utils.printReceived(
            received
          )} to contain object ${this.utils.printExpected(argument)}`,
        pass: false,
      };
    }
  },
});

describe("Read JSON File", () => {
  test("It should return error with msg", async () => {
    await expect(readJson("")).rejects.toEqual("File not found");
  });
  test("it shoudl return data", async () => {
    const file = await readJson(filePath);
    expect(file).toHaveProperty("genres");
    expect(file).toHaveProperty("movies");
    const { genres, movies } = file as TMovies;
    expect(genres).toContain("Action");
    expect(movies).toContainObject(example);
  });
});

describe("Write JSON File", () => {
  test("It should return error with msg", async () => {
    await expect(
      writeJson("", { genres: [], movies: [example] })
    ).rejects.toEqual("File not found");
  });
  test("it should write data to file and return msg ", async () => {
    const res = await writeJson(testFilePath, {
      genres: [],
      movies: [example],
    });
    expect(res).toEqual("File written");
    const file = await readJson(testFilePath);
    const { movies } = file as TMovies;
    expect(movies).toContainObject(example);
  });
});
