import { YTNode } from '../../helpers.js';
import { Parser } from '../../index.js';
class SignalServiceEndpoint extends YTNode {
    constructor(data) {
        super();
        if (Array.isArray(data.actions)) {
            this.actions = Parser.parseArray(data.actions.map((action) => {
                delete action.clickTrackingParams;
                return action;
            }));
        }
        this.signal = data.signal;
    }
}
SignalServiceEndpoint.type = 'SignalServiceEndpoint';
export default SignalServiceEndpoint;
//# sourceMappingURL=SignalServiceEndpoint.js.map