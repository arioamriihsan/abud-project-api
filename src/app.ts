import express from "express";
import logger from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import dbInit from "./model/init";
import { customRequest } from "./types/customDefinition";
import { deserializeUser, languageDetector } from "./middleware";
import appRouter from "./routes/v1";
import { errorHandler } from "./middleware/error";

// Create Express server
const app = express();

app.use(logger("dev"));
app.set("port", process.env.PORT || 5000);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.REACT_APP_URL,
    credentials: true,
  })
);
app.use(deserializeUser);
app.use(languageDetector);

/**
 * Primary app routes.
 */

app.use("/api/v1", appRouter);

/**
 * route to test server
 */

app.get("/api/", (req: customRequest, res) => {
  res.status(200).json({ msg: "server is up..", user: req.user });
});

/**
 * route to sync db.
 */
app.patch("/api/sync", async (req, res) => {
  try {
    const sync = await dbInit();
    res.status(200).json({ ...sync, error: false });
  } catch (err) {
    console.log("ERR", err);
    let msg = "Internal Server Error";
    if (err instanceof Error) {
      msg = err.message;
    } else if (err) {
      msg = err;
    }
    return res.status(400).json({ errorMsg: msg, error: true });
  }
});

// middleware to handle error
app.use(errorHandler);

export default app;
