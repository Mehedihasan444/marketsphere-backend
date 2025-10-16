import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clear existing data (in reverse order of dependencies)
  await prisma.reviewItem.deleteMany();
  await prisma.review.deleteMany();
  await prisma.flashSaleItem.deleteMany();
  await prisma.flashSale.deleteMany();
  await prisma.recentProduct.deleteMany();
  await prisma.couponItem.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.order.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.follow.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.shop.deleteMany();
  await prisma.customerDashboard.deleteMany();
  await prisma.vendorDashboard.deleteMany();
  await prisma.adminDashboard.deleteMany();
  await prisma.admin.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.vendor.deleteMany();
  await prisma.user.deleteMany();

  console.log('🧹 Cleared existing data');

  // Hash password for all users
  const hashedPassword = await bcrypt.hash('password123', 12);

  // 1. Create Users
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@marketsphere.com',
      name: 'Admin User',
      password: hashedPassword,
      role: 'ADMIN',
      status: 'ACTIVE',
      needPasswordChange: false,
    },
  });

  const vendor1User = await prisma.user.create({
    data: {
      email: 'vendor1@marketsphere.com',
      name: 'TechWorld Vendor',
      password: hashedPassword,
      role: 'VENDOR',
      status: 'ACTIVE',
      needPasswordChange: false,
    },
  });

  const vendor2User = await prisma.user.create({
    data: {
      email: 'vendor2@marketsphere.com',
      name: 'Fashion Hub Vendor',
      password: hashedPassword,
      role: 'VENDOR',
      status: 'ACTIVE',
      needPasswordChange: false,
    },
  });

  const vendor3User = await prisma.user.create({
    data: {
      email: 'vendor3@marketsphere.com',
      name: 'Home & Living Vendor',
      password: hashedPassword,
      role: 'VENDOR',
      status: 'ACTIVE',
      needPasswordChange: false,
    },
  });

  const customer1User = await prisma.user.create({
    data: {
      email: 'customer1@gmail.com',
      name: 'John Doe',
      password: hashedPassword,
      role: 'CUSTOMER',
      status: 'ACTIVE',
      needPasswordChange: false,
    },
  });

  const customer2User = await prisma.user.create({
    data: {
      email: 'customer2@gmail.com',
      name: 'Jane Smith',
      password: hashedPassword,
      role: 'CUSTOMER',
      status: 'ACTIVE',
      needPasswordChange: false,
    },
  });

  console.log('✅ Created users');

  // 2. Create Admin
  const admin = await prisma.admin.create({
    data: {
      name: adminUser.name,
      email: adminUser.email,
      profilePhoto: 'https://randomuser.me/api/portraits/men/1.jpg',
      phone: '+1234567890',
      address: '123 Admin Street, Admin City',
    },
  });

  console.log('✅ Created admin');

  // 3. Create Vendors
  const vendor1 = await prisma.vendor.create({
    data: {
      name: vendor1User.name,
      email: vendor1User.email,
      profilePhoto: 'https://randomuser.me/api/portraits/men/2.jpg',
      phone: '+1234567891',
    },
  });

  const vendor2 = await prisma.vendor.create({
    data: {
      name: vendor2User.name,
      email: vendor2User.email,
      profilePhoto: 'https://randomuser.me/api/portraits/women/1.jpg',
      phone: '+1234567892',
    },
  });

  const vendor3 = await prisma.vendor.create({
    data: {
      name: vendor3User.name,
      email: vendor3User.email,
      profilePhoto: 'https://randomuser.me/api/portraits/men/3.jpg',
      phone: '+1234567893',
    },
  });

  console.log('✅ Created vendors');

  // 4. Create Customers
  const customer1 = await prisma.customer.create({
    data: {
      name: customer1User.name,
      email: customer1User.email,
      profilePhoto: 'https://randomuser.me/api/portraits/men/4.jpg',
      phone: '+1234567894',
      address: '456 Customer Lane, Customer City',
    },
  });

  const customer2 = await prisma.customer.create({
    data: {
      name: customer2User.name,
      email: customer2User.email,
      profilePhoto: 'https://randomuser.me/api/portraits/women/2.jpg',
      phone: '+1234567895',
      address: '789 Buyer Boulevard, Buyer Town',
    },
  });

  console.log('✅ Created customers');

  // 5. Create Shops
  const techShop = await prisma.shop.create({
    data: {
      name: 'TechWorld Electronics',
      description: 'Your one-stop shop for all electronics and gadgets',
      logo: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=200&h=200&fit=crop',
      banner: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=1200&h=300&fit=crop',
      status: 'ACTIVE',
      vendorId: vendor1.id,
    },
  });

  const fashionShop = await prisma.shop.create({
    data: {
      name: 'Fashion Hub',
      description: 'Trendy fashion for men, women, and kids',
      logo: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200&h=200&fit=crop',
      banner: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&h=300&fit=crop',
      status: 'ACTIVE',
      vendorId: vendor2.id,
    },
  });

  const homeShop = await prisma.shop.create({
    data: {
      name: 'Home & Living Paradise',
      description: 'Beautiful furniture and home decor',
      logo: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=200&h=200&fit=crop',
      banner: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1200&h=300&fit=crop',
      status: 'ACTIVE',
      vendorId: vendor3.id,
    },
  });

  console.log('✅ Created shops');

  // 6. Create Categories with Nested Structure
  // Parent Categories
  const electronicsCategory = await prisma.category.create({
    data: {
      name: 'Electronics',
      description: 'Electronic devices and accessories',
      image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop',
    },
  });

  const fashionCategory = await prisma.category.create({
    data: {
      name: 'Fashion',
      description: 'Clothing and accessories',
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=300&fit=crop',
    },
  });

  const homeCategory = await prisma.category.create({
    data: {
      name: 'Home & Living',
      description: 'Furniture and home decor',
      image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400&h=300&fit=crop',
    },
  });

  const sportsCategory = await prisma.category.create({
    data: {
      name: 'Sports & Outdoors',
      description: 'Sports equipment and outdoor gear',
      image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&h=300&fit=crop',
    },
  });

  const booksCategory = await prisma.category.create({
    data: {
      name: 'Books & Media',
      description: 'Books, music, and movies',
      image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&h=300&fit=crop',
    },
  });

  const toysCategory = await prisma.category.create({
    data: {
      name: 'Toys & Games',
      description: 'Toys and games for all ages',
      image: 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=400&h=300&fit=crop',
    },
  });

  // Nested Categories (Children)
  const laptopsCategory = await prisma.category.create({
    data: {
      name: 'Laptops',
      description: 'Laptop computers',
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop',
      parentId: electronicsCategory.id,
    },
  });

  const smartphonesCategory = await prisma.category.create({
    data: {
      name: 'Smartphones',
      description: 'Mobile phones and smartphones',
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop',
      parentId: electronicsCategory.id,
    },
  });

  const mensClothingCategory = await prisma.category.create({
    data: {
      name: "Men's Clothing",
      description: 'Clothing for men',
      image: 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=400&h=300&fit=crop',
      parentId: fashionCategory.id,
    },
  });

  const womensClothingCategory = await prisma.category.create({
    data: {
      name: "Women's Clothing",
      description: 'Clothing for women',
      image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=300&fit=crop',
      parentId: fashionCategory.id,
    },
  });

  const furnitureCategory = await prisma.category.create({
    data: {
      name: 'Furniture',
      description: 'Home furniture',
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop',
      parentId: homeCategory.id,
    },
  });

  const decorCategory = await prisma.category.create({
    data: {
      name: 'Home Decor',
      description: 'Decorative items for home',
      image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=400&h=300&fit=crop',
      parentId: homeCategory.id,
    },
  });

  console.log('✅ Created categories');

  // 7. Create Products (2 per category)
  
  // Laptops
  const laptop1 = await prisma.product.create({
    data: {
      name: 'Dell XPS 15 Laptop',
      description: 'High-performance laptop with 15.6" 4K display, Intel Core i7, 16GB RAM, 512GB SSD',
      price: 1499.99,
      discount: 10,
      quantity: 25,
      rating: 4.7,
      images: [
        'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1593642634367-d91a135587b5?w=600&h=600&fit=crop',
      ],
      color: ['Silver', 'Black'],
      size: ['15.6 inch'],
      features: ['4K Display', 'Intel Core i7', '16GB RAM', '512GB SSD', 'Backlit Keyboard'],
      brand: 'Dell',
      model: 'XPS 15',
      warrantyDuration: 24,
      warrantyStartDate: new Date(),
      warrantyEndDate: new Date(Date.now() + 24 * 30 * 24 * 60 * 60 * 1000),
      warrantyTerms: '2 years manufacturer warranty covering hardware defects',
      warrantyStatus: 'Active',
      warrantyNumber: 'DELL-XPS-2024-001',
      categoryId: laptopsCategory.id,
      shopId: techShop.id,
    },
  });

  const laptop2 = await prisma.product.create({
    data: {
      name: 'MacBook Pro 14"',
      description: 'Apple MacBook Pro with M3 chip, 14" Liquid Retina XDR display, 16GB RAM, 512GB SSD',
      price: 1999.99,
      discount: 5,
      quantity: 15,
      rating: 4.9,
      images: [
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600&h=600&fit=crop',
      ],
      color: ['Space Gray', 'Silver'],
      size: ['14 inch'],
      features: ['M3 Chip', 'Liquid Retina XDR', '16GB RAM', '512GB SSD', 'Touch ID'],
      brand: 'Apple',
      model: 'MacBook Pro 14',
      warrantyDuration: 12,
      warrantyStartDate: new Date(),
      warrantyEndDate: new Date(Date.now() + 12 * 30 * 24 * 60 * 60 * 1000),
      warrantyTerms: '1 year AppleCare warranty',
      warrantyStatus: 'Active',
      warrantyNumber: 'APPLE-MBP-2024-001',
      categoryId: laptopsCategory.id,
      shopId: techShop.id,
    },
  });

  // Smartphones
  const phone1 = await prisma.product.create({
    data: {
      name: 'iPhone 15 Pro',
      description: 'Apple iPhone 15 Pro with A17 Pro chip, 6.1" Super Retina XDR display, 256GB',
      price: 1099.99,
      discount: 8,
      quantity: 50,
      rating: 4.8,
      images: [
        'https://images.unsplash.com/photo-1592286927505-b0e0dd0a4e2f?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=600&h=600&fit=crop',
      ],
      color: ['Natural Titanium', 'Blue Titanium', 'Black Titanium'],
      size: ['6.1 inch'],
      features: ['A17 Pro Chip', '48MP Camera', '5G', 'Face ID', 'Titanium Design'],
      brand: 'Apple',
      model: 'iPhone 15 Pro',
      warrantyDuration: 12,
      warrantyStartDate: new Date(),
      warrantyEndDate: new Date(Date.now() + 12 * 30 * 24 * 60 * 60 * 1000),
      warrantyTerms: '1 year manufacturer warranty',
      warrantyStatus: 'Active',
      warrantyNumber: 'APPLE-IP15-2024-001',
      categoryId: smartphonesCategory.id,
      shopId: techShop.id,
    },
  });

  const phone2 = await prisma.product.create({
    data: {
      name: 'Samsung Galaxy S24 Ultra',
      description: 'Samsung Galaxy S24 Ultra with Snapdragon 8 Gen 3, 6.8" Dynamic AMOLED, 512GB',
      price: 1299.99,
      discount: 12,
      quantity: 40,
      rating: 4.7,
      images: [
        'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&h=600&fit=crop',
      ],
      color: ['Titanium Gray', 'Titanium Black', 'Titanium Violet'],
      size: ['6.8 inch'],
      features: ['200MP Camera', 'S Pen', '5G', '5000mAh Battery', 'AI Features'],
      brand: 'Samsung',
      model: 'Galaxy S24 Ultra',
      warrantyDuration: 12,
      warrantyStartDate: new Date(),
      warrantyEndDate: new Date(Date.now() + 12 * 30 * 24 * 60 * 60 * 1000),
      warrantyTerms: '1 year manufacturer warranty',
      warrantyStatus: 'Active',
      warrantyNumber: 'SAMSUNG-S24-2024-001',
      categoryId: smartphonesCategory.id,
      shopId: techShop.id,
    },
  });

  // Men's Clothing
  const mensShirt1 = await prisma.product.create({
    data: {
      name: 'Classic Formal Shirt',
      description: 'Premium cotton formal shirt for men, perfect for office and formal occasions',
      price: 49.99,
      discount: 15,
      quantity: 100,
      rating: 4.5,
      images: [
        'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=600&h=600&fit=crop',
      ],
      color: ['White', 'Blue', 'Black', 'Light Pink'],
      size: ['S', 'M', 'L', 'XL', 'XXL'],
      features: ['100% Cotton', 'Wrinkle-free', 'Breathable', 'Machine Washable'],
      brand: 'Arrow',
      model: 'Classic Fit',
      categoryId: mensClothingCategory.id,
      shopId: fashionShop.id,
    },
  });

  const mensJeans = await prisma.product.create({
    data: {
      name: "Men's Slim Fit Jeans",
      description: 'Comfortable stretch denim jeans with modern slim fit',
      price: 69.99,
      discount: 20,
      quantity: 80,
      rating: 4.6,
      images: [
        'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&h=600&fit=crop',
      ],
      color: ['Dark Blue', 'Black', 'Light Blue'],
      size: ['28', '30', '32', '34', '36', '38'],
      features: ['Stretch Denim', 'Slim Fit', '5 Pockets', 'Durable'],
      brand: "Levi's",
      model: '511 Slim Fit',
      categoryId: mensClothingCategory.id,
      shopId: fashionShop.id,
    },
  });

  // Women's Clothing
  const womensDress = await prisma.product.create({
    data: {
      name: 'Elegant Summer Dress',
      description: 'Flowy midi dress perfect for summer occasions and casual outings',
      price: 79.99,
      discount: 25,
      quantity: 60,
      rating: 4.7,
      images: [
        'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&h=600&fit=crop',
      ],
      color: ['Floral Blue', 'Floral Pink', 'Solid Red', 'Solid Black'],
      size: ['XS', 'S', 'M', 'L', 'XL'],
      features: ['Breathable Fabric', 'Midi Length', 'Side Pockets', 'Easy Care'],
      brand: 'Zara',
      model: 'Summer Collection',
      categoryId: womensClothingCategory.id,
      shopId: fashionShop.id,
    },
  });

  const womensTop = await prisma.product.create({
    data: {
      name: 'Casual Cotton Top',
      description: 'Comfortable cotton top for everyday wear',
      price: 34.99,
      discount: 10,
      quantity: 120,
      rating: 4.4,
      images: [
        'https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=600&h=600&fit=crop',
      ],
      color: ['White', 'Black', 'Navy', 'Olive'],
      size: ['XS', 'S', 'M', 'L', 'XL'],
      features: ['100% Cotton', 'Relaxed Fit', 'Round Neck', 'Machine Washable'],
      brand: 'H&M',
      model: 'Basic Collection',
      categoryId: womensClothingCategory.id,
      shopId: fashionShop.id,
    },
  });

  // Furniture
  const sofa = await prisma.product.create({
    data: {
      name: 'Modern L-Shaped Sofa',
      description: 'Comfortable L-shaped sofa with premium fabric upholstery',
      price: 899.99,
      discount: 15,
      quantity: 20,
      rating: 4.8,
      images: [
        'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=600&h=600&fit=crop',
      ],
      color: ['Gray', 'Beige', 'Navy Blue'],
      size: ['L-Shaped'],
      features: ['Premium Fabric', 'Sturdy Frame', 'Easy Assembly', 'Comfortable Cushions'],
      brand: 'IKEA',
      model: 'KIVIK',
      warrantyDuration: 36,
      warrantyStartDate: new Date(),
      warrantyEndDate: new Date(Date.now() + 36 * 30 * 24 * 60 * 60 * 1000),
      warrantyTerms: '3 years warranty on frame',
      warrantyStatus: 'Active',
      warrantyNumber: 'IKEA-SOFA-2024-001',
      categoryId: furnitureCategory.id,
      shopId: homeShop.id,
    },
  });

  const diningTable = await prisma.product.create({
    data: {
      name: '6-Seater Dining Table Set',
      description: 'Elegant wooden dining table with 6 chairs',
      price: 699.99,
      discount: 10,
      quantity: 15,
      rating: 4.6,
      images: [
        'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=600&h=600&fit=crop',
      ],
      color: ['Walnut Brown', 'Natural Oak'],
      size: ['6 Seater'],
      features: ['Solid Wood', 'Cushioned Chairs', 'Easy to Clean', 'Sturdy Construction'],
      brand: 'Wooden Street',
      model: 'Royaloak',
      warrantyDuration: 24,
      warrantyStartDate: new Date(),
      warrantyEndDate: new Date(Date.now() + 24 * 30 * 24 * 60 * 60 * 1000),
      warrantyTerms: '2 years warranty',
      warrantyStatus: 'Active',
      warrantyNumber: 'WOOD-TABLE-2024-001',
      categoryId: furnitureCategory.id,
      shopId: homeShop.id,
    },
  });

  // Home Decor
  const wallArt = await prisma.product.create({
    data: {
      name: 'Abstract Canvas Wall Art',
      description: 'Modern abstract canvas painting for living room decoration',
      price: 89.99,
      discount: 20,
      quantity: 45,
      rating: 4.5,
      images: [
        'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1582879471734-e021de0902d0?w=600&h=600&fit=crop',
      ],
      color: ['Multicolor', 'Blue Tones', 'Earth Tones'],
      size: ['24x36 inches', '30x40 inches'],
      features: ['Canvas Print', 'Ready to Hang', 'UV Protected', 'Fade Resistant'],
      brand: 'Art Gallery',
      model: 'Abstract Series',
      categoryId: decorCategory.id,
      shopId: homeShop.id,
    },
  });

  const vase = await prisma.product.create({
    data: {
      name: 'Ceramic Decorative Vase',
      description: 'Elegant ceramic vase for flowers and home decoration',
      price: 39.99,
      discount: 15,
      quantity: 70,
      rating: 4.3,
      images: [
        'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=600&h=600&fit=crop',
      ],
      color: ['White', 'Blue', 'Gold'],
      size: ['Medium', 'Large'],
      features: ['Ceramic', 'Handcrafted', 'Waterproof', 'Easy to Clean'],
      brand: 'Home Decor Co',
      model: 'Classic Vase',
      categoryId: decorCategory.id,
      shopId: homeShop.id,
    },
  });

  // Sports Equipment
  const yogaMat = await prisma.product.create({
    data: {
      name: 'Premium Yoga Mat',
      description: 'Non-slip yoga mat with extra cushioning for comfort',
      price: 29.99,
      discount: 10,
      quantity: 100,
      rating: 4.7,
      images: [
        'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1592432678016-e910b452f9a0?w=600&h=600&fit=crop',
      ],
      color: ['Purple', 'Blue', 'Pink', 'Black'],
      size: ['Standard'],
      features: ['Non-Slip', '6mm Thick', 'Eco-Friendly', 'Carrying Strap'],
      brand: 'FitLife',
      model: 'Pro Mat',
      categoryId: sportsCategory.id,
      shopId: techShop.id,
    },
  });

  const dumbbell = await prisma.product.create({
    data: {
      name: 'Adjustable Dumbbell Set',
      description: 'Adjustable dumbbells with multiple weight options',
      price: 149.99,
      discount: 15,
      quantity: 35,
      rating: 4.8,
      images: [
        'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&h=600&fit=crop',
      ],
      color: ['Black'],
      size: ['5-50 lbs'],
      features: ['Adjustable Weight', 'Space Saving', 'Durable', 'Easy to Use'],
      brand: 'Bowflex',
      model: 'SelectTech',
      warrantyDuration: 12,
      warrantyStartDate: new Date(),
      warrantyEndDate: new Date(Date.now() + 12 * 30 * 24 * 60 * 60 * 1000),
      warrantyTerms: '1 year warranty',
      warrantyStatus: 'Active',
      warrantyNumber: 'BOWFLEX-DB-2024-001',
      categoryId: sportsCategory.id,
      shopId: techShop.id,
    },
  });

  // Books
  const book1 = await prisma.product.create({
    data: {
      name: 'The Complete Guide to Programming',
      description: 'Comprehensive guide to modern programming languages and best practices',
      price: 39.99,
      discount: 20,
      quantity: 50,
      rating: 4.6,
      images: [
        'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=600&h=600&fit=crop',
      ],
      color: [],
      size: ['Paperback', 'Hardcover'],
      features: ['500+ Pages', 'Updated 2024', 'Code Examples', 'Best Practices'],
      brand: "O'Reilly",
      model: 'Tech Books',
      categoryId: booksCategory.id,
      shopId: techShop.id,
    },
  });

  const book2 = await prisma.product.create({
    data: {
      name: 'Design Thinking Handbook',
      description: 'Learn design thinking methodologies and creative problem solving',
      price: 34.99,
      discount: 15,
      quantity: 40,
      rating: 4.7,
      images: [
        'https://images.unsplash.com/photo-1589998059171-988d887df646?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&h=600&fit=crop',
      ],
      color: [],
      size: ['Paperback'],
      features: ['Illustrated', 'Case Studies', 'Practical Exercises', 'Expert Insights'],
      brand: 'Design Press',
      model: 'Professional Series',
      categoryId: booksCategory.id,
      shopId: techShop.id,
    },
  });

  // Toys
  const lego = await prisma.product.create({
    data: {
      name: 'LEGO City Builder Set',
      description: 'Creative building blocks set for ages 6+',
      price: 79.99,
      discount: 10,
      quantity: 60,
      rating: 4.9,
      images: [
        'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=600&h=600&fit=crop',
      ],
      color: ['Multicolor'],
      size: ['Standard'],
      features: ['1000+ Pieces', 'Multiple Builds', 'Instructions Included', 'Safe Materials'],
      brand: 'LEGO',
      model: 'City Series',
      categoryId: toysCategory.id,
      shopId: homeShop.id,
    },
  });

  const boardGame = await prisma.product.create({
    data: {
      name: 'Strategy Board Game',
      description: 'Exciting strategy game for family game nights',
      price: 44.99,
      discount: 12,
      quantity: 50,
      rating: 4.6,
      images: [
        'https://images.unsplash.com/photo-1606167668584-78701c57f13d?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1632501641765-e568d28b0015?w=600&h=600&fit=crop',
      ],
      color: [],
      size: ['Standard'],
      features: ['2-6 Players', 'Ages 10+', '60-90 min Play', 'Award Winning'],
      brand: 'Hasbro',
      model: 'Strategy Collection',
      categoryId: toysCategory.id,
      shopId: homeShop.id,
    },
  });

  console.log('✅ Created products');

  // 8. Create Reviews for Products
  const review1 = await prisma.review.create({
    data: {
      productId: laptop1.id,
      shopId: techShop.id,
    },
  });

  await prisma.reviewItem.createMany({
    data: [
      {
        reviewId: review1.id,
        customerId: customer1.id,
        rating: 5,
        comment: 'Excellent laptop! Fast performance and beautiful display.',
        images: [],
      },
      {
        reviewId: review1.id,
        customerId: customer2.id,
        rating: 4.5,
        comment: 'Great product, but a bit pricey.',
        images: [],
      },
    ],
  });

  const review2 = await prisma.review.create({
    data: {
      productId: phone1.id,
      shopId: techShop.id,
    },
  });

  await prisma.reviewItem.create({
    data: {
      reviewId: review2.id,
      customerId: customer1.id,
      rating: 5,
      comment: 'Best iPhone yet! Camera quality is amazing.',
      images: [],
    },
  });

  console.log('✅ Created reviews');

  // 9. Create Flash Sales
  const flashSale = await prisma.flashSale.create({
    data: {
      name: 'Black Friday Sale',
      description: 'Huge discounts on electronics and fashion',
      image: 'https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=800&h=400&fit=crop',
      startDateTime: new Date(),
      endDateTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    },
  });

  await prisma.flashSaleItem.createMany({
    data: [
      { flashSaleId: flashSale.id, productId: laptop1.id, discount: 20 },
      { flashSaleId: flashSale.id, productId: phone1.id, discount: 15 },
      { flashSaleId: flashSale.id, productId: mensJeans.id, discount: 30 },
      { flashSaleId: flashSale.id, productId: womensDress.id, discount: 35 },
    ],
  });

  console.log('✅ Created flash sale');

  // 10. Create Coupons
  const coupon1 = await prisma.coupon.create({
    data: {
      shopId: techShop.id,
    },
  });

  await prisma.couponItem.createMany({
    data: [
      {
        couponId: coupon1.id,
        discount: 10,
        code: 'TECH10',
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
      {
        couponId: coupon1.id,
        discount: 15,
        code: 'TECH15',
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    ],
  });

  const coupon2 = await prisma.coupon.create({
    data: {
      shopId: fashionShop.id,
    },
  });

  await prisma.couponItem.create({
    data: {
      couponId: coupon2.id,
      discount: 20,
      code: 'FASHION20',
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  console.log('✅ Created coupons');

  // 11. Create Follows
  await prisma.follow.createMany({
    data: [
      { customerId: customer1.id, shopId: techShop.id },
      { customerId: customer1.id, shopId: fashionShop.id },
      { customerId: customer2.id, shopId: techShop.id },
      { customerId: customer2.id, shopId: homeShop.id },
    ],
  });

  console.log('✅ Created follows');

  // 12. Create Wishlists
  const wishlist1 = await prisma.wishlist.create({
    data: {
      customerId: customer1.id,
    },
  });

  await prisma.wishlistItem.createMany({
    data: [
      { wishlistId: wishlist1.id, productId: laptop2.id, quantity: 1 },
      { wishlistId: wishlist1.id, productId: phone2.id, quantity: 1 },
      { wishlistId: wishlist1.id, productId: sofa.id, quantity: 1 },
    ],
  });

  const wishlist2 = await prisma.wishlist.create({
    data: {
      customerId: customer2.id,
    },
  });

  await prisma.wishlistItem.createMany({
    data: [
      { wishlistId: wishlist2.id, productId: womensDress.id, quantity: 1 },
      { wishlistId: wishlist2.id, productId: wallArt.id, quantity: 1 },
    ],
  });

  console.log('✅ Created wishlists');

  // 13. Create Carts
  const cart1 = await prisma.cart.create({
    data: {
      customerId: customer1.id,
    },
  });

  await prisma.cartItem.createMany({
    data: [
      { cartId: cart1.id, productId: laptop1.id, quantity: 1 },
      { cartId: cart1.id, productId: mensShirt1.id, quantity: 2 },
    ],
  });

  console.log('✅ Created carts');

  // 14. Create Orders
  const order1 = await prisma.order.create({
    data: {
      customerId: customer1.id,
      shopId: techShop.id,
      vendorId: vendor1.id,
      quantity: 1,
      totalAmount: 1349.99,
      discount: 149.99,
      orderNumber: 'ORD-2024-001',
      status: 'DELIVERED',
      paymentStatus: 'PAID',
      orderShippingType: 'DELIVERY',
      name: customer1.name,
      phone: customer1.phone || '',
      email: customer1.email,
      address: customer1.address || '',
      city: 'New York',
      state: 'NY',
      country: 'USA',
      zipCode: '10001',
      terms: true,
      isReview: true,
    },
  });

  await prisma.orderItem.create({
    data: {
      orderId: order1.id,
      productId: laptop1.id,
      quantity: 1,
    },
  });

  await prisma.transaction.create({
    data: {
      orderId: order1.id,
      amount: 1349.99,
      transactionId: 'TXN-2024-001',
      status: 'SUCCESS',
      method: 'CREDIT_CARD',
    },
  });

  const order2 = await prisma.order.create({
    data: {
      customerId: customer2.id,
      shopId: fashionShop.id,
      vendorId: vendor2.id,
      quantity: 2,
      totalAmount: 104.98,
      discount: 15.00,
      orderNumber: 'ORD-2024-002',
      status: 'SHIPPED',
      paymentStatus: 'PAID',
      orderShippingType: 'DELIVERY',
      name: customer2.name,
      phone: customer2.phone || '',
      email: customer2.email,
      address: customer2.address || '',
      city: 'Los Angeles',
      state: 'CA',
      country: 'USA',
      zipCode: '90001',
      terms: true,
    },
  });

  await prisma.orderItem.createMany({
    data: [
      { orderId: order2.id, productId: mensJeans.id, quantity: 1 },
      { orderId: order2.id, productId: womensTop.id, quantity: 1 },
    ],
  });

  await prisma.transaction.create({
    data: {
      orderId: order2.id,
      amount: 104.98,
      transactionId: 'TXN-2024-002',
      status: 'SUCCESS',
      method: 'DEBIT_CARD',
    },
  });

  const order3 = await prisma.order.create({
    data: {
      customerId: customer1.id,
      shopId: homeShop.id,
      vendorId: vendor3.id,
      quantity: 1,
      totalAmount: 764.99,
      discount: 135.00,
      orderNumber: 'ORD-2024-003',
      status: 'PENDING',
      paymentStatus: 'UNPAID',
      orderShippingType: 'DELIVERY',
      name: customer1.name,
      phone: customer1.phone || '',
      email: customer1.email,
      address: customer1.address || '',
      city: 'Chicago',
      state: 'IL',
      country: 'USA',
      zipCode: '60007',
      terms: true,
    },
  });

  await prisma.orderItem.create({
    data: {
      orderId: order3.id,
      productId: sofa.id,
      quantity: 1,
    },
  });

  console.log('✅ Created orders');

  // 15. Create Recent Products View
  await prisma.recentProduct.createMany({
    data: [
      { customerId: customer1.id, productId: laptop1.id },
      { customerId: customer1.id, productId: phone1.id },
      { customerId: customer1.id, productId: sofa.id },
      { customerId: customer2.id, productId: womensDress.id },
      { customerId: customer2.id, productId: wallArt.id },
    ],
  });

  console.log('✅ Created recent product views');

  console.log('🎉 Database seeding completed successfully!');
  console.log('\n📊 Summary:');
  console.log('- 6 Users (1 Admin, 3 Vendors, 2 Customers)');
  console.log('- 3 Shops');
  console.log('- 12 Categories (6 Parent + 6 Nested)');
  console.log('- 18 Products (2 per category)');
  console.log('- Multiple Reviews, Orders, Wishlists, Cart Items');
  console.log('- Flash Sale with discounted items');
  console.log('- Coupons for shops');
  console.log('\n🔐 Login Credentials:');
  console.log('Admin: admin@marketsphere.com / password123');
  console.log('Vendor1: vendor1@marketsphere.com / password123');
  console.log('Vendor2: vendor2@marketsphere.com / password123');
  console.log('Vendor3: vendor3@marketsphere.com / password123');
  console.log('Customer1: customer1@gmail.com / password123');
  console.log('Customer2: customer2@gmail.com / password123');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
