import prisma from "../../../shared/prisma";

const updateIntoDB = async (id: string, payload: any) => {
  const doctorInfo = await prisma.doctor.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const updatedDoctorInfo = await prisma.doctor.update({
    where: {
      id,
    },
    data: payload,
  });

  return updatedDoctorInfo;
};

export const DoctorService = {
  updateIntoDB,
};
