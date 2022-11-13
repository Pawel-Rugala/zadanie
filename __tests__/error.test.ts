import request from "supertest";
import app from "../_app/app";

describe("GET /error", () => {
  test("It should return status 400 with msg", async () => {
    const response = await request(app).get("/error");
    expect(response.statusCode).toBe(400);
    expect(response.text).toBe("Something went wrong!");
  });
});
