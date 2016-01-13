define(['./dom_shims', './weak_map', './mutation_observer'],
  'use strict';

  function (domShims, WeakMap, MutationObserver) {
    return function() {
      domShims();
      WeakMap();
      MutationObserver();
    };
  }
);
