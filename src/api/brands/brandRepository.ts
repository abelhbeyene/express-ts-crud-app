import type { Brand } from "@/api/brands/brandModel";

// store in Redis or other cache
export const { data: brands }: { data: Brand[] } = require('./brands.json');

export class BrandRepository {
  async findAllAsync(): Promise<Brand[]> {
    return brands;
  }

  async findByIdAsync(id: Brand['id']): Promise<Brand | null> {
    return brands.find((brand) => brand.id === id) || null;
  }

  async findProductsByIdAsync(id: Brand['id']): Promise<Brand['products'] | null> {
    const brand = brands.find((brand) => brand.id === id)
    const products = new Set(brand?.products.concat(brand?.consolidated_products));
    return products.size > 0 ? Array.from(products) : null;
  }

  async findStoresByIdAsync(id: Brand['id']): Promise<Brand['stores'] | null> {
    const brand = brands.find((brand) => brand.id === id)
    return (brand && brand.stores.length > 0) ? brand.stores : null;
  }

  async findStoresByProductIDAsync(productId: string): Promise<Brand['stores'] | null> {
    const stores = brands.reduce<Brand['stores']>((accumulator, brand) => {
      if (brand.products.includes(productId) || brand.consolidated_products.includes(productId)) {
        accumulator = accumulator.concat(brand.stores)
      }
      return accumulator;
    }, []);

    return stores.length > 0 ? stores : null;
  }
}
