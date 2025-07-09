import Text from './misc/Text.js';
import { YTNode } from '../helpers.js';
class EomSettingsDisclaimer extends YTNode {
    constructor(data) {
        super();
        this.disclaimer = new Text(data.disclaimer);
        this.info_icon = {
            icon_type: data.infoIcon.iconType
        };
        this.usage_scenario = data.usageScenario;
    }
}
EomSettingsDisclaimer.type = 'EomSettingsDisclaimer';
export default EomSettingsDisclaimer;
//# sourceMappingURL=EomSettingsDisclaimer.js.map