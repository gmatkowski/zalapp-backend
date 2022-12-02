import {Request, Response, Router} from "express"
import {body, validationResult} from 'express-validator'
import UserRepository from "../../repositories/UserRepository.js"
import UserDto from "../../dto/UserDto.js"
import {AuthMiddleware, GuestMiddleware} from '../../middleware/index.js'
import bcrypt from "bcrypt"
import UserService from "../../servies/user/UserService.js"
import {JwtConfig} from "../../configs/index.js"

export default function (router: Router) {
    const userRepository = new UserRepository()
    const userRepositoryRaw = new UserRepository([])
    const userService = new UserService(JwtConfig.secret)

    router.post(
        '/auth/register',
        GuestMiddleware,
        body('email').isEmail().custom(async (value) => {
            const user = await userRepository.findByEmail(value ?? '')
            if (user) {
                throw new Error('This email address already exists')
            }

            return true
        }),
        body('password').isLength({min: 3}),
        body('password_confirmation').custom((value, {req}) => {
            if (!req.body?.password || value !== req.body.password) {
                throw new Error('Password confirmation does not match password')
            }

            return true
        }),
        body('first_name').isLength({min: 3}),
        body('last_name').isLength({min: 3}),
        async (req: Request, res: Response) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res
                    .status(422)
                    .json({errors: errors.array()})
            }

            const dto = new UserDto(req.body.email)
            dto.setFirstName(req.body.first_name)
            dto.setLastName(req.body.last_name)

            const user = await userRepository.create(dto, req.body.password)

            res
                .status(201)
                .json({
                    id: user.id
                })
        }
    )

    router.post(
        '/auth/login',
        GuestMiddleware,
        body('email').isEmail().custom(async (value, {req}) => {
            const user = await userRepositoryRaw.findByEmail(value ?? '')
            const password = req.body.password || null
            if (!user || !password || !bcrypt.compareSync(password, user.password)) {
                throw new Error('Login incorrect')
            }

            return true
        }),
        body('password').isLength({min: 3}),
        async (req: Request, res: Response) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res
                    .status(422)
                    .json({errors: errors.array()})
            }

            const user = await userRepository.findByEmail(req.body.email)

            const expireAt = new Date()
            expireAt.setHours(expireAt.getHours() + 2)

            res.json({
                token: userService.generateJwtTokenFromUser(user),
                expireAt: expireAt
            })
        }
    )

    router.get('/auth/me',
        AuthMiddleware,
        async (req: Request, res: Response) => res.json(req.user))

    router.delete('/user/:id',
        AuthMiddleware,
        async (req: Request, res: Response) => {
            const user = await userRepository.find(parseInt(req.params.id))
            if (!user) {
                return res
                    .status(404)
                    .json({
                        message: 'NOT_FOUND'
                    })
            }

            await userRepository.delete(user.id)

            res.json()
        })

    router.get('/user',
        AuthMiddleware,
        async (req: Request, res: Response) => {
            const page = parseInt(req.params?.page || '1')
            const perPage = parseInt(req.params?.perPage || '10')

            const users = await userRepository.getListing(page, perPage)
            const count = await userRepository.count()

            res.json({
                data: users,
                meta: {
                    total: count,
                    page: page,
                    perPage: perPage
                }
            })
        })
}
