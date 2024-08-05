import type { Request, RequestHandler, Response } from "express";

import { brandService } from "@/api/brands/brandService";
import { handleServiceResponse } from "@/common/utils/httpHandlers";

class BrandController {
  public getAllBrands: RequestHandler = async (_req: Request, res: Response) => {
    const serviceResponse = await brandService.findAll();
    return handleServiceResponse(serviceResponse, res);
  };

  public getBrand: RequestHandler = async (req: Request, res: Response) => {
    const serviceResponse = await brandService.findById(req.params.id);
    return handleServiceResponse(serviceResponse, res);
  };

  public getStoresByProductID: RequestHandler = async (req: Request, res: Response) => {
    const serviceResponse = await brandService.findStoresByProductId(req.params.id);
    return handleServiceResponse(serviceResponse, res);
  };
}

export const brandController = new BrandController();
