import request from "supertest";
import app from "../_app/app";

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
