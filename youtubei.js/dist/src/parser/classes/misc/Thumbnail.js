export default class Thumbnail {
    constructor(data) {
        this.url = data.url;
        this.width = data.width;
        this.height = data.height;
    }
    /**
     * Get thumbnails from response object.
     */
    static fromResponse(data) {
        if (!data)
            return [];
        let thumbnail_data;
        if (data.thumbnails) {
            thumbnail_data = data.thumbnails;
        }
        else if (data.sources) {
            thumbnail_data = data.sources;
        }
        if (thumbnail_data) {
            return thumbnail_data.map((x) => new Thumbnail(x)).sort((a, b) => b.width - a.width);
        }
        return [];
    }
}
//# sourceMappingURL=Thumbnail.js.map