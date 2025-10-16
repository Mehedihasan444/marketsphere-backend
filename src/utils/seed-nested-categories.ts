import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export async function seedNestedCategories() {
  console.log('🌱 Seeding nested categories...');

  try {
    // First, create parent categories
    const parentCategories = [
      {
        name: 'Mobile & Tablets',
        description: 'Smartphones, tablets, and mobile accessories',
        image: 'https://example.com/mobile.jpg',
      },
      {
        name: 'Computers & Accessories',
        description: 'Laptops, desktops, and computer peripherals',
        image: 'https://example.com/computers.jpg',
      },
      {
        name: 'Gaming',
        description: 'Gaming consoles, accessories, and video games',
        image: 'https://example.com/gaming.jpg',
      },
      {
        name: 'Electronics',
        description: 'Cameras, drones, and smart home devices',
        image: 'https://example.com/electronics.jpg',
      },
    ];

    const createdParents: any = {};
    let parentCreatedCount = 0;
    let parentSkippedCount = 0;

    for (const parent of parentCategories) {
      // Check if parent category already exists
      const existingParent = await prisma.category.findFirst({
        where: { 
          name: parent.name,
          parentId: null,
        },
      });

      if (existingParent) {
        console.log(`⏭️  Parent category already exists: ${parent.name}`);
        createdParents[parent.name] = existingParent;
        parentSkippedCount++;
      } else {
        const created = await prisma.category.create({
          data: parent,
        });
        createdParents[parent.name] = created;
        console.log(`✅ Created parent category: ${parent.name}`);
        parentCreatedCount++;
      }
    }

    // Now create child categories
    const childCategories = [
      // Mobile & Tablets children
      {
        name: 'Smartphones',
        description: 'Latest smartphones from top brands',
        parentId: createdParents['Mobile & Tablets'].id,
      },
      {
        name: 'Feature Phones',
        description: 'Basic mobile phones',
        parentId: createdParents['Mobile & Tablets'].id,
      },
      {
        name: 'Tablets',
        description: 'Tablets and iPads',
        parentId: createdParents['Mobile & Tablets'].id,
      },
      {
        name: 'Smartwatches',
        description: 'Smart watches and fitness trackers',
        parentId: createdParents['Mobile & Tablets'].id,
      },
      {
        name: 'Mobile Accessories',
        description: 'Cases, chargers, and screen protectors',
        parentId: createdParents['Mobile & Tablets'].id,
      },

      // Computers & Accessories children
      {
        name: 'Laptops',
        description: 'Laptops and notebooks',
        parentId: createdParents['Computers & Accessories'].id,
      },
      {
        name: 'Desktops',
        description: 'Desktop computers and all-in-ones',
        parentId: createdParents['Computers & Accessories'].id,
      },
      {
        name: 'Monitors',
        description: 'Computer monitors and displays',
        parentId: createdParents['Computers & Accessories'].id,
      },
      {
        name: 'Keyboards & Mice',
        description: 'Computer input devices',
        parentId: createdParents['Computers & Accessories'].id,
      },
      {
        name: 'Computer Accessories',
        description: 'Cables, adapters, and peripherals',
        parentId: createdParents['Computers & Accessories'].id,
      },

      // Gaming children
      {
        name: 'Consoles',
        description: 'PlayStation, Xbox, and Nintendo',
        parentId: createdParents['Gaming'].id,
      },
      {
        name: 'Gaming Laptops',
        description: 'High-performance gaming laptops',
        parentId: createdParents['Gaming'].id,
      },
      {
        name: 'Gaming Accessories',
        description: 'Controllers, headsets, and gaming peripherals',
        parentId: createdParents['Gaming'].id,
      },
      {
        name: 'Games',
        description: 'Video games for all platforms',
        parentId: createdParents['Gaming'].id,
      },
      {
        name: 'VR Headsets',
        description: 'Virtual reality headsets and accessories',
        parentId: createdParents['Gaming'].id,
      },

      // Electronics children
      {
        name: 'Cameras',
        description: 'DSLR, mirrorless, and action cameras',
        parentId: createdParents['Electronics'].id,
      },
      {
        name: 'Drones',
        description: 'Consumer and professional drones',
        parentId: createdParents['Electronics'].id,
      },
      {
        name: 'Audio',
        description: 'Headphones, speakers, and audio equipment',
        parentId: createdParents['Electronics'].id,
      },
      {
        name: 'Smart Home',
        description: 'Smart home devices and automation',
        parentId: createdParents['Electronics'].id,
      },
      {
        name: 'Wearables',
        description: 'Fitness trackers and wearable technology',
        parentId: createdParents['Electronics'].id,
      },
    ];

    let childCreatedCount = 0;
    let childSkippedCount = 0;

    for (const child of childCategories) {
      // Check if child category already exists
      const existingChild = await prisma.category.findFirst({
        where: { 
          name: child.name,
          parentId: child.parentId,
        },
      });

      if (existingChild) {
        console.log(`  ⏭️  Child category already exists: ${child.name}`);
        childSkippedCount++;
      } else {
        await prisma.category.create({
          data: child,
        });
        console.log(`  ✅ Created child category: ${child.name}`);
        childCreatedCount++;
      }
    }

    console.log('\n✨ Seeding completed!');
    console.log(`📊 Summary:`);
    console.log(`   Parent Categories: ${parentCreatedCount} created, ${parentSkippedCount} already existed`);
    console.log(`   Child Categories: ${childCreatedCount} created, ${childSkippedCount} already existed`);
    console.log(`   Total: ${parentCreatedCount + childCreatedCount} new categories added`);


  } catch (error) {
    console.error('❌ Error seeding categories:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed function
seedNestedCategories()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
