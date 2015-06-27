### Demo

* [Expression - JavaScript Abstract Descent Parser](http://ericbn.github.io/js-abstract-descent-parser/)

### Talk

* [Introduction to Grammar and Parsing using the Recursive Descent Parser algorithm](https://www.youtube.com/watch?v=9jSSSE2FuLU)

### Further reading / watching

#### Online course

* Stanford University's [Compilers](https://www.coursera.org/course/compilers)

#### Books

* Aho, Lam, Sethi & Ullman's [Compilers: principles, techniques, and tools ("dragon book")](http://dragonbook.stanford.edu/)
* Fowler's [Domain Specific Languages](http://martinfowler.com/books/dsl.html)

### Challenges

#### 1. Make parser generate an Abstract Syntax Tree

The current mathematical expression parser returns the result and the matched string when `Expression.parse(input)` is called. The first challenge is to add a `Expression.compile(input)` function that returns an [Abstract Syntax Tree (AST)](http://stackoverflow.com/q/5026517/2654518).

The AST should have a `result()` function that computes the result when called. Implement it such as each AST node has a `result()` function that computes its subtree result. You can use the following code and represent your nodes as instances of `Operation` and `Constant`:

```javascript
  var Operation = function(leftNode, op, rightNode) {
    this.leftNode = leftNode;
    this.op = op;
    this.rightNode = rightNode;
  };
  Operation.prototype.result = function() {
    // implement this
  };

  var Constant = function(val) {
    this.val = val;
  };
  Constant.prototype.result = function() {
    // implement this
  };
```

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

The AST root node should also have a `match` property, with the string matched as its value.

The following unit tests should pass:

```javascript
  describe("compile", function() {
    var input = "8*(2+3+5)";
    var ast = Expression.compile(input);
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
    it("should create AST that returns match in root node", function() {
      expect(ast.match).toBe(input);
    });
  });
```

To keep the original unit tests working, you might want to change `Expression.parse` function to:

```javascript
Expression.parse = function(input) {
  var ast = Expression.compile(input);
  return ast ? { result: ast.result(), match: ast.match } : null;
};
```

#### 2. Make parser accept variables

This requires the parser to return an AST, so you must complete the previous challenge first.

The current grammar only accepts constant numbers. Improve the grammar so it can also accept variables, defined by letters in the mathematical expression. The AST returned by the parser should now have its `result()` function take an object as argument. The AST should compute the result using the values from the object variables when a variable appears in the mathematical expression.

The following unit tests should pass:

```javascript
    it("should compile and compute result with given variable", function() {
      var ast = Expression.compile("2+x");
      expect(ast.result({ x: 1 })).toBe(3);
      expect(ast.result({ x: 2 })).toBe(4);
    });
    it("should compile and compute with variable appearing more than once", function() {
      var ast = Expression.compile("x+x*x/2");
      expect(ast.result({ x: 4 })).toBe(12);
      expect(ast.result({ x: 8 })).toBe(40);
    });
    it("should compile and compute with more than one variable", function() {
      var ast = Expression.compile("2584/y-x/3");
      expect(ast.result({ x: 9, y: 4 })).toBe(643);
      expect(ast.result({ x: 144, y: 34 })).toBe(28);
    });
  });
```

To keep the previous unit tests working, make sure the `result()` function works if no object is passed as parameter.

#### 3. Further improve the grammar

The current grammar does not support the exponentiation operator (`^`), nor the unary negation operator (`-`). The third challenge is to improve the grammar so those are supported, and implement the changes. Note that exponentiation should have higher precedence than multiplication or division, and lower precedence than parenthesis.

When including the unary negation to the grammar, you might want to use the EBNF optional notation (`?`). The production "`s : t?`", for example, means `s` is defined by an optional `t` symbol. This is written in BNF as "`s : t | ε`", where `ε` means empty. 

The helper function for optional is straighforward to implement. It receives a function as parameter, calls the function and always returns `true`, since matching "empty" is valid. As we have an "or" in the BNF form, it should backtrack if the function passed as parameter fails.

```javascript
  var optional = function(func) {
    var backtrack = index;
    if (!func()) { index = bracktrack; }
    return true;
  };
```

You might also need to create a new type of tree node, a Negation:

```javascript
  var Negation = function(childNode) {
    this.childNode = childNode;
  };
  Negation.prototype.result = function() {
    // implement this
  };
```

The following unit tests should pass:

```javascript
    it("should parse exponentiation", function() {
      expect(Expression.parse("2*2^8").result).toBe(512);
    });
    it("should parse negation", function() {
      expect(Expression.parse("2^-(2*-2)+-5").result).toBe(11);
    });
```

<!--
#### 4. Implement an Abstract Descent Parser generator (HARD!)

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
-->

### Running static code analysis and unit tests

1. Change to the project's root directory
2. Install project dependencies with `npm install`
3. Run `grunt`

#### Requisites

1. [Node.js](https://nodejs.org/) version >= 0.8.0
2. Grunt CLI (install with `npm install -g grunt-cli`)
