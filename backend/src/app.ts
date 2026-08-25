import express from "express";
import cors from "cors";

import authRoutes from "./modules/auth/auth.routes.js";
import userRoutes from "./modules/users/user.routes.js";
import addressRoutes from "./modules/addresses/address.routes.js";
import productRoutes from "./modules/products/product.routes.js";
import categoryRoutes from "./modules/categories/category.routes.js";
import brandRoutes from "./modules/brands/brand.routes.js";
const app = express();

const frontendUrl =
  process.env.FRONTEND_URL ||
  "http://localhost:3000";

app.use(
  cors({
    origin: frontendUrl,
    credentials: true,
  }),
);

app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Matcha Cafe API is running",
  });
});

app.use(
  "/api/v1/auth",
  authRoutes,
);

app.use(
  "/api/v1/users",
  userRoutes,
);

app.use(
  "/api/v1/addresses",
  addressRoutes,
);
app.use(
  "/api/v1/products",
  productRoutes,
);
app.use(
  "/api/v1/categories",
  categoryRoutes,
);
app.use(
  "/api/v1/brands",
  brandRoutes,
);
export default app;