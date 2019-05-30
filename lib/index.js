"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

var _loaderUtils = _interopRequireDefault(require("loader-utils"));

var _path = require("path");

var _parser = _interopRequireDefault(require("./parser"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _default(content) {
  var next = this.async();
  var context = this;
  var sourceRelativePath = (0, _path.dirname)((0, _path.relative)(context.rootContext, context.resourcePath));
  var outputPath = sourceRelativePath === '.' ? '' : sourceRelativePath.replace(/^[^/]+/g, '');
  var output = '';

  function getLoadersBang(loaders) {
    return loaders.length ? loaders.join('!') + '!' : '';
  }

  function getLangLoader(lang) {
    return lang ? [lang + '-loader'] : [];
  }

  function getRequirePath(type, loaders, target) {
    var targetPath = target ? (0, _path.resolve)((0, _path.dirname)(context.resourcePath), target) : "".concat(__dirname, "/selector.js?type=").concat(type, "!").concat(context.resourcePath);

    var requestPath = _loaderUtils["default"].stringifyRequest(context, "!!".concat(getLoadersBang(loaders)).concat(targetPath));

    return "require(".concat(requestPath, ");\n");
  }

  (0, _parser["default"])(content).then(function (parts) {
    if (parts.config) {
      output += getRequirePath('config', ["file-loader?name=[name].json&outputPath=".concat(outputPath)]);
    }

    if (parts.template) {
      output += getRequirePath('template', ["file-loader?name=[name].axml&outputPath=".concat(outputPath)]);
    }

    if (parts.style) {
      output += getRequirePath('style', ["file-loader?name=[name].acss&outputPath=".concat(outputPath), "".concat(__dirname, "/transform/style.js")].concat(_toConsumableArray(getLangLoader(parts.style.attrs.lang))), parts.style.attrs.src);
    }

    output += getRequirePath('script', ['babel-loader'].concat(_toConsumableArray(getLangLoader(parts.script.attrs.lang))), parts.script.attrs.src);
    next(null, output);
  });
}

module.exports = exports.default;