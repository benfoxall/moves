"use strict";

var distance = function distance(_) {
  return Math.sqrt(_.map(function (x) {
    return x * x;
  }).reduce(function (a, b) {
    return a + b;
  }, 0));
};

var colour = function colour(i) {
  var a = arguments.length <= 1 || arguments[1] === undefined ? 1 : arguments[1];
  return "rgba(" + Math.floor(i * 255) + ", " + Math.floor((1 - i) * 255) + ", 0, " + a + ")";
};

var wrap = function wrap(e) {
  return {
    alpha: Math.sin(Math.PI * (e.alpha / 360)),
    beta: Math.sin(Math.PI * (e.beta / 360)),
    gamma: Math.sin(Math.PI * (e.gamma / 180))
  };
};