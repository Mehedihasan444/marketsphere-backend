import config from "../config";
import prisma from "../config/prisma";
import { USER_ROLE, USER_STATUS } from "../modules/user/user.constant";
import bcrypt from "bcryptjs";
export const seed = async () => {
  try {
    // at first check if the admin exist of not
    const admin = await prisma.user.findFirst({
      where: {
        role: USER_ROLE.ADMIN,
        email: config.admin_email,
        status: USER_STATUS.ACTIVE,
      },
    });
    if (!admin) {
      console.log("Seeding started...");
      //hash password
      const hashedPassword = await bcrypt.hash(
        config.admin_password as string,
        Number(config.bcrypt_salt_rounds)
      );
      //create admin
      await prisma.$transaction(async (transactionClient) => {
        const user = await transactionClient.user.create({
          data: {
            email: config.admin_email as string,
            name: "Admin",
            password: hashedPassword,
            role: USER_ROLE.ADMIN,
            status: USER_STATUS.ACTIVE,
          },
        });
        const admin = await transactionClient.admin.create({
          data: {
            userId: user.id,
          },
        });
        return admin;
      });

      console.log("Admin created successfully...");
      console.log("Seeding completed...");
    }
  } catch (error) {
    console.log("Error in seeding", error);
  }
};
