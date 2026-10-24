import {NextFunction, Request, Response} from "express";
import jwt from "jsonwebtoken";
import {JWT_SECRET} from "@repo/backend-common/config";

declare global {
  namespace Express {
    interface Request {
      userId?: number;
    }
  }
}

export function middleware(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(" ")[1];
    if(!token){
        return res.status(401).json({
            message: "Unauthorized",

        })
    }

    try {
    const decoded = jwt.verify(token, JWT_SECRET) ;
    // userId is a number, but jwt.verify returns string | object, so we need to check if it's a string or object
    // if it's a string, we return 401, if it's an object, we check if userId is a number
    // now our valid condition is userId is a number and jwt.verify returns an object, so we need to check if it's a string or object

    if( typeof decoded  == "string" || typeof decoded.userId != "number"){
       return res.status(401).json({
        message: "Unauthorized",
       })
    }
      req.userId = decoded.userId;

        next();
    }
    catch (error){
     return res.status(401).json({
        message: "Invalid token or Expire token"
    })
}
}
