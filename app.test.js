const mongoose = require("mongoose");
const request = require("supertest");
const app = require("./index");
const url = "mongodb://localhost:27017/io";
/* Connecting to the database before each test. */
beforeEach(async () => {
  await mongoose.connect(url);
});

/* Closing database connection after each test. */
afterEach(async () => {
  await mongoose.connection.close();
});

describe("GET /io", () => {
  it("should return all histroy", async () => {
    const res = await request(app).get("/io");
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });
});

describe("Post /io", () => {
  it("should create a histroy", async () => {
    const res = await request(app).post("/io").send({
      inputVal: "pAssw0rd",
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.input).toBe("pAssw0rd");
  });
});
