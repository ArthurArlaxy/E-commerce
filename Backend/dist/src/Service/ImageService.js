// Service/ImageService.ts
import { HttpError } from "../Error/HttpError.js";
export class ImageService {
    imageRepository;
    constructor(imageRepository) {
        this.imageRepository = imageRepository;
    }
    async getImageData(imageFileId) {
        const imageFile = await this.imageRepository.getImageFileById(imageFileId);
        if (!imageFile) {
            throw new HttpError("Imagem não encontrada", 404);
        }
        return Buffer.from(imageFile.data);
    }
}
//# sourceMappingURL=ImageService.js.map