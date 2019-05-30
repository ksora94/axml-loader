import postcss from 'postcss';

const transformPlugin = postcss.plugin('transformRpx2Px', () => root => {
  root.walkRules(rule => {
    rule.walkDecls(decl => {
      const value = decl.value;

      if (value && value.toLowerCase().indexOf('px') > -1) {
        decl.value = value.replace(/r?[pP][xX]/g, target => {
          if (target === 'px' || target === 'rpx') return 'rpx';
          return 'px';
        })
      }
    });
  });
});

export default function (content) {
  const next = this.async();

  postcss(transformPlugin).process(content)
      .then(result => {
        next(null, result.css)
      });
}
