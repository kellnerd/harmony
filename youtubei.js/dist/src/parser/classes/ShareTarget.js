import { Text } from '../misc.js';
import { YTNode } from '../helpers.js';
import NavigationEndpoint from './NavigationEndpoint.js';
class ShareTarget extends YTNode {
    constructor(data) {
        super();
        if (Reflect.has(data, 'serviceEndpoint'))
            this.endpoint = new NavigationEndpoint(data.serviceEndpoint);
        else if (Reflect.has(data, 'navigationEndpoint'))
            this.endpoint = new NavigationEndpoint(data.navigationEndpoint);
        this.service_name = data.serviceName;
        this.target_id = data.targetId;
        this.title = new Text(data.title);
    }
}
ShareTarget.type = 'ShareTarget';
export default ShareTarget;
//# sourceMappingURL=ShareTarget.js.map