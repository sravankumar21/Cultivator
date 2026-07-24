import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Enterprise
  await prisma.enterprise.upsert({
    where: { id: "ent-001" },
    update: {},
    create: {
      id: "ent-001",
      name: "Cultivator Agriculture Pvt Ltd",
      phone: "+919876500000",
      email: "admin@cultivator.in",
      address: "Hyderabad, Telangana",
    },
  });

  // Products (5 core categories)
  const products = [
    { id: "prd-001", name: "Hybrid Rice Seeds", nameTe: "హైబ్రిడ్ రైస్ సీడ్స్", sku: "SED-001", category: "seeds", brand: "Bayer", brandTe: "బేయర్", description: "High-yield hybrid rice variety", descriptionTe: "అధిక దిగుబడి గల హైబ్రిడ్ రైస్ రకం", price: 450, unit: "kg", unitTe: "కేజీ", status: "active" },
    { id: "prd-002", name: "NPK Fertilizer 20:20:20", nameTe: "ఎన్‌పికే ఎరువు 20:20:20", sku: "FRT-001", category: "fertilizers", brand: "Coromandel", brandTe: "కోరోమండల్", description: "Balanced nutrient fertilizer", descriptionTe: "సమతుల్య పోషకాల ఎరువు", price: 380, unit: "bag", unitTe: "సంచులు", status: "active" },
    { id: "prd-003", name: "Neem Oil Pesticide", nameTe: "వేప నూనె పురుగుమందు", sku: "PST-001", category: "pesticides", brand: "Godrej", brandTe: "గోద్రెజ్", description: "Organic neem-based pesticide", descriptionTe: "సేంద్రియ వేప ఆధారిత పురుగుమందు", price: 280, unit: "ltr", unitTe: "లీటర్లు", status: "active" },
    { id: "prd-004", name: "Drip Irrigation Kit", nameTe: "డ్రిప్ ఇరిగేషన్ కిట్", sku: "IRG-001", category: "irrigation", brand: "Jain", brandTe: "జైన్", description: "Complete drip system for 1 acre", descriptionTe: "1 ఎకరం కోసం పూర్తి డ్రిప్ వ్యవస్థ", price: 12500, unit: "kit", unitTe: "కిట్", status: "active" },
    { id: "prd-005", name: "Sprayer Machine 16L", nameTe: "స్ప్రేయర్ మషీన్ 16L", sku: "TOL-001", category: "farming_equipment", brand: "Kisan", brandTe: "కిసాన్", description: "Battery-operated sprayer", descriptionTe: "బ్యాటరీ ఆపరేటెడ్ స్ప్రేయర్", price: 3200, unit: "piece", unitTe: "ముక్క", status: "active" },
  ];

  for (const p of products) {
    await prisma.product.upsert({
      where: { id: p.id },
      update: {},
      create: { ...p, enterpriseId: "ent-001" },
    });
  }

  // Dealer (1)
  await prisma.dealer.upsert({
    where: { id: "dlr-001" },
    update: {},
    create: {
      id: "dlr-001", name: "Sri Lakshmi Agro", nameTe: "శ్రీ లక్ష్మి ఆగ్రో",
      phone: "9876543210", email: "dealer@lakshmi.com",
      addressVillage: "Banswada", addressDistrict: "Kamareddy", addressState: "Telangana",
      addressPincode: "503187", addressFull: "Banswada, Kamareddy, Telangana 503187",
      locationLat: 18.3231, locationLng: 78.4015, serviceRadius: 15,
      description: "Agricultural supply dealer", descriptionTe: "వ్యవసాయ సరఫరా డీలర్",
      totalOrders: 0, totalCustomers: 0, totalCalls: 0, rating: 4.5, status: "active",
      enterpriseId: "ent-001",
    },
  });

  // Users: admin + dealer
  const adminHash = await bcrypt.hash("admin123", 10);
  const dealerHash = await bcrypt.hash("dealer123", 10);

  await prisma.user.upsert({
    where: { id: "usr-admin" },
    update: {},
    create: { id: "usr-admin", email: "admin@cultivator.in", name: "Admin User", phone: "9999999999", passwordHash: adminHash, role: "enterprise_admin", enterpriseId: "ent-001" },
  });

  await prisma.user.upsert({
    where: { id: "usr-dealer" },
    update: {},
    create: { id: "usr-dealer", email: "dealer@lakshmi.com", name: "Sri Lakshmi Owner", phone: "9876543210", passwordHash: dealerHash, role: "dealer_owner", enterpriseId: "ent-001", dealerId: "dlr-001" },
  });

  // Inventory (a few items in stock, 1 zero-stock for testing)
  const inventoryData = [
    { dealerId: "dlr-001", productId: "prd-001", quantity: 50, price: 470, lowStockThreshold: 10 },
    { dealerId: "dlr-001", productId: "prd-002", quantity: 100, price: 400, lowStockThreshold: 15 },
    { dealerId: "dlr-001", productId: "prd-003", quantity: 30, price: 300, lowStockThreshold: 8 },
    { dealerId: "dlr-001", productId: "prd-005", quantity: 0, price: 3400, lowStockThreshold: 3 },
  ];

  for (const inv of inventoryData) {
    const existing = await prisma.inventory.findFirst({ where: { dealerId: inv.dealerId, productId: inv.productId } });
    if (!existing) await prisma.inventory.create({ data: inv });
  }

  console.log("Seeding complete!");
  console.log("  - 1 enterprise, 5 products, 1 dealer");
  console.log("  - 2 users: admin@cultivator.in / admin123, dealer@lakshmi.com / dealer123");
  console.log("  - 4 inventory items (1 zero-stock for testing)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
