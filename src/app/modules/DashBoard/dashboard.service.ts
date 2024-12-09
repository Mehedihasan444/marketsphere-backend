import prisma from "../../config/prisma"


const getAdminDashboardData = async () => {
const result=await prisma.adminDashboard.findFirst()
return result
}

const getVendorDashboardData = async () => {
    const result=await prisma.vendorDashboard.findFirst()
    return result
}

const getCustomerDashboardData = async () => {
    const result=await prisma.customerDashboard.findFirst()
    return result
}

export const DashboardServices={
    getAdminDashboardData,
    getVendorDashboardData,
    getCustomerDashboardData
}