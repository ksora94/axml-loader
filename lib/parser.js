"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

var _htmlparser = _interopRequireDefault(require("htmlparser2"));

var _template = _interopRequireDefault(require("./transform/template"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _default(content) {
  var output = {
    template: null,
    config: null,
    style: null,
    script: {
      attrs: {},
      content: ''
    }
  };
  return new Promise(function (resolve, reject) {
    var handler = new _htmlparser["default"].DomHandler(function (error, ast) {
      if (error) {
        reject(error);
      } else {
        ast.forEach(function (node) {
          var name = node.name,
              _node$children = node.children,
              children = _node$children === void 0 ? [] : _node$children,
              _node$attribs = node.attribs,
              attribs = _node$attribs === void 0 ? {} : _node$attribs;

          if (output.hasOwnProperty(name)) {
            if (name === 'script' && attribs.type === 'application/json') name = 'config';
            output[name] = {
              attrs: attribs,
              content: ''
            };

            if (name === 'template') {
              output.template.content = _htmlparser["default"].DomUtils.getInnerHTML((0, _template["default"])(node));
            } else if (name === 'config') {
              output.config.content = children.length ? children[0].data : '{}';
            } else {
              output[name].content = children.length ? children[0].data : '';
            }
          }
        });
        resolve(output);
      }
    });
    var parser = new _htmlparser["default"].Parser(handler, {
      lowerCaseAttributeNames: false,
      recognizeSelfClosing: true
    });
    parser.write(content);
    parser.end();
  });
}

module.exports = exports.default;