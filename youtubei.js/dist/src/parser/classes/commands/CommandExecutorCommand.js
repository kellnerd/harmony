import { YTNode } from '../../helpers.js';
import { Parser } from '../../index.js';
class CommandExecutorCommand extends YTNode {
    constructor(data) {
        super();
        this.commands = Parser.parseCommands(data.commands);
    }
}
CommandExecutorCommand.type = 'CommandExecutorCommand';
export default CommandExecutorCommand;
//# sourceMappingURL=CommandExecutorCommand.js.map