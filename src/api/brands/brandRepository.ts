import type { Brand } from "@/api/brands/brandModel";

export const { data: brands }: { data: Brand[] } = require("./brands.json");

export class BrandRepository {
  async findAllAsync(): Promise<Brand[]> {
    return brands;
  }

  async findByIdAsync(id: Brand["id"]): Promise<Brand | null> {
    const brand = brands.find((brand) => brand.id === id);
    return brand || null;
  }

  async findProductsByIdAsync(id: Brand["id"]): Promise<Brand["products"] | null> {
    const brand = brands.find((brand) => brand.id === id);
    if (!brand || (brand.products.length === 0 && brand.consolidated_products.length === 0)) {
      return null;
    }

    return brand.products.concat(brand.consolidated_products);
  }

  async findStoresByIdAsync(id: Brand["id"]): Promise<Brand["stores"] | null> {
    const brand = brands.find((brand) => brand.id === id);
    return brand && brand.stores.length > 0 ? brand.stores : null;
  }

  async findStoresByProductIDAsync(productId: string): Promise<Brand["stores"] | null> {
    const stores = brands.reduce<Brand["stores"]>((accumulator, brand) => {
      if (brand.products.includes(productId) || brand.consolidated_products.includes(productId)) {
        return accumulator.concat(brand.stores);
      }
      return accumulator;
    }, []);

    return stores.length > 0 ? stores : null;
  }
}
