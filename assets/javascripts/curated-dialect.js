(function() {
  function replaceExcerpt (text) {
    while (text != (text = text.replace(/\[excerpt\]([\s\S]*)\[\/excerpt\]/ig, function (match, p1, offset, string) {
      return "<div class='curated-excerpt'>" + p1 + "</div>";
    })));
    return text;
  }

  Discourse.Dialect.addPreProcessor(replaceExcerpt);
  Discourse.Markdown.whiteListTag('div', 'class', 'curated-excerpt');
})();