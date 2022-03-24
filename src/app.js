const express = require("express");
const cors = require("cors");
const swaggerUI = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");
const bodyParser = require("body-parser");
require("dotenv").config();
const cookieSession = require("cookie-session");

require("./auth/passport");
require("./auth/passportGoogleSSO");

require("./models/user");

const middlewares = require("./middlewares");
const api = require("./api");
const passport = require("passport");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

app.use(passport.initialize());
app.use(passport.session());

/**
 * @swagger
 * /:
 *  get:
 *    description: this api is used to check the server status
 *    responses:
 *      200:
 *        description: server running
 */
app.get("/", (req, res) => {
  console.log("server running");
  return res.json({
    message: "server running",
  });
});

app.use("/api/v1", api);
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Library API",
      version: "1.0.0",
      description: "A simple Express Library API",
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Local server", // name
      },
    ],
  },
  apis: ["./src/api/*.js", "./src/app.js"],
};
const specs = swaggerJSDoc(options);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));
app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [process.env.COOKIE_KEY],
  })
);
app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

module.exports = app;
