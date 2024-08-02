import type { Brand } from "@/api/brands/brandModel";

export const brands: { data: Brand[] } = require('./brands.json');

export class UserRepository {
  async findAllAsync(): Promise<Brand[]> {
    return brands.data;
  }

  async findByIdAsync(id: Brand['id']): Promise<Brand | null> {
    return brands.data.find((brand) => brand.id === id) || null;
  }
}
