import prisma from "../../config/prisma"

// const createRecentViewProduct = async (userEmail: string, productId: string) => {
//     const customer = await prisma.customer.findFirstOrThrow({
//         where: {
//             email: userEmail
//         }
//     })
//     const customerId = customer?.id

//     await prisma.recentProduct.findFirstOrThrow({
//         where: {
//             productId,
//             customerId
//         }
//     })
//     // Add the product to the recent products table
//     await prisma.recentProduct.create({

//         data: {
//             customerId,
//             productId,

//         }

//         // where: { customerId_productId: { customerId, productId } },
//         // update: { viewedAt: new Date() },
//         // create: { customerId, productId },
//     });

//     // Fetch all recent products for this customer, sorted by the most recent first
//     const recentProducts = await prisma.recentProduct.findMany({
//         where: { customerId },
//         orderBy: { viewedAt: 'desc' },
//     });

//     // Keep only the 10 most recent products
//     if (recentProducts.length > 10) {
//         const oldProductIds = recentProducts
//             .slice(10) // Get the products beyond the 10th entry
//             .map((product) => product.id);

//         // Delete the older products
//         await prisma.recentProduct.deleteMany({
//             where: { id: { in: oldProductIds } },
//         });
//     }

// }
const createRecentViewProduct = async (userEmail: string, productId: string) => {
    // Find the customer by email
    const customer = await prisma.customer.findFirst({
      where: { email: userEmail },
    });
  
    if (!customer) {
      throw new Error("Customer not found");
    }
  
    const customerId = customer.id;
  
    // Check if the recent product already exists
    const existingRecentProduct = await prisma.recentProduct.findFirst({
      where: { productId, customerId },
    });
  
    if (!existingRecentProduct) {
      // Create the product only if it doesn't exist
      await prisma.recentProduct.create({
        data: {
          customerId,
          productId,
        },
      });
    } else {
      // Update the viewedAt timestamp if the record already exists
      await prisma.recentProduct.update({
        where: { id: existingRecentProduct.id },
        data: { viewedAt: new Date() },
      });
    }
  
    // Fetch all recent products for this customer, sorted by the most recent first
    const recentProducts = await prisma.recentProduct.findMany({
      where: { customerId },
      orderBy: { viewedAt: "desc" },
    });
  
    // Keep only the 10 most recent products
    if (recentProducts.length > 10) {
      const oldProductIds = recentProducts
        .slice(10) // Get the products beyond the 10th entry
        .map((product) => product.id);
  
      // Delete the older products
      await prisma.recentProduct.deleteMany({
        where: { id: { in: oldProductIds } },
      });
    }
  };
  
const getRecentViewProducts = async (userEmail: string) => {
    const customer = await prisma.customer.findFirstOrThrow({
        where: {
            email: userEmail
        }
    })
    const customerId = customer?.id
    const recentProducts = await prisma.recentProduct.findMany({
        where: { customerId },
        orderBy: { viewedAt: 'desc' },
        include: {
            product: true
        }
    });
    return recentProducts
}
export const RecentViewProductsServices = {
    createRecentViewProduct,
    getRecentViewProducts
}