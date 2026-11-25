import type { ImagePrisma } from "../Repository/prisma/ImagePrisma.js";
export declare class ImageService {
    private imageRepository;
    constructor(imageRepository: ImagePrisma);
    getImageData(imageFileId: string): Promise<Buffer<ArrayBuffer>>;
}
//# sourceMappingURL=ImageService.d.ts.map