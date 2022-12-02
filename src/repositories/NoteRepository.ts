import AbstractRepository from "./AbstractRepository.js"
import NoteDto from '../dto/NoteDto.js'
import {Note, User} from "@prisma/client"

class NoteRepository extends AbstractRepository {
    constructor() {
        super('note')
    }

    async create(user_id: number, dto: NoteDto): Promise<Note> {
        const note = await this.db().create({
            data: {
                user_id: user_id,
                title: dto.getTitle(),
                content: dto.getContent(),
                created_at: new Date(),
                updated_at: new Date()
            }
        })
        return note
    }

    async update(id: number, dto: NoteDto) {
        await this.db().update({
            where: {
                id: id
            },
            data: {
                title: dto.getTitle(),
                content: dto.getContent(),
                updated_at: new Date()
            }
        })
    }
}

export default NoteRepository
