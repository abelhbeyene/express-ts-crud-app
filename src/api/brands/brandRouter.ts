import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { GetBrandSchema, BrandSchema, GetStoresByProductIDSchema } from "@/api/brands/brandModel";
import { validateRequest } from "@/common/utils/httpHandlers";
import { brandController } from "@/api/brands/brandController";

export const brandRegistry = new OpenAPIRegistry();
export const brandRouter: Router = express.Router();

brandRegistry.register("Brand", BrandSchema);

brandRegistry.registerPath({
  method: "get",
  path: "/brands",
  tags: ["Brands"],
  responses: createApiResponse(z.array(BrandSchema), "Success"),
});

brandRouter.get("/", brandController.getAllBrands);

brandRegistry.registerPath({
  method: "get",
  path: "/brands/{id}",
  tags: ["Brands"],
  request: { params: GetBrandSchema.shape.params },
  responses: createApiResponse(BrandSchema, "Success"),
});

brandRouter.get("/:id", validateRequest(GetBrandSchema), brandController.getBrand);

brandRegistry.registerPath({
  method: "get",
  path: "/brands/{id}/stores",
  tags: ["Brands"],
  request: { params: GetStoresByProductIDSchema.shape.params },
  responses: createApiResponse(BrandSchema.shape.stores, "Success"),
});
brandRouter.get("/:id/stores", validateRequest(GetStoresByProductIDSchema), brandController.getStoresByBrandID);

// TODO: put this in a separate router rather than prefixing it with /brands
brandRegistry.registerPath({
  method: "get",
  path: "/brands/products/{id}/stores",
  tags: ["Products"],
  request: { params: GetStoresByProductIDSchema.shape.params },
  responses: createApiResponse(BrandSchema.shape.stores, "Success"),
});
brandRouter.get("/products/:id/stores", validateRequest(GetStoresByProductIDSchema), brandController.getStoresByProductID);
