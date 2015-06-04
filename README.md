### Challenges

#### 1. Improve grammar

The current grammar does not support the exponentiation operator (`^`), nor the unary negation operator (`-`). The first challenge is to improve the grammar so those are supported, and implement the changes. The following unit tests should pass:

```javascript
    it("should parse exponentiation", function() {
      expect(Expression.parse("2*2^8").result).toBe(512);
    });
    it("should parse negation", function() {
      expect(Expression.parse("2^-(2*-2)+-5").result).toBe(11);
    });
```
#### 2. Parse should generate an Abstract Syntax Tree

The current parser returns the result and the matched string of the input mathematical expression when `Expression.parse(input)` is called. The second challenge is to add a `Expression.compile(input)` function that returns an [Abstract Syntax Tree (AST)](http://stackoverflow.com/q/5026517/2654518).

The AST should have a `result()` function that computes the result when called. Implement it such as each AST node has a `result()` function that computes its subtree result.

For the input `"8*(2+3+5)"`, the function `Expression.compile(input)` should return the following AST:

```
         op:'*'
         /    \
leftNode/      \rightNode
       /        \
    val:8      op:'+'
               /    \
      leftNode/      \rightNode
             /        \
          op:'+'     val:5
          /    \
 leftNode/      \rightNode
        /        \
     val:2      val:3
```

The AST root node should also have a `match` property with the string matched as value. The following unit tests should pass:

```javascript
  describe("compile", function() {
    var ast = Expression.compile("8*(2+3+5)");
    it("should create valid AST", function() {
      expect(JSON.stringify(ast)).toBe(JSON.stringify({
        leftNode: {
          val: 8
        },
        op: '*',
        rightNode: {
          leftNode: {
            leftNode: {
              val: 2
            },
            op: '+',
            rightNode: {
              val: 3
            }
          },
          op: '+',
          rightNode: {
            val: 5
          }
        },
        match: '8*(2+3+5)' 
      }));
    });
    it("should create AST that computes right result", function() {
      expect(ast.result()).toBe(80);
    });
  });
```

#### 3. Implement an Abstract Descent Parser generator (HARD!)

The generator should receive an EBNF grammar definition as its input, and generate javascript code for an Abstract Descent Parser that matches strings with the given grammar. The generated parser should have a `match(input)` function that returns the matched string.

The generator should be an Abstract Descent Parser itself. Define the EBNF grammar it accepts and implement it. Add the logic to your generator so it outputs javascript code accordingly.

A suggestion for the EBNF grammar is exemplified below. Blanks are ignored. Each production ends with `;` and has its left and right sides separated by `:`. Terminal symbols may be represented as single characters between `'` or as regular expressions between `/`. Mind that regular expression can have escaped `\/` inside.

```
  expr : term (/[+-]/ term)*;
  term : factor (/[*\/]/ factor)*;
factor : number | '(' expr ')';
number : /\d+(?:\.\d+)?/;
```

It should recognize `|` for "or", parenthesis for a grouped sequence of symbols, `*` for zero-or-more, and also `+` for one-or-more and `?` for optional symbol.

### Running static code analysis and unit tests

1. Change to the project's root directory
2. Install project dependencies with `npm install`
3. Run `grunt`

#### Requisites

1. [Node.js](https://nodejs.org/) version >= 0.8.0
2. Grunt CLI (install with `npm install -g grunt-cli`)
