import htmlparser from 'htmlparser2';
import transformTemplate from './transform/template';

export default function (content) {
  const output = {
    template: null,
    config: null,
    style: null,
    script: {
      attrs: {},
      content: ''
    }
  };
  return new Promise((resolve, reject) => {
    const handler = new htmlparser.DomHandler(function (error, ast) {
      if (error) {
        reject(error);
      } else {
        ast.forEach(function (node) {
          let {name, children = [], attribs = {}} = node;

          if (output.hasOwnProperty(name)) {
            if (name === 'script' && attribs.type === 'application/json') name = 'config';

            output[name] = {
              attrs: attribs,
              content: ''
            };
            if (name === 'template') {
              output.template.content =
                  htmlparser.DomUtils.getInnerHTML(transformTemplate(node));
            } else if (name === 'config') {
              output.config.content =
                  children.length ? children[0].data : '{}';
            } else {
              output[name].content =
                  children.length ? children[0].data : '';
            }
          }

        });

        resolve(output);
      }
    });
    const parser = new htmlparser.Parser(handler, {
      lowerCaseAttributeNames: false,
      recognizeSelfClosing: true
    });

    parser.write(content);
    parser.end();
  });
}
