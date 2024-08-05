import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { string, z } from "zod";

extendZodWithOpenApi(z);

export type Brand = z.infer<typeof BrandSchema>;
export const BrandSchema = z.object({
    id: z.string().uuid(),
    created_at: z.string().datetime(),
    updated_at: z.string().datetime(),
    name: z.string(),
    internal_name: z.string().optional(),
    logo: z.string().optional(),
    colour: z.string().optional(),
    success: z.string(),
    share: z.string(),
    weight: z.number(),
    deleted_at: z.string().nullable(),
    expiry: z.number(),
    website: z.string().nullable(),
    integration_id: z.number(),
    user_id: z.string().optional(),
    email: z.string().nullable(),
    vat: z.number(),
    faq: z.string().nullable(),
    description: z.string().optional(),
    redeem: z.string().nullable(),
    location_text: z.string(),
    map_pin_url: z.string().optional(),
    consolidated: z.number(),
    default_location_description_markdown: z.string().optional(),
    products: z.array(z.string().uuid()),
    consolidated_products: z.array(z.string().uuid()),
    stores: z.array(z.string()),
    logo_url: z.string().url()
});

// Input Validation for 'GET /brands/:id' endpoint
export const GetBrandSchema = z.object({
    params: z.object({ id: BrandSchema.shape.id }),
});

export const GetStoresByProductIDSchema = z.object({
    params: z.object({ id: BrandSchema.shape.products.element }),
});
