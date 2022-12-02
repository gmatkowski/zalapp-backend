import AbstractRepository from "./AbstractRepository.js"
import UserDto from "../dto/UserDto.js"
import {User} from '@prisma/client'
import bcrypt from "bcrypt"

function exclude<User, Key extends keyof User>(
    user: User,
    keys: Key[]
): User {
    for (let key of keys) {
        delete user[key]
    }
    return user
}

class UserRepository extends AbstractRepository {
    constructor(excludedFields: Array<string> = ['password']) {
        super('user', exclude, excludedFields)
    }

    async findByEmail(email: string): Promise<User> {
        const user = await this.db().findUnique({
            where: {
                email: email
            },
        })

        return user && this.excludeFunction ? this.excludeFunction(user, this.excludeFields) : null
    }

    async create(dto: UserDto, password: string): Promise<User> {
        const salt = await bcrypt.genSalt(10)
        password = await bcrypt.hash(password, salt)

        const user = await this.db().create({
            data: {
                email: dto.getEmail(),
                password: password,
                first_name: dto.getFirstName(),
                last_name: dto.getLastName(),
                created_at: new Date(),
                updated_at: new Date()
            }
        })

        return this.excludeFunction ? this.excludeFunction(user, this.excludeFields) : user
    }

    async update(id: number, dto: UserDto) {
        await this.db().update({
            where: {
                id: id
            },
            data: {
                email: dto.getEmail(),
                first_name: dto.getFirstName(),
                last_name: dto.getLastName(),
                updated_at: new Date()
            }
        })
    }
}


export default UserRepository
