// Imports
import express from "express";
import morgan from "morgan";
import qs from "qs";
import userRouter from "./routes/userRoute.js";
import qrRouter from "./routes/qrRoute.js";
import cors from "cors";

const app = express();
// Middleware
app.use(cors());

app.use(express.json());
app.use(morgan("dev"));
app.use((req, _res, next) => {
  req.respondTime = new Date().toISOString();
  next();
});

// Custom query parser
app.set("query parser", (str) => qs.parse(str));
// Routes
app.use("/api/users", userRouter);
app.use("/api/qr", qrRouter);

export default app;
