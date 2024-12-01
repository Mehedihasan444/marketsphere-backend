"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class QueryBuilder {
    constructor(model) {
        this.model = model;
        this.query = {};
    }
    filter(filters) {
        this.query.where = Object.assign(Object.assign({}, this.query.where), filters);
        return this;
    }
    sort(sortBy, order = "asc") {
        this.query.orderBy = { [sortBy]: order };
        return this;
    }
    // Add search functionality
    search(fields, searchTerm) {
        var _a;
        if (searchTerm) {
            const searchConditions = fields.map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: "insensitive", // Case-insensitive search
                },
            }));
            // Add search conditions to existing filters
            this.query.where = Object.assign(Object.assign({}, this.query.where), { OR: [...(((_a = this.query.where) === null || _a === void 0 ? void 0 : _a.OR) || []), ...searchConditions] });
        }
        return this;
    }
    paginate(page, limit) {
        this.query.skip = (page - 1) * limit;
        this.query.take = limit;
        return this;
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.model.findMany(this.query);
            }
            catch (error) {
                console.error("Error executing query:", error);
                throw error;
            }
        });
    }
    count() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.count({ where: this.query.where || {} });
        });
    }
}
exports.default = QueryBuilder;
// import { PrismaClient, Prisma } from "@prisma/client";
// const prisma = new PrismaClient();
// class QueryBuilder<
//   Model,
//   Args extends { where?: any; orderBy?: any; skip?: number; take?: number }
// > {
//   private query: Args = {} as Args;
//   constructor(
//     private model: {
//       findMany: (args: Args) => Promise<Model[]>;
//       count: (args: { where?: Args["where"] }) => Promise<number>;
//     }
//   ) {}
//   filter(filters: Args["where"]) {
//     this.query.where = { ...this.query.where, ...filters };
//     return this;
//   }
//   sort(sortBy: string, order: "asc" | "desc" = "asc") {
//     this.query.orderBy = { [sortBy]: order } as Args["orderBy"];
//     return this;
//   }
//   paginate(page: number, limit: number) {
//     this.query.skip = (page - 1) * limit;
//     this.query.take = limit;
//     return this;
//   }
//   async execute() {
//     return this.model.findMany(this.query);
//   }
//   async count() {
//     return this.model.count({ where: this.query.where });
//   }
// }
// export default QueryBuilder;
