import { StatusCodes } from "http-status-codes";
import type { Mock } from "vitest";

import type { Brand } from "@/api/brands/brandModel";
import { BrandRepository } from "@/api/brands/brandRepository";
import { BrandService } from "@/api/brands/brandService";

vi.mock("@/api/brands/brandRepository");

describe("brandService", () => {
  let brandServiceInstance: BrandService;
  let brandRepositoryInstance: BrandRepository;

  const mockBrands: Brand[] = [
    {
      "id": "5a4e6d14-53d4-4583-bd6b-49f81b021d24",
      "created_at": "2019-03-18 13:09:22",
      "updated_at": "2019-06-28 09:42:14",
      "name": "Vue Cinemas",
      "internal_name": "",
      "logo": "arffae49101d293f3509c567549d7d2c91d52ca0cf.jpg",
      "colour": "",
      "success": "You top human, you. \nBig question is... who gets your next one?",
      "share": "I'm using @huggg_uk to send my friends & family a little surprise pick me up! Download and send a huggg too @ api.huggg.me\/download",
      "weight": 5000,
      "deleted_at": null,
      "expiry": 365,
      "website": "https:\/\/www.myvue.com\/",
      "integration_id": 4,
      "user_id": "",
      "email": null,
      "vat": 20,
      "faq": null,
      "description": "",
      "redeem": null,
      "location_text": "the UK",
      "map_pin_url": "https:\/\/cdn.huggg.me\/locations\/ard391c04c5c1eb6bd6a51a5c04fb13b9a4b460a8a.png",
      "consolidated": 0,
      "default_location_description_markdown": "",
      "products": [
        "5a3fe6f7-7796-44ca-84fe-70d4f751527d"
      ],
      "consolidated_products": [],
      "stores": [
        "15af2cdc-f352-11e8-80cd-02e611b48058",
        "15af31b3-f352-11e8-80cd-02e611b48058",
      ],
      "logo_url": "https:\/\/test.huggg.me\/brands\/arffae49101d293f3509c567549d7d2c91d52ca0cf.jpg"
    },
    {
      "id": "a715b837-f4fc-48ba-ba0a-7f53b6dc59c5",
      "created_at": "2019-03-18 17:38:32",
      "updated_at": "2019-03-18 17:38:32",
      "name": "Crosstown Doughnuts",
      "internal_name": "",
      "logo": "ar749ba10b3ed9e4dff20c89ce0b9bedf9.png",
      "colour": "",
      "success": "You top human, you. \nBig question is... who gets your next one?",
      "share": "I'm using @huggg_uk to send my friends & family a little surprise pick me up! Download and send a huggg too @ api.huggg.me\/download",
      "weight": 1060,
      "deleted_at": null,
      "expiry": 365,
      "website": "www.crosstowndoughnuts.com",
      "integration_id": 2,
      "user_id": "",
      "email": "james@crosstowndoughnuts.com",
      "vat": 20,
      "faq": null,
      "description": "",
      "redeem": null,
      "location_text": "London",
      "map_pin_url": "https:\/\/cdn.huggg.me\/locations\/ar388d0482c0da0500f78af4e0ddc9db1f6cd3aa81.png",
      "consolidated": 0,
      "default_location_description_markdown": "",
      "products": [
        "f5c72f41-972d-42b6-9ac5-51bad2afd01f",
        "57186a73-7857-4684-bf82-b2bc7b8a1040",
      ],
      "consolidated_products": [
        "26f7a82a-30a8-44e4-93cb-499a256d0ce9"
      ],
      "stores": [
        "1236a970-8e75-4c35-8aa6-1e37e204f334",
      ],
      "logo_url": "https:\/\/test.huggg.me\/brands\/ar749ba10b3ed9e4dff20c89ce0b9bedf9.png"
    },
  ];

  beforeEach(() => {
    brandRepositoryInstance = new BrandRepository();
    brandServiceInstance = new BrandService(brandRepositoryInstance);
  });

  describe("findAll", () => {
    it("return all brands", async () => {
      (brandRepositoryInstance.findAllAsync as Mock).mockReturnValue(mockBrands);

      const result = await brandServiceInstance.findAll();

      expect(result.statusCode).toEqual(StatusCodes.OK);
      expect(result.success).toBeTruthy();
      expect(result.message).equals("Brands found");
      expect(result.responseObject).toEqual(mockBrands);
    });

    it("returns a not found error for no brands found", async () => {
      (brandRepositoryInstance.findAllAsync as Mock).mockReturnValue(null);

      const result = await brandServiceInstance.findAll();

      expect(result.statusCode).toEqual(StatusCodes.NOT_FOUND);
      expect(result.success).toBeFalsy();
      expect(result.message).equals("No Brands found");
      expect(result.responseObject).toBeNull();
    });

    it("handles errors for findAllAsync", async () => {
      (brandRepositoryInstance.findAllAsync as Mock).mockRejectedValue(new Error("Database error"));

      const result = await brandServiceInstance.findAll();

      expect(result.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.success).toBeFalsy();
      expect(result.message).equals("An error occurred while retrieving brands.");
      expect(result.responseObject).toBeNull();
    });
  });

  describe("findById", () => {
    it("returns a brand for a valid ID", async () => {
      const testId = '5a4e6d14-53d4-4583-bd6b-49f81b021d24';
      const mockBrand = mockBrands.find((brand) => brand.id === testId);
      (brandRepositoryInstance.findByIdAsync as Mock).mockReturnValue(mockBrand);

      const result = await brandServiceInstance.findById(testId);

      expect(result.statusCode).toEqual(StatusCodes.OK);
      expect(result.success).toBeTruthy();
      expect(result.message).equals("Brand found");
      expect(result.responseObject).toEqual(mockBrand);
    });

    it("handles errors for findByIdAsync", async () => {
      const testId = '5a4e6d14-53d4-4583-bd6b-49f81b021d24';
      (brandRepositoryInstance.findByIdAsync as Mock).mockRejectedValue(new Error("Database error"));

      const result = await brandServiceInstance.findById(testId);

      expect(result.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.success).toBeFalsy();
      expect(result.message).equals("An error occurred while finding brand.");
      expect(result.responseObject).toBeNull();
    });

    it("returns a not found error for non-existent ID", async () => {
      const testId = '5a4e6d14-53d4-4583-bd6b-49f81b021d24';
      (brandRepositoryInstance.findByIdAsync as Mock).mockReturnValue(null);

      const result = await brandServiceInstance.findById(testId);

      expect(result.statusCode).toEqual(StatusCodes.NOT_FOUND);
      expect(result.success).toBeFalsy();
      expect(result.message).equals("Brand not found");
      expect(result.responseObject).toBeNull();
    });
  });
});
