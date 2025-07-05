import type { RawNode } from '../../types/index.js';
import CommandContext from './CommandContext.js';
import AccessibilityContext from './AccessibilityContext.js';
export default class RendererContext {
    command_context?: CommandContext;
    accessibility_context?: AccessibilityContext;
    constructor(data?: RawNode);
}
