import sharp from "sharp"
import { randomUUID } from "node:crypto"
import { HttpError } from "../Error/HttpError.js"

const MAX_IMAGE_SIDE_IN_PIXELS = 1200
const WEBP_QUALITY = 80

export async function processImage(originalImageBuffer: Buffer) {
    try {
        const originalImageMetadata = await sharp(originalImageBuffer).metadata()

        const isAlreadyOptimized =
            originalImageMetadata.format === "webp" &&
            (originalImageMetadata.width ?? Infinity) <= MAX_IMAGE_SIDE_IN_PIXELS &&
            (originalImageMetadata.height ?? Infinity) <= MAX_IMAGE_SIDE_IN_PIXELS

        const webpImageBuffer = isAlreadyOptimized
            ? originalImageBuffer
            : await sharp(originalImageBuffer)
                .rotate()
                .resize({
                    width: MAX_IMAGE_SIDE_IN_PIXELS,
                    height: MAX_IMAGE_SIDE_IN_PIXELS,
                    fit: "inside",
                    withoutEnlargement: true
                })
                .webp({ quality: WEBP_QUALITY })
                .toBuffer()

        const imageFileId = randomUUID()

        return {
            id: imageFileId,
            url: `/images/${imageFileId}`,
            data: webpImageBuffer
        }
    } catch {
        throw new HttpError("Arquivo de imagem inválido", 400)
    }
}