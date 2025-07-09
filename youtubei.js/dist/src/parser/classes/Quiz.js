import { YTNode } from '../helpers.js';
import Text from './misc/Text.js';
class Quiz extends YTNode {
    constructor(data) {
        super();
        this.choices = data.choices.map((choice) => ({
            text: new Text(choice.text),
            is_correct: choice.isCorrect
        }));
        this.total_votes = new Text(data.totalVotes);
    }
}
Quiz.type = 'Quiz';
export default Quiz;
//# sourceMappingURL=Quiz.js.map