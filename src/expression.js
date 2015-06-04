var Expression = Expression || {};

Expression.match = function(input) {
  var index = 0;

  // s : 'a'  ==>  var s = function() { return char('a'); };
  var char = function(expected) {
    return index < input.length && input.charAt(index++) === expected;
  };
  // s : /[0-9]+/  ==>  var s = function() { return regExp(/[0-9]+/); };
  var regExp = function(regexp) {
    var match;
    if (index < input.length &&
          (match = regexp.exec(input.substr(index))) && match.index === 0) {
      index += match[0].length;
      return true;
    }
    return false;
  };

  // expr : term (('+' | '-') term)*
  var expr = function() {
  };

  // term : factor (('*' | '/') factor)*
  var term = function() {
  };

  // factor : number | '(' expr ')'
  var factor = function() {
  };

  return input;
};
