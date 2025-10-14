import { z } from "zod";
import { Gender } from "../../../../generated/prisma";

const createAdmin = z.object({
  password: z.string({
    error: "Password is required",
  }),
  admin: z.object({
    name: z.string({
      error: "Name is required!",
    }),
    email: z.string({
      error: "Email is required!",
    }),
    contactNumber: z.string({
      error: "Contact Number is required!",
    }),
  }),
});

const createDoctor = z.object({
  password: z.string({
    error: "Password is required",
  }),
  doctor: z.object({
    name: z.string({
      error: "Name is required!",
    }),
    email: z.string({
      error: "Email is required!",
    }),
    contactNumber: z.string({
      error: "Contact Number is required!",
    }),
    address: z.string().optional(),
    registrationNumber: z.string({
      error: "Registration Number is required!",
    }),
    experience: z.number().optional(),
    gender: z.enum([Gender.MALE, Gender.FEMALE]),
    appointmentFee: z.number({
      error: "Appointment Fee is required!",
    }),
    qualification: z.string({
      error: "Qualification is required!",
    }),
    currentWorkingPlace: z.string({
      error: "Current Workplace is required!",
    }),
    designation: z.string({
      error: "Designation is required!",
    })
  }),
});


const createPatient = z.object({
  password: z.string({
    error: "Password is required",
  }),
  patient: z.object({
    name: z.string({
      error: "Name is required!",
    }),
    email: z.string({
      error: "Email is required!",
    }),
    contactNumber: z.string({
      error: "Contact Number is required!",
    }),
    address: z.string().optional()
 }),
});


export const userValidation = {
  createAdmin,
  createDoctor,
  createPatient
};
