import request from "supertest";
import app from "../_app/app";

describe("GET /test", () => {
  test("It should return status 200 with msg", async () => {
    const response = await request(app).get("/test");
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe("Allo Allo!");
  });
});
