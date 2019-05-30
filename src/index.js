import loaderUtils from 'loader-utils';
import {relative, dirname, resolve} from 'path';
import parse from './parser'

export default function (content) {
  const next = this.async();
  const context = this;
  const sourceRelativePath = dirname(relative(context.rootContext, context.resourcePath));
  const outputPath = sourceRelativePath === '.' ?
      '' : sourceRelativePath.replace(/^[^/]+/g, '');
  let output = '';

  function getLoadersBang(loaders) {
    return loaders.length ? loaders.join('!') + '!' : '';
  }

  function getLangLoader(lang) {
    return lang ? [lang + '-loader'] : []
  }

  function getRequirePath(type, loaders, target) {
    const targetPath = target ?
        resolve(dirname(context.resourcePath), target)
        :
        `${__dirname}/selector.js?type=${type}!${context.resourcePath}`;
    const requestPath = loaderUtils.stringifyRequest(
        context,
        `!!${getLoadersBang(loaders)}${targetPath}`
    );

    return `require(${requestPath});\n`
  }

  parse(content)
      .then(parts => {
        if (parts.config) {
          output += getRequirePath(
              'config',
              [
                `file-loader?name=[name].json&outputPath=${outputPath}`
              ]
          )
        }
        if (parts.template) {
          output += getRequirePath(
              'template',
              [
                `file-loader?name=[name].axml&outputPath=${outputPath}`
              ]
          );
        }
        if (parts.style) {
          output += getRequirePath(
              'style',
              [
                `file-loader?name=[name].acss&outputPath=${outputPath}`,
                `${__dirname}/transform/style.js`,
                ...getLangLoader(parts.style.attrs.lang)
              ],
              parts.style.attrs.src
          );
        }
        output += getRequirePath(
            'script',
            [
              'babel-loader',
              ...getLangLoader(parts.script.attrs.lang)
            ],
            parts.script.attrs.src
        );

        next(null, output)
      });
}
