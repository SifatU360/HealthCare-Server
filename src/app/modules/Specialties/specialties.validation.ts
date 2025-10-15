import z from "zod";

const createSpecialties = z.object({
  title: z.string({
    error: "Specialty title is required!",
  }),
});

export const SpecialtiesValidation = {
  createSpecialties,
};
