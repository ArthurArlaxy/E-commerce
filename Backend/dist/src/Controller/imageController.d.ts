import type { Handler } from "express";
import type { ImageService } from "../Service/ImageService.js";
export declare class ImageController {
    private imageService;
    constructor(imageService: ImageService);
    getImage: Handler;
}
//# sourceMappingURL=imageController.d.ts.map