describe("Expression", function() {
  describe("match", function() {
    it("should match integer", function() {
      var input = "144(";
      expect(Expression.match(input)).toBe(input.slice(0, -1));
    });
    it("should match float", function() {
      var input = "1.618*";
      expect(Expression.match(input)).toBe(input.slice(0, -1));
    });
    it("should match resulting zero", function() {
      var input = "13-13/.";
      expect(Expression.match(input)).toBe(input.slice(0, -2));
    });
    it("should match starting with zero", function() {
      var input = "0-5+(";
      expect(Expression.match(input)).toBe(input.slice(0, -2));
    });
    it("should match containing zero", function() {
      var input = "13+0*1/)";
      expect(Expression.match(input)).toBe(input.slice(0, -2));
    });
    it("should match multiplication", function() {
      var input = "1+2*3-((";
      expect(Expression.match(input)).toBe(input.slice(0, -3));
    });
    it("should match sequence of operations", function() {
      var input = "2*3*5***";
      expect(Expression.match(input)).toBe(input.slice(0, -3));
    });
    it("should match parenthesis", function() {
      var input = "(5+8)/13-(+)";
      expect(Expression.match(input)).toBe(input.slice(0, -4));
    });
    it("should match fully parenthesized", function() {
      var input = "(5-(2*3))+(((";
      expect(Expression.match(input)).toBe(input.slice(0, -4));
    });
  });
  describe("parse", function() {
    it("should parse integer", function() {
      expect(Expression.parse("144").result).toBe(144);
    });
    it("should parse float", function() {
      expect(Expression.parse("1.618").result).toBe(1.618);
    });
    it("should parse resulting zero", function() {
      expect(Expression.parse("13-13").result).toBe(0);
    });
    it("should parse starting with zero", function() {
      expect(Expression.parse("0-5").result).toBe(-5);
    });
    it("should parse containing zero", function() {
      expect(Expression.parse("13+0*1").result).toBe(13);
    });
    it("should parse multiplication with higher precedence", function() {
      expect(Expression.parse("1+2*3").result).toBe(7);
    });
    it("should parse sequence of operations", function() {
      expect(Expression.parse("2*3*5").result).toBe(30);
    });
    it("should parse parenthesis", function() {
      expect(Expression.parse("(5+8)/13").result).toBe(1);
    });
    it("should parse fully parenthesized", function() {
      expect(Expression.parse("(5-(2*3))").result).toBe(-1);
    });
    xit("should parse exponentiation", function() {
      expect(Expression.parse("2*2^8").result).toBe(512);
    });
    xit("should parse negation", function() {
      expect(Expression.parse("2^-(2*-2)+-5").result).toBe(11);
    });    
  });
  xdescribe("compile", function() {
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
    xit("should compile and compute result with given variable", function() {
      var ast = Expression.compile("2+x");
      expect(ast.result({ x: 1 })).toBe(3);
      expect(ast.result({ x: 2 })).toBe(4);
    });
    xit("should compile and compute with variable appearing more than once", function() {
      var ast = Expression.compile("x+x*x/2");
      expect(ast.result({ x: 4 })).toBe(12);
      expect(ast.result({ x: 8 })).toBe(40);
    });
    xit("should compile and compute with more than one variable", function() {
      var ast = Expression.compile("2584/y-x/3");
      expect(ast.result({ x: 9, y: 4 })).toBe(643);
      expect(ast.result({ x: 144, y: 34 })).toBe(28);
    });
  });
});
