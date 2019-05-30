"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

var _loaderUtils = _interopRequireDefault(require("loader-utils"));

var _parser = _interopRequireDefault(require("./parser"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _default(content) {
  var next = this.async();
  var context = this;

  var option = _loaderUtils["default"].getOptions(context);

  (0, _parser["default"])(content).then(function (parts) {
    next(null, parts[option.type] ? parts[option.type].content.trim() : '');
  });
}

module.exports = exports.default;