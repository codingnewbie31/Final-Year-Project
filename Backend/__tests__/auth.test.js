const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../app");
const User = require("../models/User");

let mongoServer;

// ── Start in-memory MongoDB before all tests ─────────────────────────
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

// ── Clean up users between tests ─────────────────────────────────────
afterEach(async () => {
  await User.deleteMany();
});

// ── Disconnect after all tests ────────────────────────────────────────
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

// ── Reusable test user data ───────────────────────────────────────────
const testUser = {
  name: "John Doe",
  email: "john@example.com",
  password: "Password123!",
  role: "jobseeker",
};

// ────────────────────────────────────────────────────────────────────
describe("Auth API - Register", () => {

  // ✅ Test 1: Register successfully
  test("should register a new user and return token", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send(testUser)

    expect(res.statusCode).toBe(201)
    expect(res.body).toHaveProperty("token")
    expect(res.body.email).toBe(testUser.email)
    expect(res.body.role).toBe("jobseeker")
  })

  // ✅ Test 2: Reject duplicate email
  test("should return 400 if user already exists", async () => {
    await request(app).post("/api/auth/register").send(testUser)
    const res = await request(app).post("/api/auth/register").send(testUser)

    expect(res.statusCode).toBe(400)
    expect(res.body.message).toBe("User already exists")
  })

  // ✅ Test 3: Password is hashed in DB
  test("should store hashed password in database", async () => {
    await request(app).post("/api/auth/register").send(testUser)
    const user = await User.findOne({ email: testUser.email })

    expect(user.password).not.toBe(testUser.password)
    expect(user.password).toMatch(/^\$2[ab]\$/)  // bcrypt hash pattern
  })

  // ✅ Test 4: Register as employer
  test("should register an employer successfully", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ ...testUser, role: "employer" })

    expect(res.statusCode).toBe(201)
    expect(res.body.role).toBe("employer")
    expect(res.body).toHaveProperty("token")
  })

})

// ────────────────────────────────────────────────────────────────────
describe("Auth API - Login", () => {

  beforeEach(async () => {
    // Register a user before each login test
    await request(app).post("/api/auth/register").send(testUser)
  })

  // ✅ Test 5: Login successfully
  test("should login with correct credentials and return token", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: testUser.email, password: testUser.password })

    expect(res.statusCode).toBe(200)
    expect(res.body).toHaveProperty("token")
    expect(res.body.email).toBe(testUser.email)
  })

  // ✅ Test 6: Reject wrong password
  test("should return 401 for wrong password", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: testUser.email, password: "wrongpassword" })

    expect(res.statusCode).toBe(401)
    expect(res.body.message).toBe("Invalid email or password")
  })

  // ✅ Test 7: Reject non-existent email
  test("should return 401 for non-existent email", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "nobody@example.com", password: "Password123!" })

    expect(res.statusCode).toBe(401)
    expect(res.body.message).toBe("Invalid email or password")
  })

  // ✅ Test 8: Token is valid JWT
  test("should return a valid JWT token on login", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: testUser.email, password: testUser.password })

    const token = res.body.token
    const parts = token.split(".")
    expect(parts).toHaveLength(3) // JWT has 3 parts
  })

})

// ────────────────────────────────────────────────────────────────────
describe("Auth API - Get Me", () => {

  // ✅ Test 9: Get profile with valid token
  test("should return user profile with valid token", async () => {
    const registerRes = await request(app)
      .post("/api/auth/register")
      .send(testUser)

    const token = registerRes.body.token

    const res = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${token}`)

    expect(res.statusCode).toBe(200)
    expect(res.body.user.email).toBe(testUser.email)
  })

  // ✅ Test 10: Reject request without token
  test("should return 401 when no token is provided", async () => {
    const res = await request(app).get("/api/auth/me")

    expect(res.statusCode).toBe(401)
  })

})