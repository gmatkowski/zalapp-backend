// @ts-ignore
import { PrismaClient } from '@prisma/client'

class AbstractRepository {

    client: PrismaClient
    entity: string | undefined
    defaultOrder = [
        {
            id: 'DESC'
        }
    ]

    constructor() {
        this.client = new PrismaClient()
    }

    db(){
        return this.client[this.entity]
    }

    async getListing(page: number, perPage: number) {
        const offset = (page - 1) * perPage

        return await this.db().findMany({
            skip: offset,
            take: perPage,
            orderBy: this.defaultOrder
        })
    }
}

export default AbstractRepository
