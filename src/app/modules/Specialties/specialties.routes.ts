import express, { NextFunction, Request, Response } from 'express'
import { fileUploader } from '../../../helpers/fileUploader';
import { SpecialtiesController } from './specialties.controller';
import { SpecialtiesValidation } from './specialties.validation';

const router = express.Router();

router.post(
  "/",
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = SpecialtiesValidation.createSpecialties.parse( JSON.parse(req.body.data));
    return SpecialtiesController.inserIntoDB(req, res, next);
  }
);

export const SpecialtiesRoutes = router