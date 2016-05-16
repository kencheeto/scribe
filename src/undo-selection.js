define([], function () {

var UndoSelection = function(scribe) {
  this.scribe = scribe;
};

UndoSelection.prototype.placeMarkers = function() {
  var editor = this.scribe.el;
  var sel    = new this.scribe.api.Selection();
  var range  = sel.range;

  if (!range) return;

  var startContainer = range.startContainer;
  var endContainer   = range.endContainer;
  var startOffset    = range.startOffset;
  var endOffset      = range.endOffset;

  var startRangeRef;
  var endRangeRef;
  var rStart = {};
  var rEnd = {};

  if (startContainer.nodeType === Node.TEXT_NODE) {
    startRangeRef = findFirstElementSibling(startContainer);
    if (startRangeRef) {
      rStart.startRangeRef = "sibling";
    } else {
      startRangeRef = startContainer.parentNode;
      rStart.startRangeRef = "parent";
    }
    rStart.rangeStartType = "text";
    rStart.startOffset = findTextNodeOffset(startContainer, startOffset);
  } else {
    startRangeRef = startContainer;
    rStart.rangeStartType = "element";
    rStart.startOffset = startOffset;
  }

  if (endContainer.nodeType === Node.TEXT_NODE) {
    endRangeRef = findFirstElementSibling(endContainer);
    if (endRangeRef) {
      rEnd.endRangeRef = "sibling";
    } else {
      endRangeRef = endContainer.parentNode;
      rEnd.endRangeRef = "parent";
    }
    rEnd.endStartType = "text";
    rEnd.endOffset = findTextNodeOffset(endContainer, endOffset);
  } else {
    endRangeRef = endContainer;
    rEnd.rangeEndType = "element";
    rEnd.endOffset = endOffset;
  }

  if (startRangeRef !== editor) {
    startRangeRef.setAttribute('data-selection-start', JSON.stringify(rStart));
  }
  if (endRangeRef !== editor) {
    endRangeRef.setAttribute('data-selection-end', JSON.stringify(rEnd));
  }
};

UndoSelection.prototype.removeMarkers = function() {
  var editor = this.scribe.el;
  var startMarker = editor.querySelector("[data-selection-start]");
  var endMarker   = editor.querySelector("[data-selection-end]");

  startMarker && startMarker.removeAttribute('data-selection-start');
  endMarker   && endMarker.removeAttribute('data-selection-end');
};


UndoSelection.prototype.selectMarkers = function() {
  var rStart;
  var rEnd;
  var editor = this.scribe.el;

  var startMarker = editor.querySelector("[data-selection-start]");
  if (startMarker) {
    rStart = JSON.parse(startMarker.getAttribute('data-selection-start'));
  }
  var endMarker = editor.querySelector("[data-selection-end]");
  if (endMarker) {
    rEnd = JSON.parse(endMarker.getAttribute('data-selection-end'));
  }

  var range = document.createRange();
  try {
    if (rStart.rangeStartType === 'element') {
      range.setStart(startMarker, rStart.startOffset);
    } else {
      if (rStart.startRangeRef === 'sibling') {
        range.setStart(startMarker.nextSibling, rStart.startOffset);
      } else {
        range.setStart(startMarker.firstChild || startMarker, rStart.startOffset);
      }
    }
    if (rEnd.rangeStartType === 'element') {
      range.setEnd(endMarker, rEnd.endOffset);
    } else {
      if (rStart.startRangeRef === 'sibling') {
        range.setEnd(endMarker.nextSibling, rEnd.endOffset);
      } else {
        range.setEnd(endMarker.firstChild || endMarker, rEnd.endOffset);
      }
    }
    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  } catch (e) {
    // creating a range failed.
  }
  this.removeMarkers();
};

return UndoSelection;
});
