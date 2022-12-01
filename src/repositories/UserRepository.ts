import AbstractRepository from "./AbstractRepository";
import UserDto from "../dto/UserDto";

class UserRepository extends AbstractRepository {
    constructor() {
        super();
        this.entity = 'user'
    }

    async create(dto: UserDto) {
        return await this.db().create({
            data: {
                email: dto.getEmail(),
                first_name: dto.getFirstName(),
                last_name: dto.getLastName(),
                created_at: new Date(),
                updated_at: new Date()
            }
        })
    }

    async update(id: number, dto: UserDto) {
        return await this.db().update({
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

    async delete(id: number) {
        return await this.db().delete({
            where: {
                id: id
            }
        })
    }
}


export default UserRepository
