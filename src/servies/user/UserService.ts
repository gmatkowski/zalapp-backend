import {User} from "@prisma/client"
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import UserRepository from "../../repositories/UserRepository.js"

dotenv.config()

class UserService {
    protected secret: string
    protected repository: UserRepository

    constructor(secret: string) {
        this.secret = secret
        this.repository = new UserRepository()
    }

    generateJwtTokenFromUser(user: User): string {
        const token = jwt.sign(
            {
                id: user.id
            },
            this.secret,
            {
                expiresIn: '24h',
            }
        )

        return token
    }

    async getUserFromToken(token: string): Promise<User | null> {
        try {
            const decoded = jwt.verify(token, this.secret)

            if (typeof decoded === 'object') {
                const id = decoded.id

                return await this.repository.find(id)
            }

            return null

        } catch (err) {
            return null
        }
    }
}

export default UserService
