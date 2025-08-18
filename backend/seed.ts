import "dotenv/config";
import seedDatabase from "./utils/seeder";

const runSeeder = async () => {
  try {
    console.log("🚀 Starting database seeder...");
    await seedDatabase();
    console.log("✅ Seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

runSeeder();
