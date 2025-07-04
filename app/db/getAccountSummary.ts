import { prisma } from '~/lib/prisma'


export async function getAccountSummary(userId: string) {

    const sum = await prisma.rent.aggregate({
        _sum: {
            amount: true
        },
        where: {
            renterId: {}
        }
    })
    
}