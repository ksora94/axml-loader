import loaderUtils from 'loader-utils';
import parse from './parser';

export default function (content) {
  const next = this.async();
  const context = this;
  const option = loaderUtils.getOptions(context);

  parse(content)
      .then(parts => {
        next(
            null,
            parts[option.type] ? parts[option.type].content.trim() : ''
        );
      });
}
