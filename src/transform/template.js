const attrHandlers = {
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
    handler: value => value
  }
};

function hasKey(attrs) {
  return !!(attrs['key'] || attrs[':key'] || attrs['a-key'] || attrs['a:key'])
}

function isDataBinding(attrName) {
  return /^:[\w-]+$/.test(attrName);
}

function transformDataBinding(value) {
  if (!value) {
    throw new Error(`wrong syntax in template: wrong data binding`);
  }
  return '{{' + value + '}}';
}

function transformListRendering(value, attrs) {
  const found = value.match(/^\s*((\w+)|\(\s*(\w+)\s*(?:,\s*(\w+)\s*)?\))\s+in\s+(\w+)\s*$/);
  const _attrs = {};

  if (found) {
    const item = found[2] || found[3];
    const index = found[4];

    _attrs['a:for'] = transformDataBinding(found[5]);
    if (item) _attrs['a:for-item'] = item;
    if (index) _attrs['a:for-index'] = index;
    if (!hasKey(attrs)) _attrs['a:key'] = '*this';

    return _attrs;
  } else {
    throw new Error(`wrong syntax in template: a-for = "${value}"`);
  }

}

function transformAttrs(attrs) {
  const _attrs = {};

  for (let a in attrs) {
    if (attrs.hasOwnProperty(a)) {
      const value = attrs[a];
      if (attrHandlers[a]) {
        const result = attrHandlers[a].handler(value, attrs);

        if (typeof result === 'string') {
          _attrs[attrHandlers[a].to] = value;
        } else if (typeof result === 'object'){
          for (let attrName in result) {
            if (result.hasOwnProperty(attrName)) _attrs[attrName] = result[attrName]
          }
        }
      } else if (isDataBinding(a)) {
        _attrs[a.slice(1)] = transformDataBinding(value);
      }
      else {
        _attrs[a] = value;
      }
    }
  }

  return _attrs;
}

function traversal(ast, handler) {
  const children = ast.children;
  if (children && children.length) {
    for (let i = 0; i < children.length; i++) {
      children[i] = handler(children[i]);
      traversal(children[i], handler);
    }
  }
}

export default function (ast) {
  traversal(ast, node => {
    if (node.attribs) node.attribs = transformAttrs(node.attribs);

    return node;
  });

  return ast
}
