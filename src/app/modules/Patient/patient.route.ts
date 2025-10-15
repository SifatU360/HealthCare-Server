import express from 'express'
import { PatientController } from './patient.controller';

const router = express.Router();

router.patch(
    '/:id',
    PatientController.updateIntoDB
)

export const PatientRoutes = router