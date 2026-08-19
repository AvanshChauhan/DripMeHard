import cookieParser from "cookie-parser";
import express from "express";
import morgan from "morgan";
import authRouter from "./routes/auth.routes.js";
import passport from "passport"
import {Strategy as GoogleStrategy}from "passport-google-oauth20"
import { config } from "../config/config.js";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize())
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/auth", authRouter);
passport.use(new GoogleStrategy({
  clientID:config.GOOGLE_CLIENT_ID,
  clientSecret:config.GOOGLE_CLIENT_SECRET,
  callbackURL:"/api/auth/google/callback"
},(accessToken, refreshToken, profile, done)=>{
  return done(null,profile)
}))
export default app;
