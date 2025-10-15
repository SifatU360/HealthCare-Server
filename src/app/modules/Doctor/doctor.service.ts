import prisma from "../../../shared/prisma";

const updateIntoDB = async (id: string, payload: any) => {
  const { specialties, ...doctorData } = payload;

  const doctorInfo = await prisma.doctor.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const result = await prisma.$transaction(async (transactionClent) => {
    const updatedDoctorInfo = await transactionClent.doctor.update({
      where: {
        id,
      },
      data: doctorData,
      include: {
        doctorSpecialties: true,
      },
    });

    for(const specialtiesId of specialties){
      const createSpecialties = await transactionClent.doctorSpecialties.create({
        data: {
          doctorId: doctorInfo.id,
          specialtiesId: specialtiesId
        }
      })
    }

    return updatedDoctorInfo
  });

  return result;
};

export const DoctorService = {
  updateIntoDB,
};
