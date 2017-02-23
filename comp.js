// desired output (add 2 (subtract 4 2) => [{type: 'paren', value: '('}, ...])
function tokenizer(input) {

    // A 'current' variable for tracking our position in the code 
    let current = 0; 

    // 'tokens' array for pushing our tokens to .
    let tokens = [];

    while (current < input.length) {

        let char = input[current];

        // check for open parenthesis
        if (char === '(') {
            tokens.push({
                type: 'paren',
                value: '(',
            });

            current++;
            continue;
        }

        // check for closing parenthesis
        if (char === ')') {
            tokens.push({
                type: 'paren',
                value: ')',
            })

            current++;
            continue;
        }

        // check for whitespaces, isn't import for us to store as a token
        let WHITESPACE = /\s/;
        if (WHITESPACE.test(char)) {
            current++;
            continue;
        }

        // capture number as a sequence 
        let NUMBERS = /[0-9]/;
        if (NUMBERS.test(char)) {

            let value = '';

            while (NUMBERS.test(char)) {
                value += char;
                char = input[++current];
            }

            tokens.push({type: 'number', value});

            continue;
        }

        // check for strings
        if (char === '"') {
            let value = '';

            // skips the opening double quote
            char = input[++current];

            while (char !== '"') {
                value += char;
                char = input[++current];
            }

            // skip the closing double quote
            char = input[++current];

            tokens.push({type: 'string', value});

            continue;
        }

        // name token
        
        let LETTERS = /[a-z]/i;
        
    }
}

tokenizer('((((');