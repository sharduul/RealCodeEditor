var PI = 3.14; // PI will not be accessible from outside this module

exports.area = function (r) {
  return PI * r * r;
};

exports.circumference = function (r) {
  return 2 * PI * r;
};