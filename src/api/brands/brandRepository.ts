import type { Brand } from "@/api/brands/brandModel";

export const { data: brands }: { data: Brand[] } = require('./brands.json');

export class UserRepository {
  async findAllAsync(): Promise<Brand[]> {
    return brands;
  }

  async findByIdAsync(id: Brand['id']): Promise<Brand | null> {
    return brands.find((brand) => brand.id === id) || null;
  }
}
