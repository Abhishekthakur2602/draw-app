import { z } from "zod";

const signupSchema = z.object({
  username: z.string().min(3).max(20),
  firstname: z.string().min(3).max(20),
  lastname: z.string().min(3).max(20),
  email: z.string().email(),
  password: z
    .string()
    .min(8)
    .max(20)
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    ),
});

const signinSchema = z.object({
    email: z.string().email(),
    password:z.string().min(8).max(20).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)

})

const roomSchema = z.object({
    name: z.string().min(3).max(20),
  
})

export {signupSchema,signinSchema,roomSchema};