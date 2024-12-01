
class QueryBuilder<Model, Args extends { where?: any; orderBy?: any; skip?: number; take?: number }> {
  private query: Args = {} as Args;

  constructor(
    private model: {
      findMany: (args: Args) => Promise<Model[]>;
      count: (args: { where?: Args["where"] }) => Promise<number>;
    }
  ) {}

  filter(filters: Args["where"]) {
    this.query.where = { ...this.query.where, ...filters };
    return this;
  }

  sort(sortBy: string, order: "asc" | "desc" = "asc") {
    this.query.orderBy = { [sortBy]: order } as Args["orderBy"];
    return this;
  }
  // Add search functionality
  search(fields: string[], searchTerm: string) {
    if (searchTerm) {
      const searchConditions = fields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive", // Case-insensitive search
        },
      }));

      // Add search conditions to existing filters
      this.query.where = {
        ...this.query.where,
        OR: [...(this.query.where?.OR || []), ...searchConditions],
      };
    }
    return this;
  }
  paginate(page: number, limit: number) {
    this.query.skip = (page - 1) * limit;
    this.query.take = limit;
    return this;
  }

  async execute() {
    try {
      return await this.model.findMany(this.query);
    } catch (error) {
      console.error("Error executing query:", error);
      throw error;
    }
  }

  async count() {
    return this.model.count({ where: this.query.where || {} });
  }
}

export default QueryBuilder;



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
