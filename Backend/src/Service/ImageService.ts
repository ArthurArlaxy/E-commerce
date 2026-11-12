// Service/ImageService.ts
import { HttpError } from "../Error/HttpError.js"
import type { ImagePrisma } from "../Repository/prisma/ImagePrisma.js"

export class ImageService {
    constructor(private imageRepository: ImagePrisma) { }

    async getImageData(imageFileId: string) {
        const imageFile = await this.imageRepository.getImageFileById(imageFileId)

        if (!imageFile) {
            throw new HttpError("Imagem não encontrada", 404)
        }

        return Buffer.from(imageFile.data)
    }
}