const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");

app.use(express.json());

const USERS = [
  {
    username: "ismail",
    password: "supersecret",
  },
  {
    username: "someuser",
    password: "user",
  },
  {
    username: "admin",
    password: "password",
  },
];

function isAuthtenticated(req, res, next) {
  const authHeader = req.headers["authorization"];
  console.log(authHeader);
  if (!authHeader) {
    return res.status(401).json({ message: "Unauthenticated" });
  }
  // Bearer token
  const token = authHeader.split(" ")[1];
  console.log(token);
  if (!token) {
    return res.status(401).json({ message: "Unauthenticated" });
  }
  const user = jwt.verify(token, "secret");
  if (!user) {
    return res.status(403).json({ message: "Unauthenticated" });
  }
  req.user = user;
  next();
}

app.get("/", isAuthtenticated, (req, res) => {
  res.json(`${req.user.username} You are Authenticated 🚀🚀`);
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and Password is required" });
  }
  const user = USERS.find((user) => user.username === username);
  if (!user) {
    return res.status(400).json({ message: "Cannot find user" });
  }
  if (user.password !== password) {
    return res.status(400).json({ message: "Password is incorrect" });
  }
  // authenticate
  const token = jwt.sign({ username: username }, "secret", {
    expiresIn: "1800s",
  });

  res.json({ message: "Login Successful", token: token });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
