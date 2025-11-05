import "dotenv/config";
import cookieParser from "cookie-parser";
import cors, { type CorsOptions } from "cors";
import express, { type Express } from "express";
import morgan from "morgan";
import router from "./routes/index";
import compression from "compression";
import rateLimit from "express-rate-limit";
const app: Express = express();

export const corsOptions: CorsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:4173",
    process.env.CLIENT_URL || "",
  ],
  credentials: true,
  allowedHeaders: ["Content-type"],
};

const apiLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests from this IP, please try again later.",
});

app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(apiLimiter);

app.use(router);

export { app };
