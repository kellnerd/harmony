import CommandContext from './CommandContext.js';
import AccessibilityContext from './AccessibilityContext.js';
export default class RendererContext {
    constructor(data) {
        if (!data)
            return;
        if ('commandContext' in data) {
            this.command_context = new CommandContext(data.commandContext);
        }
        if ('accessibilityContext' in data) {
            this.accessibility_context = new AccessibilityContext(data.accessibilityContext);
        }
    }
}
//# sourceMappingURL=RendererContext.js.map