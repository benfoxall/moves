"use strict";

var distance = function distance(_) {
    return Math.sqrt(_.map(function (x) {
        return x * x;
    }).reduce(function (a, b) {
        return a + b;
    }, 0));
};