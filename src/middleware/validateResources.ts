import { Request, Response, NextFunction } from 'express';
import { AnyZodObject } from 'zod';

// function for validating request parameters
const validate = (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => {
    try {
      // parse the request parameters using the provided schema
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      
      // Call the next middleware if parsing was successful
      return next();
    } catch (e: any) {
      
      // Return a 400 Bad Request response with the error messages if parsing failed
      return res.status(400).send(e.errors);
    }
  };

export default validate;
