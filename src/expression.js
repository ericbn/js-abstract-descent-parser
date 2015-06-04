var Expression = Expression || {};

Expression.parse = function(input) {
  var index = 0;

  // s : 'a'  ==>  var s = function() { return char('a'); };
  var char = function(expected) {
    var c;
    return (index < input.length && (c = input.charAt(index++)) === expected) ? c : null;
  };
  // s : /[0-9]+/  ==>  var s = function() { return regExp(/[0-9]+/); };
  var regExp = function(regexp) {
    var match;
    if (index < input.length &&
          (match = regexp.exec(input.substr(index))) && match.index === 0) {
      index += match[0].length;
      return match[0];
    }
    return null;
  };

  // s : s1 | s2  ==>  var s = function() { return firstOf(s1, s2); };
  var firstOf = function() {
    var backtrack = index;
    for (var len = arguments.length, i = 0; i < len; i++){
      var val = arguments[i]();
      if (val) { return val; }
      index = backtrack;
    }
    return null;
  };
  // s : t*  ==>  s : s';  s' : t s' | empty  ==>  var s = function() { return zeroOrMore(t); };
  var zeroOrMore = function(func) {
    for (;;) {
      var backtrack = index;
      if (!func()) { index = backtrack; return true; }
    }
  };

  // expr : term (('+' | '-') term)*
  var expr = function() {
    var leftVal;
    return ((leftVal = term()) && zeroOrMore(function() {
      var op, rightVal;
      if ((op = regExp(/[+-]/)) && (rightVal = term())) {
        switch (op) {
        case '+':
          leftVal += rightVal;
          break;
        case '-':
          leftVal -= rightVal;
          break;
        }
        return true;
      }
      return false;
    })) ? truthyNumber(leftVal) : null;
  };

  // term : factor (('*' | '/') factor)*
  var term = function() {
    var leftVal;
    return ((leftVal = factor()) && zeroOrMore(function() {
      var op, rightVal;
      if ((op = regExp(/[*\/]/)) && (rightVal = factor())) {
        switch (op) {
        case '*':
          leftVal *= rightVal;
          break;
        case '/':
          leftVal /= rightVal;
          break;
        }
        return true;
      }
      return false;
    })) ? truthyNumber(leftVal) : null;
  };

  // factor : number | '(' expr ')'
  var factor = function() {
    return firstOf(factor1, factor2);
  };
  var factor1 = function() {
    return number();
  };
  var factor2 = function() {
    var val;
    return (char('(') && (val = expr()) && char(')')) ? val : null;
  };

  // number : /\d+(?:\.\d+)?/
  var number = function() {
    var str = regExp(/\d+(?:\.\d+)?/);
    return str ? truthyNumber(parseFloat(str)) : null;
  };
  var truthyNumber = function(val) {
    // forcing new Number() so 0 won't be evaluated as falsy
    return val || new Number(0);
  };

  var result = expr();
  return result ? { result: result, match: input.slice(0, index) } : null;
};

Expression.match = function(input) {
  var parsed = Expression.parse(input);
  return parsed ? parsed.match : null;
};
