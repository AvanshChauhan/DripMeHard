import cookieParser from "cookie-parser";
import express from "express";
import morgan from "morgan";

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

export default app;
