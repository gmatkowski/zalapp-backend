import UserRepository from '../repositories/UserRepository.ts'

export default function (app, express) {
    const router = express.Router()

    router.get('/', (req, res, next) => {
        console.log('Middleware time:', Date.now())
        next()
    }, (req, res) => {
        res.json({
            test: 'OK OK'
        })
    })
    app.use('/', router)
}

