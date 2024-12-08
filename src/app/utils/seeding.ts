import { Role, UserStatus } from "@prisma/client";
import config from "../config";
import prisma from "../config/prisma";
import bcrypt from "bcryptjs";
export const seed = async () => {
  try {
    // at first check if the admin exist of not
    const admin = await prisma.user.findFirst({
      where: {
        role: Role.ADMIN,
        email: config.admin_email,
        status: UserStatus.ACTIVE,
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
            role: Role.ADMIN,
            status: UserStatus.ACTIVE,
          },
        });
        const admin = await transactionClient.admin.create({
          data: {
            name: user.name,
            email: user.email,
          },
        });
        return admin;
      });
      
      console.log("Admin created successfully...");
      console.log("Seeding completed...");
    }
    // at first check if the admin exist of not
    const vendor = await prisma.user.findFirst({
      where: {
        role: Role.VENDOR,
        email: config.vendor_email,
        status: UserStatus.ACTIVE,
      },
    });
    if (!vendor) {
      console.log("Seeding started...");
      //hash password
      const hashedPassword = await bcrypt.hash(
        config.vendor_password as string,
        Number(config.bcrypt_salt_rounds)
      );
      //create vendor
      await prisma.$transaction(async (transactionClient) => {
        const user = await transactionClient.user.create({
          data: {
            email: config.vendor_email as string,
            name: "vendor",
            password: hashedPassword,
            role: Role.VENDOR,
            status: UserStatus.ACTIVE,
          },
        });
        const vendor = await transactionClient.vendor.create({
          data: {
            name: user.name,
            email: user.email,
          },
        });
        return vendor;
      });
      console.log("Vendor created successfully...");
      console.log("Seeding completed...");
    }
  } catch (error) {
    console.log("Error in seeding", error);
  }
};
