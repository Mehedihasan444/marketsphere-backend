import { Server } from "http";
import app from "./app";
import config from "./app/config";
import { seed } from "./app/utils/seeding";
import { seedNestedCategories } from "./utils/seed-nested-categories";

async function main() {
  const server: Server = app.listen(config.port, async () => {
    console.log("Sever is running on port ", config.port);
    // Call the seeding function
    try {
      await seed();
      console.log("Database seeding completed!");
      await seedNestedCategories();
      console.log("Nested categories seeding completed!");
    } catch (error) {
      console.error("Database seeding failed:", error);
    }
  });

  
  const exitHandler = () => {
    if (server) {
      server.close(() => {
        console.info("Server closed!");
      });
    }
    process.exit(1);
  };
  process.on("uncaughtException", (error) => {
    console.log(error);
    exitHandler();
  });

  process.on("unhandledRejection", (error) => {
    console.log(error);
    exitHandler();
  });
}

main().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
