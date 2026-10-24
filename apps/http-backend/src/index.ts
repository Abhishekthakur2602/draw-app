import express from "express";
import jwt from "jsonwebtoken";
import { slugify, z } from "zod";
import bcrypt from "bcrypt";
import {JWT_SECRET} from "@repo/backend-common/config";
import {signupSchema,signinSchema , roomSchema} from "@repo/common/types";
import { db } from '@repo/db';
import {middleware} from './middleware';
import { _slugify } from "zod/v4/core";


const PORT = Number(process.env.PORT) || 3001;

const app = express();

app.use(express.json());

app.post("/signup",async(req,res) => {
    const result = signupSchema.safeParse(req.body);

    if(!result.success){
        return res.status(400).json({
          message: "Invalid format",
          errors: result.error.flatten(),
        });
    }
    const username = result.data.username;
    const firstname = result.data.firstname;
    const lastname = result.data.lastname;
    const email = result.data.email;
    const password = result.data.password;

   
    try {
      const existing = await db.orm.public.User.where({ email }).first();
      if (existing) {
        return res.status(409).json({ message: "Email already in use" });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await db.orm.public.User.create({
        username: username,
        firstname: firstname,
        lastname: lastname,
        email: email,
        password: hashedPassword,
      });
      res.status(201).json({
        userId:user.id,
        result: "User created successfully",
      });
    } 
    
    catch (error) {
      console.error("signup failed:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
})

app.post("/signin",async(req,res) => {
   const result = signinSchema.safeParse(req.body);

   if(!result.success){
    return res.status(400).json({
      message: "Invalid format",
      errors: result.error.flatten(),
    });
   }
   
   const email = result.data.email;
   const password = result.data.password;
   
   // compare the email and password with the database

   try {
     const user = await db.orm.public.User.where({ email }).first();
     if(!user){
        return res.status(401).json({ message: "Invalid email or password" });
     }
     const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
      
 //  const secret = process.env.JWT_SECRET;
   //  if (!secret) {
    //   console.error("JWT_SECRET is not set");
     //  return res.status(500).json({ message: "Internal server error" });
    // }
     const token = jwt.sign({
        userId:user.id, 
     }, JWT_SECRET,{
        expiresIn: '1h'
     })
     return res.status(200).json({
        token : token,
        userId:user.id,
        username:user.username,
     })
   }
   catch(error){
    console.error("signin failed: ",error);
    return res.status(500).json({
        message: "Internal server error"
    })
   }
})

app.post("/room" ,middleware,async (req,res) => {
    const result  = roomSchema.safeParse(req.body);
    if(!result.success){
        return res.status(400).json({
            message: "Invalid format",
            errors: result.error.flatten(),
        });
    }
    const userId = req.userId;

    try{

      await db.orm.public.Room.create({
              slug: result.data.name,
              adminId: userId
      })

      res.status(201).json({
        message: "Room created successfully",
        adminId: userId
      })

    }
    catch(error){
        console.error("room creation failed: ",error);
        return res.status(500).json({
            message: "Internal server error"
        })
    }


})

async function startServer() {
  try {
    const databaseUrl = process.env["DATABASE_URL"];

    if (!databaseUrl) {
      throw new Error("DATABASE_URL is not configured");
    }

    await db.connect({ url: databaseUrl });

    const PORT = Number(process.env.PORT) || 3001;

    app.listen(PORT, () => {
      console.log(`HTTP server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to PostgreSQL:", error);
    process.exit(1);
  }
}

startServer();