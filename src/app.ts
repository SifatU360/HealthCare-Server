import express, { type Application, type Request, type Response } from 'express'
import cors from 'cors';
import { userRoutes } from './app/modules/User/user.routes';


const app: Application = express();
app.use(cors());

//parser

app.use(express.json());
app.use(express.urlencoded({extended : true}));

app.get('/', (req: Request, res: Response) => {
    res.send({
        Message: "HealthCare Server ..."
    })
});

app.use('/api/v1/user', userRoutes);

export default app;