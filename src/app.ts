import express, { type Application, type Request, type Response } from 'express'
import cors from 'cors';
import { userRoutes } from './app/modules/User/user.routes';
import { AdminRoutes } from './app/modules/Admin/admin.routes';
import { AuthRoutes } from './app/modules/Auth/auth.routes';
import cookieParser from 'cookie-parser';

const app: Application = express();
app.use(cors());
app.use(cookieParser())

//parser

app.use(express.json());
app.use(express.urlencoded({extended : true}));

app.get('/', (req: Request, res: Response) => {
    res.send({
        Message: "HealthCare Server ..."
    })
});

app.use('/api/v1/user', userRoutes);
app.use("/api/v1/admin", AdminRoutes);
app.use("/api/v1/auth", AuthRoutes);

export default app;