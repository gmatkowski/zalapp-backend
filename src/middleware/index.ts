import {NextFunction, Request, Response} from "express"
import UserService from "../servies/user/UserService.js"
import { JwtConfig } from "../configs/index.js"

const userService = new UserService(JwtConfig.secret)

export async function AuthMiddleware(req: Request, res: Response, next: NextFunction) {
    const unauthorizedResponse = (res: Response) => {
        return res.status(401)
            .json({
                'message': 'Unauthorized'
            })
    }

    if (!req.headers['authorization']) {
        return unauthorizedResponse(res)
    }

    let bearer: string | string[] | undefined = req.headers['authorization']
    const parts = bearer.split(' ')
    if (parts[0].toLowerCase() !== 'bearer' || parts.length !== 2) {
        return unauthorizedResponse(res)
    }

    let user = await userService.getUserFromToken(parts[1])
    if(!user){
        return unauthorizedResponse(res)
    }

    req.user = user

    next()
}

export function GuestMiddleware(req: Request, res: Response, next: NextFunction) {
    next()
}
