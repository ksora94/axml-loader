"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var attrHandlers = {
  'a-if': {
    to: 'a:if',
    handler: transformDataBinding
  },
  'a-else': {
    to: 'a:else',
    handler: transformDataBinding
  },
  'a-else-if': {
    to: 'a:elif',
    handler: transformDataBinding
  },
  'a-for': {
    to: 'a:for',
    handler: transformListRendering
  },
  'a-key': {
    to: 'a:key',
    handler: function handler(value) {
      return value;
    }
  }
};

function hasKey(attrs) {
  return !!(attrs['key'] || attrs[':key'] || attrs['a-key'] || attrs['a:key']);
}

function isDataBinding(attrName) {
  return /^:[\w-]+$/.test(attrName);
}

function transformDataBinding(value) {
  if (!value) {
    throw new Error("wrong syntax in template: wrong data binding");
  }

  return '{{' + value + '}}';
}

function transformListRendering(value, attrs) {
  var found = value.match(/^\s*((\w+)|\(\s*(\w+)\s*(?:,\s*(\w+)\s*)?\))\s+in\s+(\w+)\s*$/);
  var _attrs = {};

  if (found) {
    var item = found[2] || found[3];
    var index = found[4];
    _attrs['a:for'] = transformDataBinding(found[5]);
    if (item) _attrs['a:for-item'] = item;
    if (index) _attrs['a:for-index'] = index;
    if (!hasKey(attrs)) _attrs['a:key'] = '*this';
    return _attrs;
  } else {
    throw new Error("wrong syntax in template: a-for = \"".concat(value, "\""));
  }
}

function transformAttrs(attrs) {
  var _attrs = {};

  for (var a in attrs) {
    if (attrs.hasOwnProperty(a)) {
      var value = attrs[a];

      if (attrHandlers[a]) {
        var result = attrHandlers[a].handler(value, attrs);

        if (typeof result === 'string') {
          _attrs[attrHandlers[a].to] = value;
        } else if (_typeof(result) === 'object') {
          for (var attrName in result) {
            if (result.hasOwnProperty(attrName)) _attrs[attrName] = result[attrName];
          }
        }
      } else if (isDataBinding(a)) {
        _attrs[a.slice(1)] = transformDataBinding(value);
      } else {
        _attrs[a] = value;
      }
    }
  }

  return _attrs;
}

function traversal(ast, handler) {
  var children = ast.children;

  if (children && children.length) {
    for (var i = 0; i < children.length; i++) {
      children[i] = handler(children[i]);
      traversal(children[i], handler);
    }
  }
}

function _default(ast) {
  traversal(ast, function (node) {
    if (node.attribs) node.attribs = transformAttrs(node.attribs);
    return node;
  });
  return ast;
}

module.exports = exports.default;