(function() {
  function replaceExcerpt (text) {
    while (text != (text = text.replace(/\[excerpt\](.*)\[\/excerpt\]/ig, function (match, p1, offset, string) {
      //return "<span class='curated-excerpt'>" + p1 + "</span>";
      return "<div class='curated-excerpt'>" + p1 + "</div>";
    })));
    return text;
  }

  Discourse.Dialect.addPreProcessor(replaceExcerpt);
  //Discourse.Markdown.whiteListTag('span', 'class', /^curated-excerpt$/);
  Discourse.Markdown.whiteListTag('div', 'class', 'curated-excerpt');
})();