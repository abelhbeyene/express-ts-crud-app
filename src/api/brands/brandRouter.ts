import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { GetBrandSchema, BrandSchema } from "@/api/brands/brandModel";
import { validateRequest } from "@/common/utils/httpHandlers";
import { brandController } from "./brandController";

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
