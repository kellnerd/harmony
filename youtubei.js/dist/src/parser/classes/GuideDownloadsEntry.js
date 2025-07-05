import GuideEntry from './GuideEntry.js';
class GuideDownloadsEntry extends GuideEntry {
    constructor(data) {
        super(data.entryRenderer.guideEntryRenderer);
        this.always_show = !!data.alwaysShow;
    }
}
GuideDownloadsEntry.type = 'GuideDownloadsEntry';
export default GuideDownloadsEntry;
//# sourceMappingURL=GuideDownloadsEntry.js.map