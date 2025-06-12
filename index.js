import gemini from './config/gemini.js';
import readlineSync from 'readline-sync';
import colors from 'colors';

async function main() {
    console.log(colors.bold.green('Welcome! How can I assist you ?'));

    while (true) {
        const userInput = readlineSync.question(colors.yellow('You: '));

        if (userInput.toLowerCase() === 'exit') {
            console.log(colors.green('Bot: Goodbye!'));
            return;
        }

        try {
            const requestBody = {
                contents: [
                    {
                        parts: [
                            {
                                text: userInput
                            }
                        ]
                    }
                ]
            };

            const response = await gemini.post('', requestBody);

            if (
                response.data.candidates &&
                response.data.candidates.length > 0 &&
                response.data.candidates[0].content
            ) {
                const content = response.data.candidates[0].content;

                const completionText = content.parts[0].text;
                console.log(colors.green('Bot: ') + completionText);
            } else {
                console.error(colors.red('Unexpected response structure:', response.data));
            }
        } catch (error) {
            console.error(colors.red('Error:', error));
            if (error.response && error.response.data && error.response.data.error) {
                console.error(colors.red(error.response.data.error.message));
            } else if (error.request) {
                console.error(colors.red('No response received from the API'));
            } else {
                console.error(colors.red('Error: ' + error.message));
            }
        }
    }
}

main();
