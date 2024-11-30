import config from "../config";
import prisma from "../config/prisma";
import { USER_ROLE, USER_STATUS } from "../modules/user/user.constant";

export const seed = async () => {
  try {
    // at first check if the admin exist of not
    const admin = await prisma.user.findFirstOrThrow({
      where: {
        role: USER_ROLE.ADMIN,
        email: config.admin_email,
        status: USER_STATUS.ACTIVE,
      },
    });
    if (!admin) {
      console.log("Seeding started...");

      await prisma.user.create({
        data: {
          email: config.admin_email as string,
          name: "Admin",
          password: config.admin_password as string,
          role: USER_ROLE.ADMIN,
          status: USER_STATUS.ACTIVE,
        },
      });
      console.log("Admin created successfully...");
      console.log("Seeding completed...");
    }
  } catch (error) {
    console.log("Error in seeding", error);
  }
};
