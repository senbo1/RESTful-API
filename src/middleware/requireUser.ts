import { Request, Response, NextFunction } from 'express';

// middleware function for requiring a user
const requireUser = (req: Request, res: Response, next: NextFunction) => {
    // Get the user from the response locals object
    const user = res.locals.user;
    
    // If there is no user, return a 403 Forbidden status
    if(!user) {
        return res.sendStatus(403);
    }

    return next();
};

export default requireUser;
