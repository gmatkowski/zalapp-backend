import {Express, Request, Response, Router} from 'express'
import UserRouter from './user/index.js'
import NoteRouter from './note/index.js'

export default function (app: Express) {
    console.log('Router started ...')
    const router = Router()

    router.get('/',
        async (req: Request, res: Response) => {
            res.json({
                status: 'OK'
            })
        })

    UserRouter(router)
    NoteRouter(router)

    app.use('/', router)
}

