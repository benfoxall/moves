"use strict";

var distance = function distance(_) {
  return Math.sqrt(_.map(function (x) {
    return x * x;
  }).reduce(function (a, b) {
    return a + b;
  }, 0));
};

var colour = function colour(i) {
  return "rgb(" + Math.floor(i * 255) + ", " + Math.floor((1 - i) * 255) + ", 0)";
};

var wrap = function wrap(e) {
  return {
    alpha: Math.sin(Math.PI * (e.alpha / 360)),
    beta: Math.sin(Math.PI * (e.beta / 360)),
    gamma: Math.sin(Math.PI * (e.gamma / 180))
  };
};