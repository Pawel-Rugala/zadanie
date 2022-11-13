import request from "supertest";
import app from "../_app/app";
import path from "path";
import { readJson, writeJson } from "../_app/FileHandler";
const filePath = path.resolve(__dirname, "..", "data", "db.json");

describe("GET / REQUESTS", () => {
  test("GET / should return 200 and 1 movie", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
  });
  test("GET /?duration=92 should return 200 and 1 movie with runtime+-10", async () => {
    const dur = 92;
    const res = await request(app).get(`/?duration=${dur}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(+res.body[0].runtime).toBeGreaterThanOrEqual(dur - 10);
    expect(+res.body[0].runtime).toBeLessThanOrEqual(dur + 10);
  });
  test("GET /?genres=action should return 200 and body length > 1 with action genre", async () => {
    const genre = "Action";
    const res = await request(app).get(`/?genres=${genre}`);
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
    expect(res.body[0].genres).toContain(genre);
    const noDuplicates = res.body.length === [...new Set(res.body)].length;
    expect(noDuplicates).toBeTruthy();
  });
  test("GET /?duration=92&genres=action should return 200 and body length > 1 with action genre and movies with runtime+-10", async () => {
    const dur = 92;
    const genre = "Action";
    const res = await request(app).get(`/?duration=${dur}&genres=${genre}`);
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
    expect(res.body[0].genres).toContain(genre);
    expect(+res.body[0].runtime).toBeGreaterThanOrEqual(dur - 10);
    expect(+res.body[0].runtime).toBeLessThanOrEqual(dur + 10);
    const noDuplicates = res.body.length === [...new Set(res.body)].length;
    expect(noDuplicates).toBeTruthy();
  });
  test("GET /&genres=asd should return 400 with error msg", async () => {
    const genre = "asd";
    const res = await request(app).get(`/?genres=${genre}`);
    expect(res.status).toBe(400);
    expect(res.text).toBe("Provided genres do not match any movies");
  });
  test("GET /&duration=9999 should return 400 with error msg", async () => {
    const dur = 9999;
    const res = await request(app).get(`/?duration=${dur}`);
    expect(res.status).toBe(400);
    expect(res.text).toBe("No movies found with provided duration");
  });
});

describe("POST / REQUESTS", () => {
  test("POST / with valid movie should return status 201 with msg", async () => {
    const movie = {
      title: "TEST MOVIE 123",
      year: 9999,
      runtime: 999,
      genres: ["action", "comedy"],
      director: "TEST DIRECTOR",
    };
    const res = await request(app).post("/").send(movie);
    expect(res.status).toBe(201);
    expect(res.body.movie).toMatchObject(movie);
    expect(res.body.msg).toBe("File written");
  });
  test("POST / with same movie data should return status 400 with msg", async () => {
    const movie = {
      title: "TEST MOVIE 123",
      year: 9999,
      runtime: 999,
      genres: ["action", "comedy"],
      director: "TEST DIRECTOR",
    };
    const res = await request(app).post("/").send(movie);
    expect(res.status).toBe(400);
    expect(res.text).toBe("Movie already exist");
  });
  test("POST / with invlaid data should return status 400 with msg", async () => {
    const movie = {
      year: 9999,
      runtime: 999,
      genres: ["action", "comedy"],
      director: "TEST DIRECTOR",
    };
    const res = await request(app).post("/").send(movie);
    expect(res.status).toBe(400);
    expect(res.text).toBe("Missing required fields");
  });
  test("POST / with invlaid genre return status 400 with msg", async () => {
    const movie = {
      title: "TEST MOVIE 123",
      year: 9999,
      runtime: 999,
      genres: ["asd", "qwe"],
      director: "TEST DIRECTOR",
    };
    const res = await request(app).post("/").send(movie);
    expect(res.status).toBe(400);
    expect(res.text).toBe("Invalid genres: asd, qwe");
  });
  test("POST / with invlaid year return status 400 with msg", async () => {
    const movie = {
      title: "TEST MOVIE 123",
      year: "9999",
      runtime: 999,
      genres: ["action", "comedy"],
      director: "TEST DIRECTOR",
    };
    const res = await request(app).post("/").send(movie);
    expect(res.status).toBe(400);
    expect(res.text).toBe("Year is not a number");
  });
  test("POST / directory too long return status 400 with msg", async () => {
    const movie = {
      title: "TEST MOVIE 123",
      year: 9999,
      runtime: 999,
      genres: ["action", "comedy"],
      director: "TEST DIRECTOR".repeat(260),
    };
    const res = await request(app).post("/").send(movie);
    expect(res.status).toBe(400);
    expect(res.text).toBe("Director name is too long");
  });
});

afterAll(async () => {
  const { genres, movies } = await readJson(filePath);
  const newMovies = movies.filter((movie) => movie.title !== "TEST MOVIE 123");
  await writeJson(filePath, { genres, movies: newMovies });
});