import { StatusCodes } from "http-status-codes";

import type { Brand } from "@/api/brands/brandModel";
import { UserRepository } from "@/api/brands/brandRepository";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";

export class BrandService {
  private brandRepository: UserRepository;

  constructor(repository: UserRepository = new UserRepository()) {
    this.brandRepository = repository;
  }

  // Retrieves all brands from the database
  async findAll(): Promise<ServiceResponse<Brand[] | null>> {
    try {
      const brands = await this.brandRepository.findAllAsync();
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
      const brand = await this.brandRepository.findByIdAsync(id);
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
}

export const brandService = new BrandService();
