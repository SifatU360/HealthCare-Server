import { Patient } from "../../../../generated/prisma";
import prisma from "../../../shared/prisma";
import { IPatientUpdate } from "./patient.interface";

const getByIdFromDB = async (id: string): Promise<Patient | null> => {
  const result = await prisma.patient.findUnique({
    where: {
      id,
      isDeleted: false,
    },
    include: {
      medicalReport: true,
      patientHealthData: true,
    },
  });
  return result;
};

const updateIntoDB = async (
  id: string,
  payload: Partial<IPatientUpdate>
): Promise<Patient | null> => {
  const { patientHealthData, medicalReport, ...patientData } = payload;

  const patientInfo = await prisma.patient.findUniqueOrThrow({
    where: {
      id,
    },
  });
  const result = await prisma.$transaction(async (transactionClient) => {
    const result = await transactionClient.patient.update({
      where: {
        id,
      },
      data: patientData,
      include: {
        patientHealthData: true,
        medicalReport: true,
      },
    });
    // create or update patient health data
    if (patientHealthData) {
      await transactionClient.patientHealthData.upsert({
        where: {
          patientId: patientInfo.id,
        },
        update: patientHealthData,
        create: { ...patientHealthData, patientId: patientInfo.id },
      });
    }

    if (medicalReport) {
      await transactionClient.medicalReport.create({
        data: { ...medicalReport, patientId: patientInfo.id },
      });
    }
  });

  const responseData = await prisma.patient.findUnique({
    where: {
      id: patientInfo.id,
    },
    include: {
      patientHealthData: true,
      medicalReport: true,
    },
  });
  return responseData;
};

const deleteFromDB = async (id: string): Promise<Patient | null> => {
  const result = await prisma.$transaction(async (tx) => {
    // delete medical report
    await tx.medicalReport.deleteMany({ // One to Many -> DeleteMany
      where: {
        patientId: id,
      },
    });

    // delete patient health data
    await tx.patientHealthData.deleteMany({ // deleteMany() will: Delete the record if it exists. Do nothing (and not throw an error) if it doesn’t.
      where: {
        patientId: id,
      },
    });

    const deletedPatient = await tx.patient.delete({
      where: {
        id,
      },
    });

    await tx.user.delete({
      where: {
        email: deletedPatient.email,
      },
    });

    return deletedPatient; // For Transaction
  });

  return result; // For send to Controller
};

export const PatientService = {
  getByIdFromDB,
  updateIntoDB,
  deleteFromDB,
};
