// Controller/ImageController.ts
import type { Handler } from "express"
import type { ImageService } from "../Service/ImageService.js"

export class ImageController {
    constructor(private imageService: ImageService) { }

    getImage: Handler = async (req, res) => {
        const imageData = await this.imageService.getImageData(req.params.id as string)

        res.set({
            "Content-Type": "image/webp",
            "Cache-Control": "public, max-age=31536000, immutable",
            "Access-Control-Allow-Origin": "*",
            "Cross-Origin-Resource-Policy": "cross-origin"
        })

        return res.send(imageData)
    }
}