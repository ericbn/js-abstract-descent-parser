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
  xdescribe("parse", function() {
    it("should parse integer", function() {
      expect(Expression.parse("144").result).toBe(144);
    });
    it("should parse float", function() {
      expect(Expression.parse("1.618").result).toBe(1.618);
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
  });
});
