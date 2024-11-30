import express, { Request, Response, Application, NextFunction } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import status from "http-status";
import router from "./app/routes";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";

const app: Application = express();

//parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:5173"],
  })
);

// application routes
app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.send("Campers shop is running");
});
//Testing
app.get("/", (req: Request, res: Response) => {
  res.status(status.OK).json({
    success: true,
    message: "Welcome to the Campers shop API",
  });
});
app.use(globalErrorHandler);

// Not Found
app.use(notFound);
export default app;
