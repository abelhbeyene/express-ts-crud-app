import { StatusCodes } from "http-status-codes";
import request from "supertest";

import type { Brand } from "@/api/brands/brandModel";
import { brands } from "@/api/brands/brandRepository";
import type { ServiceResponse } from "@/common/models/serviceResponse";
import { app } from "@/server";

describe("Brand API Endpoints", () => {
  describe("GET /brands", () => {
    it("should return a list of brands", async () => {
      const response = await request(app).get("/brands");
      const responseBody: ServiceResponse<Brand[]> = response.body;

      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(responseBody.success).toBeTruthy();
      expect(responseBody.message).toContain("Brands found");
      expect(responseBody.responseObject.length).toEqual(brands.length);
      expect(responseBody.responseObject).toEqual(brands);
    });
  });

  describe("GET /brands/:id", () => {
    it("should return a brand for a valid ID", async () => {
      const testId = "5a4e6d14-53d4-4583-bd6b-49f81b021d24";
      const expectedBrand = brands.find((brand) => brand.id === testId) as Brand;

      const response = await request(app).get(`/brands/${testId}`);
      const responseBody: ServiceResponse<Brand> = response.body;

      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(responseBody.success).toBeTruthy();
      expect(responseBody.message).toContain("Brand found");
      if (!expectedBrand) throw new Error("Invalid test data: expectedBrand is undefined");
      expect(expectedBrand).toEqual(responseBody.responseObject);
    });

    it("should return a not found error for non-existent ID", async () => {
      const testId = "aaaabbbb-aaaa-bbbb-aaaa-49f81b021d24";

      const response = await request(app).get(`/brands/${testId}`);
      const responseBody: ServiceResponse = response.body;

      expect(response.statusCode).toEqual(StatusCodes.NOT_FOUND);
      expect(responseBody.success).toBeFalsy();
      expect(responseBody.message).toContain("Brand not found");
      expect(responseBody.responseObject).toBeNull();
    });

    it("should return a bad request for invalid ID format", async () => {
      const invalidInput = "abc";
      const response = await request(app).get(`/brands/${invalidInput}`);
      const responseBody: ServiceResponse = response.body;

      expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(responseBody.success).toBeFalsy();
      expect(responseBody.message).toContain("Invalid input");
      expect(responseBody.responseObject).toBeNull();
    });
  });

  describe("GET /products/:id/stores", () => {
    it("should return a list of stores for a valid product ID", async () => {
      const testProductId = "26f7a82a-30a8-44e4-93cb-499a256d0ce9";
      const expectedStores = brands.reduce<Brand["stores"]>((accumulator, brand) => {
        if (brand.products.includes(testProductId) || brand.consolidated_products.includes(testProductId)) {
          return accumulator.concat(brand.stores);
        }
        return accumulator;
      }, []);

      const response = await request(app).get(`/brands/products/${testProductId}/stores`);
      const responseBody: ServiceResponse<Brand["stores"]> = response.body;

      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(responseBody.success).toBeTruthy();
      expect(responseBody.message).toContain("Stores found");
      expect(responseBody.responseObject.length).toEqual(expectedStores.length);
      expect(responseBody.responseObject).toEqual(expectedStores);
    });

    it("should return a not found error for non-existent product ID", async () => {
      const testProductId = "aaaabbbb-aaaa-bbbb-aaaa-49f81b021d24";

      const response = await request(app).get(`/brands/products/${testProductId}/stores`);
      const responseBody: ServiceResponse = response.body;

      expect(response.statusCode).toEqual(StatusCodes.NOT_FOUND);
      expect(responseBody.success).toBeFalsy();
      expect(responseBody.message).toContain("Stores not found");
      expect(responseBody.responseObject).toBeNull();
    });

    it("should return a bad request for invalid product ID format", async () => {
      const invalidInput = "abc";
      const response = await request(app).get(`/brands/products/${invalidInput}/stores`);
      const responseBody: ServiceResponse = response.body;

      expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(responseBody.success).toBeFalsy();
      expect(responseBody.message).toContain("Invalid input");
      expect(responseBody.responseObject).toBe(null);
    });
  });
});
