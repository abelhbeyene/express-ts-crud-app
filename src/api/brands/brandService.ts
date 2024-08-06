import { StatusCodes } from "http-status-codes";
import NodeCache from "node-cache";

import type { Brand } from "@/api/brands/brandModel";
import { BrandRepository } from "@/api/brands/brandRepository";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { env } from "@/common/utils/envConfig";
import { logger } from "@/server";

export class BrandService {
  private brandRepository: BrandRepository;
  private cache: NodeCache;

  constructor(
    repository: BrandRepository = new BrandRepository(),
    cache: NodeCache = new NodeCache({ stdTTL: env.CACHE_TTL || 100, checkperiod: 120 }),
  ) {
    this.brandRepository = repository;
    this.cache = cache;
    // Debug
    // const cb = (key: string, value: any) => {
    //   console.log(`Key: ${key} set to ${value}`);
    //   console.log('this.cache.keys();', this.cache.keys());
    // }
    // this.cache.on("set", cb)
  }

  // Retrieves all brands from the database
  async findAll(): Promise<ServiceResponse<Brand[] | null>> {
    try {
      const cacheKey = "all_brands";

      const cachedBrands = this.cache.get<Brand[]>(cacheKey);
      const brands = cachedBrands || (await this.brandRepository.findAllAsync());

      if (!cachedBrands) {
        this.cache.set(cacheKey, brands);
      }

      if (!brands || brands.length === 0) {
        return ServiceResponse.failure("No Brands found", null, StatusCodes.NOT_FOUND);
      }
      return ServiceResponse.success<Brand[]>("Brands found", brands);
    } catch (ex) {
      const errorMessage = `Error finding all brands: $${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while retrieving brands.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Retrieves a single brand by their ID
  async findById(id: string): Promise<ServiceResponse<Brand | null>> {
    try {
      const cacheKey = `brand_${id}`;
      const cachedBrand = this.cache.get<Brand>(cacheKey);
      const brand = cachedBrand || (await this.brandRepository.findByIdAsync(id));

      if (!cachedBrand) {
        this.cache.set(cacheKey, brand);
      }

      if (!brand) {
        return ServiceResponse.failure("Brand not found", null, StatusCodes.NOT_FOUND);
      }
      return ServiceResponse.success<Brand>("Brand found", brand);
    } catch (ex) {
      const errorMessage = `Error finding brand with id ${id}:, ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure("An error occurred while finding brand.", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async findProductsByBrandId(id: string): Promise<ServiceResponse<Brand["stores"] | null>> {
    try {
      const cacheKey = `products_by_brand_${id}`;
      const cachedProducts = this.cache.get<Brand["products"]>(cacheKey);
      const products = cachedProducts || (await this.brandRepository.findProductsByIdAsync(id));

      if (!cachedProducts) {
        this.cache.set(cacheKey, products);
      }

      if (!products) {
        return ServiceResponse.failure("Products not found", null, StatusCodes.NOT_FOUND);
      }
      const uniqueProducts = new Set(products);
      return ServiceResponse.success<Brand["products"]>("Products found", Array.from(uniqueProducts));
    } catch (ex) {
      const errorMessage = `Error finding products with id ${id}:, ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while finding products.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findStoresByBrandId(id: string): Promise<ServiceResponse<Brand["stores"] | null>> {
    try {
      const cacheKey = `stores_by_brand_${id}`;
      const cachedStores = this.cache.get<Brand["stores"]>(cacheKey);
      const stores = cachedStores || (await this.brandRepository.findStoresByIdAsync(id));

      if (!cachedStores) {
        this.cache.set(cacheKey, stores);
      }

      if (!stores) {
        return ServiceResponse.failure("Stores not found", null, StatusCodes.NOT_FOUND);
      }
      const uniqueStores = new Set(stores);
      return ServiceResponse.success<Brand["stores"]>("Stores found", Array.from(uniqueStores));
    } catch (ex) {
      const errorMessage = `Error finding stores with id ${id}:, ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while finding stores.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findStoresByProductId(id: string): Promise<ServiceResponse<Brand["stores"] | null>> {
    try {
      const cacheKey = `stores_by_product_${id}`;
      const cachedStores = this.cache.get<Brand["stores"]>(cacheKey);
      const stores = cachedStores || (await this.brandRepository.findStoresByProductIDAsync(id));

      if (!cachedStores) {
        this.cache.set(cacheKey, stores);
      }

      if (!stores) {
        return ServiceResponse.failure("Stores not found", null, StatusCodes.NOT_FOUND);
      }
      const uniqueStores = new Set(stores);
      return ServiceResponse.success<Brand["stores"]>("Stores found", Array.from(uniqueStores));
    } catch (ex) {
      const errorMessage = `Error finding stores with id ${id}:, ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while finding stores.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

export const brandService = new BrandService();
