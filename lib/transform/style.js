"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

var _postcss = _interopRequireDefault(require("postcss"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var transformPlugin = _postcss["default"].plugin('transformRpx2Px', function () {
  return function (root) {
    root.walkRules(function (rule) {
      rule.walkDecls(function (decl) {
        var value = decl.value;

        if (value && value.toLowerCase().indexOf('px') > -1) {
          decl.value = value.replace(/r?[pP][xX]/g, function (target) {
            if (target === 'px' || target === 'rpx') return 'rpx';
            return 'px';
          });
        }
      });
    });
  };
});

function _default(content) {
  var next = this.async();
  (0, _postcss["default"])(transformPlugin).process(content).then(function (result) {
    next(null, result.css);
  });
}

module.exports = exports.default;