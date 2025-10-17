import express, {
  NextFunction,
  type Application,
  type Request,
  type Response,
} from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./app/routes";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import httpStatus from "http-status";
import { AppointmentService } from "./app/modules/Appointment/appointment.service";
import cron from "node-cron";

const app: Application = express();
app.use(cors());
app.use(cookieParser());

//parser

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

cron.schedule("* * * * *", () => {
  try {
    AppointmentService.cancelUnpaidAppointments();
  } catch (err) {
    console.error(err);
  }
});

app.get("/", (req: Request, res: Response) => {
  res.send({
    Message: "HealthCare Server ...",
  });
});

// app.use('/api/v1/user', userRoutes);
// app.use("/api/v1/admin", AdminRoutes);
// app.use("/api/v1/auth", AuthRoutes);

app.use("/api/v1", router);

app.use(globalErrorHandler);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: "API NOT FOUND!",
    error: {
      path: req.originalUrl,
      message: "Your requested path is not found!",
    },
  });
});

export default app;
