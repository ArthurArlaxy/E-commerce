// Repository/ImageRepository.ts
import { prisma } from "../../Database/index.js"

export class ImagePrisma{
    async getImageFileById(imageFileId: string) {
        return await prisma.imageFile.findUnique({
            where: { id: imageFileId },
            select: { data: true }
        })
    }
}