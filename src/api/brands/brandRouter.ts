import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { brandController } from "@/api/brands/brandController";
import { BrandSchema, GetBrandSchema, GetStoresByProductIDSchema } from "@/api/brands/brandModel";
import { validateRequest } from "@/common/utils/httpHandlers";

export const brandRegistry = new OpenAPIRegistry();
export const brandRouter: Router = express.Router();

brandRegistry.register("Brand", BrandSchema);

// GET all brands
brandRegistry.registerPath({
  method: "get",
  path: "/brands",
  tags: ["Brands"],
  responses: createApiResponse(z.array(BrandSchema), "Success"),
});
brandRouter.get("/", brandController.getAllBrands);

// GET all brand by ID
brandRegistry.registerPath({
  method: "get",
  path: "/brands/{id}",
  tags: ["Brands"],
  request: { params: GetBrandSchema.shape.params },
  responses: createApiResponse(BrandSchema, "Success"),
});
brandRouter.get("/:id", validateRequest(GetBrandSchema), brandController.getBrand);

// GET stores by brand ID
brandRegistry.registerPath({
  method: "get",
  path: "/brands/{id}/stores",
  tags: ["Brands"],
  request: { params: GetStoresByProductIDSchema.shape.params },
  responses: createApiResponse(BrandSchema.shape.stores, "Success"),
});
brandRouter.get("/:id/stores", validateRequest(GetStoresByProductIDSchema), brandController.getStoresByBrandID);

// GET products by brand ID
brandRegistry.registerPath({
  method: "get",
  path: "/brands/{id}/products",
  tags: ["Brands"],
  request: { params: GetStoresByProductIDSchema.shape.params },
  responses: createApiResponse(BrandSchema.shape.stores, "Success"),
});
brandRouter.get("/:id/products", validateRequest(GetStoresByProductIDSchema), brandController.getProductsByBrandID);

// GET stores by product ID
// TODO: put this in a separate router rather than prefixing it with /brands
brandRegistry.registerPath({
  method: "get",
  path: "/brands/products/{id}/stores",
  tags: ["Products"],
  request: { params: GetStoresByProductIDSchema.shape.params },
  responses: createApiResponse(BrandSchema.shape.stores, "Success"),
});
brandRouter.get(
  "/products/:id/stores",
  validateRequest(GetStoresByProductIDSchema),
  brandController.getStoresByProductID,
);
