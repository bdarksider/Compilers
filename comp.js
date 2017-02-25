// Tokenizer
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
        if (LETTERS.test(char)) {
            let value = '';

            while (LETTERS.test(char)) {
                value += char;
                char = input[++current];
            }

            tokens.push({type: 'number', value });

            continue;
        }
        
        throw new TypeError('I dont know what this character is: ' + char);

    }

    return tokens;
}


var tokens = tokenizer('(add 2 (subtract 4 2))');

// Parser
// [{ type: 'paren', value: '(' }, ...]   =>   { type: 'Program', body: [...] }

function parser(tokens) {

    let current = 0;

    // using recursion instead of while loop
    
    function walk() {

        let token = tokens[current];
        console.log(token);
        // check for 'number' token
        if (token.type === 'number') {

            current++;

            // creating an AST node called 'NumberLiteral'
            return {
                type: 'NumberLiteral',
                value: token.value,
            };
        }

        if (token.type === 'string') {
            current++;

            // creating AST node called 'StringLiteral'
            if (token.type === 'string') {
                current++;

                return {
                    type: 'StringLiteral',
                    value: token.value,
                };
            }
        }

        // for CallExpressions
        // starting off when we encounter an open parenthesis
        if (
            token.type === 'paren' &&
            token.value === '('
        ) {
            // increment current because '(' is not required in AST
            // and name to token.value because the next value after
            // '(' will be function name.
            token = tokens[++current];

            let node = {
                type: 'CallExpressions',
                name: token.value,
                params: [],
            };

            token = tokens[++current];

            while(
                (token.type !== 'paren') || 
                (token.type === 'paren' && token.value !== ')')
            ) {
                node.params.push(walk());
                token = tokens[current];
            }

            current++;

            return node;
        }

        throw new TypeError(token.type);
    }

    // creating AST
    
    let ast = {
        type: 'Program',
        body: [],
    };

    // kickstarting 'walk' function, pushing nodes to 'ast.body'
    
    // The reason we are doing this inside a loop is because our program can have
    // `CallExpression` after one another instead of being nested.
    while (current < tokens.length) {
        ast.body.push(walk());
    }

    return ast;
}

var parsed = parser(tokens);

// Traverser

