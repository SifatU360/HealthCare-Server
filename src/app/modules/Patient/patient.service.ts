import prisma from "../../../shared/prisma";

const updateIntoDB = async (id: string, payload: any) => {

  const patientInfo = await prisma.patient.findUniqueOrThrow({
    where: {
      id
    },
  });
  const result = await prisma.patient.update({
    where: {
        id
    },
    data: payload,
    include: {
        patientHealthData: true,
        medicalReport: true
    }
  })


  return result;
};

export const PatientService = {
  updateIntoDB,
};
