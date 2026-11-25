export class ImageController {
    imageService;
    constructor(imageService) {
        this.imageService = imageService;
    }
    getImage = async (req, res) => {
        const imageData = await this.imageService.getImageData(req.params.id);
        res.set({
            "Content-Type": "image/webp",
            "Cache-Control": "public, max-age=31536000, immutable",
            "Access-Control-Allow-Origin": "*",
            "Cross-Origin-Resource-Policy": "cross-origin"
        });
        return res.send(imageData);
    };
}
//# sourceMappingURL=imageController.js.map