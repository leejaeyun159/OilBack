import express from "express";
import cors from "cors";
import routes from "../api/routes";
import config from "../config";
import logger from "../utils/logger";
import cookieParser from "cookie-parser";
import session from "express-session";
import morgan from "morgan";
import CustomError from "../utils/customError";
import responseDto from "../utils/customResponse";
import passport from "passport";
import passportConfig from "../utils/passport";

export default (app) => {
  // middleware
  passportConfig();
  app.use(morgan(":method :status :url :response-time ms", { stream: logger.stream }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser(config.cookie_secret));
  app.use(
    session({
      secret: config.cookie_secret,
      resave: false,
      saveUninitialized: false,
      cookie: { httpOnly: true, secure: true },
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(cors());

  // router
  app.use(config.api.prefix, routes());
  app.use("/favicon.ico", (req, res) => res.status(204));
  app.use((req, res, next) => {
    const error = new CustomError("NOT_FOUND", 404, "페이지를 찾을 수 없습니다.");
    next(error);
  });

  // error handler
  app.use((err, req, res, next) => {
    res.status(err.status || 500).json(responseDto({ suc: false, mes: err.message }));
  });

  console.log("    › EXPRESS LOADED");
};
