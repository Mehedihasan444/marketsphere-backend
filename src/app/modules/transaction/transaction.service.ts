import { Prisma } from "@prisma/client";
import prisma from "../../config/prisma"
import { paginationHelper } from "../../utils/paginationHelper";

const getAllTransactions = async (params: any, options: any) => {
    const { page, limit, skip } = paginationHelper.calculatePagination(options);

    const { searchTerm, ...filterData } = params;
    const andConditions: Prisma.TransactionWhereInput[] = [];

    if (searchTerm) {
        andConditions.push({
            OR: [
                { transactionId: { contains: searchTerm, mode: "insensitive" } },
            ],
        });
    }

    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map((key) => ({
                [key]: {
                    equals: (filterData as any)[key],
                },
            })),
        });
    }

    const whereConditions: Prisma.TransactionWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : {};

    const result = await prisma.transaction.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy:
            options.sortBy && options.sortOrder
                ? {
                    [options.sortBy]: options.sortOrder,
                }
                : {
                    createdAt: "desc",
                },
        include: {
            order: true,
        },
    });

    const total = await prisma.transaction.count({
        where: whereConditions,
    });

    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
};

//     const transactions = await prisma.transaction.findMany({
//         include: {
//             order: true
//         }
//     })
//     return transactions
// }


export const transactionService = {
    getAllTransactions
}