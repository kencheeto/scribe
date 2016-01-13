define(['./dom_shims', './weak_map', './mutation_observer'], function (domShims, WeakMap, MutationObserver) {

  'use strict';

  return function() {
    domShims();
    WeakMap();
    MutationObserver();
  };
});
