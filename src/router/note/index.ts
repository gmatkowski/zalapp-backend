import {Request, Response, Router} from "express"
import {AuthMiddleware} from '../../middleware/index.js'
import NoteRepository from "../../repositories/NoteRepository.js"
import {body, validationResult} from "express-validator"
import NoteDto from "../../dto/NoteDto.js"
import {Note, User} from "@prisma/client"
import {NoteConfig} from "../../configs/index.js"

const canManageNote = (note: Note, user: User): boolean => {
    return note.user_id === user.id
}

export default function (router: Router) {
    const noteRepository = new NoteRepository()

    router.get('/note/:id',
        AuthMiddleware,
        async (req: Request, res: Response) => {
            const id = parseInt(req.params.id)
            const note = await noteRepository.find(id)
            if (!note) {
                return res
                    .status(404)
                    .json({
                        message: 'NOT_FOUND'
                    })
            }

            if (!canManageNote(note, req.user)) {
                return res
                    .status(403)
                    .json({
                        message: 'FORBIDDEN'
                    })
            }

            res.json(note)
        })

    router.get('/note',
        AuthMiddleware,
        async (req: Request, res: Response) => {
            const page = parseInt(req.params?.page || '1')
            const perPage = parseInt(req.params?.perPage || '10')

            const notes = await noteRepository.getListing(page, perPage)
            const count = await noteRepository.count()

            res.json({
                data: notes,
                meta: {
                    total: count,
                    page: page,
                    perPage: perPage
                }
            })
        })

    router.post('/note',
        AuthMiddleware,
        body('title').notEmpty().isLength(NoteConfig.validation.title.length),
        body('content').notEmpty().isLength(NoteConfig.validation.content.length),
        async (req: Request, res: Response) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res
                    .status(422)
                    .json({errors: errors.array()})
            }

            const dto = new NoteDto(req.body.title, req.body.content)
            const note = await noteRepository.create(req.user.id, dto)

            res
                .status(201)
                .json(note)
        }
    )

    router.patch('/note/:id',
        AuthMiddleware,
        body('title').notEmpty().isLength(NoteConfig.validation.title.length),
        body('content').notEmpty().isLength(NoteConfig.validation.content.length),
        async (req: Request, res: Response) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res
                    .status(422)
                    .json({errors: errors.array()})
            }

            const id = parseInt(req.params.id)
            let note = await noteRepository.find(id)
            if (!note) {
                return res
                    .status(404)
                    .json({
                        message: 'NOT_FOUND'
                    })
            }

            if (!canManageNote(note, req.user)) {
                return res
                    .status(403)
                    .json({
                        message: 'FORBIDDEN'
                    })
            }

            const dto = new NoteDto(req.body.title, req.body.content)
            await noteRepository.update(note.id, dto)

            note = await noteRepository.find(note.id)

            res
                .status(200)
                .json(note)
        }
    )

    router.delete('/note/:id',
        AuthMiddleware,
        async (req: Request, res: Response) => {
            const id = parseInt(req.params.id)
            const note = await noteRepository.find(id)
            if (!note) {
                return res
                    .status(404)
                    .json({
                        message: 'NOT_FOUND'
                    })
            }

            if (!canManageNote(note, req.user)) {
                return res
                    .status(403)
                    .json({
                        message: 'FORBIDDEN'
                    })
            }

            await noteRepository.delete(id)

            res.json()
        })
}
