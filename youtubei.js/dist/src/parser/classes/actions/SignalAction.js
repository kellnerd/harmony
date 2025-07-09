import { YTNode } from '../../helpers.js';
class SignalAction extends YTNode {
    constructor(data) {
        super();
        this.signal = data.signal;
    }
}
SignalAction.type = 'SignalAction';
export default SignalAction;
//# sourceMappingURL=SignalAction.js.map