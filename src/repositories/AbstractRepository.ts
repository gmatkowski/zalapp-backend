// @ts-ignore
import {PrismaClient} from '@prisma/client'

class AbstractRepository {

    client: PrismaClient
    entity: string
    excludeFunction: Function | null
    excludeFields: Array<string> = []

    constructor(entity: string, excludeFunction: Function | null = null, excludeFields: Array<string> = []) {
        this.client = new PrismaClient({
            log: ['query'],
        })
        this.entity = entity
        this.excludeFunction = excludeFunction
        this.excludeFields = excludeFields
    }

    db() {
        return (this.client as any)[this.entity]
    }

    async getListing(page: number, perPage: number) {
        const offset = (page - 1) * perPage

        let records = await this.db().findMany({
            skip: offset,
            take: perPage,
            orderBy: [
                {
                    id: 'desc'
                }
            ]
        })

        if (!this.excludeFunction) {
            return records
        }

        return records.map((record: any) => {
            return this.excludeFunction ? this.excludeFunction(record, this.excludeFields) : record
        })
    }

    async find(id: number) {
        const record = await this.db().findUnique({
            where: {
                id: id
            }
        })

        if (!record) {
            return null
        }

        if (!this.excludeFunction) {
            return record
        }

        return this.excludeFunction(record, this.excludeFields)
    }

    async delete(id: number) {
        await this.db().delete({
            where: {
                id: id
            }
        })
    }

    async count(query: object = {}) {
        await this.db().count(query)
    }
}

export default AbstractRepository
