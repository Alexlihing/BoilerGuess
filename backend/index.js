const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const users = require("./routes/users");
const maps = require("./routes/maps");
const session = require("express-session");
require("./middlewear/passport");
const passport = require("passport");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");
const game = require("./routes/game");
const fileUpload = require("./routes/fileUpload");
//add mongoose compass connection logic
//or add other database connection logic

mongoose
  .connect(
    `${process.env.MONGO_URL}`,

    { readPreference: "secondaryPreferred", serverSelectionTimeoutMS: 50000 }
  )
  .then(() => console.log("Connected to MongoDB Atlas..."))
  .catch((err) => console.error("Could not connect to MongoDB Atlas..."));

app.use(
  cors({
    origin: "purdue-geoguessr.vercel.app",
    credentials: true, // Allow cookies and other credentials
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Origin",
      "Access-Control-Request-Method",
      "Access-Control-Request-Headers",
    ],
  })
);
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Ensure this is set up

app.use(express.json());
// Serve static files (like images) from the 'uploads' directory

app.use(express.static(path.join(__dirname, "public")));
app.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Origin",
    "https://purdue-geoguessr.vercel.app"
  );

  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  next();
});

app.set("trust proxy", true);

app.use(
  session({
    secret: "abc kat",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: `${process.env.MONGO_URL}`,
    }),
    cookie: {
      // Ensures it's sent over HTTPS
      path: "/",
      sameSite: "None", // Cross-site cookie
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      secure: true,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

//add mongoose compass connection logic

app.use((req, res, next) => {
  console.log(req.cookies); // Log the cookies to check if they are sent
  next();
});

app.get("/hello", (req, res) => {
  res.send("hello wd");
});

app.get("/", (req, res) => {
  res.send("hello world");
});

app.use("/api/users", users);
app.use("/api/maps", maps);
app.use("/api/auth", require("./routes/auth"));
app.use("/api/game", game);
app.use("/api/fileUpload", fileUpload);

const port = process.env.PORT || 3011;

module.exports = app;
