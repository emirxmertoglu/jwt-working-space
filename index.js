import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { authMiddleware } from "./middlewares.js";

dotenv.config();

const app = express();
app.use(express.json());

const user = {
  username: "admin",
  email: "admin@gmail.com",
  password: "123456",
};

const animalsArray = [
  {
    name: "Lion",
    cratedAt: new Date(),
  },
  {
    name: "Tiger",
    cratedAt: new Date(),
  },
  {
    name: "Elephant",
    cratedAt: new Date(),
  },
];

let refreshTokens = [];

app.get("/animals", authMiddleware, (req, res) => {
  console.log(req.tokenPayload);
  res.json(animalsArray);
});

app.post("/logout", async (req, res) => {
  console.log("refreshTokens", refreshTokens);
  const { refreshToken } = req.body;

  if (!refreshToken) return res.sendStatus(401);
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(401);

  refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
  console.log("refreshTokens", refreshTokens);

  return res.sendStatus(200);
});

app.post("/refresh", async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) return res.sendStatus(401);
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(401);
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, data) => {
    if (err) {
      console.log(err);
      return res.status(400).json(err);
    }

    const accessToken = jwt.sign(
      { email: data.email, username: data.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "2m" }
    );

    return res.status(200).json({ accessToken });
  });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (email !== user.email || password !== user.password) {
    return res.status(401).json({
      message: "Invalid credentials",
    });
  }

  const accessToken = jwt.sign(
    { email: user.email, username: user.username },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "2m" }
  );

  const refreshToken = jwt.sign(
    { email: user.email, username: user.username },
    process.env.REFRESH_TOKEN_SECRET
  );

  refreshTokens.push(refreshToken);

  return res.status(200).json({ accessToken, refreshToken });
});

app.get("/", (req, res) => {
  res.send("Server online..");
});

app.listen(5000, () => {
  console.log("Server started on port 5000");
});
