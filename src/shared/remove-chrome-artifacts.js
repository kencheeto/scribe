define([
  './element'
], function (elementHelpers) {
  function isInline(parentStyle, element) {
    return elementHelpers.isInlineElement(element) &&
      element.style.lineHeight === parentStyle.lineHeight ?
      NodeFilter.FILTER_ACCEPT :
      NodeFilter.FILTER_SKIP;
  }

  /**
   * Chrome: If a parent node has a CSS `line-height` when we apply the
   * insertHTML command, Chrome appends a SPAN to plain content with
   * inline styling replicating that `line-height`, and adjusts the
   * `line-height` on inline elements.
   *
   * As per: http://jsbin.com/ilEmudi/4/edit?css,js,output
   * More from the web: http://stackoverflow.com/q/15015019/40352
   */
  function removeChromeArtifacts(parentElement) {
    var iterator = document.createNodeIterator(
      parentElement,
      NodeFilter.SHOW_ELEMENT,
      isInline.bind(null, window.getComputedStyle(parentElement))
    );
    var emptySpans = [];
    var node;

    while (node = iterator.nextNode()) {
      node.style.lineHeight = null;
      if (node.getAttribute('style') === '') {
        node.removeAttribute('style');
      }
      if (node.nodeName === 'SPAN' && node.attributes.length === 0) {
        emptySpans.push(node);
      }
    }

    while (!!emptySpans.length) {
      elementHelpers.unwrap(parentElement, emptySpans.pop());
    }
  }

  return removeChromeArtifacts;
});
