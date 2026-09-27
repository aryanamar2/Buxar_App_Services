/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// If the loader is already loaded, just stop.
if (!self.define) {
  let registry = {};

  // Used for `eval` and `importScripts` where we can't get script URL by other means.
  // In both cases, it's safe to use a global var because those functions are synchronous.
  let nextDefineUri;

  const singleRequire = (uri, parentUri) => {
    uri = new URL(uri + ".js", parentUri).href;
    return registry[uri] || (
      
        new Promise(resolve => {
          if ("document" in self) {
            const script = document.createElement("script");
            script.src = uri;
            script.onload = resolve;
            document.head.appendChild(script);
          } else {
            nextDefineUri = uri;
            importScripts(uri);
            resolve();
          }
        })
      
      .then(() => {
        let promise = registry[uri];
        if (!promise) {
          throw new Error(`Module ${uri} didn’t register its module`);
        }
        return promise;
      })
    );
  };

  self.define = (depsNames, factory) => {
    const uri = nextDefineUri || ("document" in self ? document.currentScript.src : "") || location.href;
    if (registry[uri]) {
      // Module is already loading or loaded.
      return;
    }
    let exports = {};
    const require = depUri => singleRequire(depUri, uri);
    const specialDeps = {
      module: { uri },
      exports,
      require
    };
    registry[uri] = Promise.all(depsNames.map(
      depName => specialDeps[depName] || require(depName)
    )).then(deps => {
      factory(...deps);
      return exports;
    });
  };
}
define(['./workbox-7e5eb42b'], (function (workbox) { 'use strict';

  self.skipWaiting();
  workbox.clientsClaim();
  /**
   * The precacheAndRoute() method efficiently caches and responds to
   * requests for URLs in the manifest.
   * See https://goo.gl/S9QRab
   */
  workbox.precacheAndRoute([{
    "url": "registerSW.js",
    "revision": "1872c500de691dce40960bb85481de07"
  }, {
    "url": "index.html",
    "revision": "8136530fe8ec850f4b1f5d304bf1ba3e"
  }, {
    "url": "assets/index-DDlq1EGD.js",
    "revision": null
  }, {
    "url": "assets/index-CvodAfFT.css",
    "revision": null
  }, {
    "url": "apple-touch-icon.png",
    "revision": "ab24be551f1983b56668beb7b8eb6bdc"
  }, {
    "url": "favicon.ico",
    "revision": "b13e092f4f1f68c4c7f137829af8d1ab"
  }, {
    "url": "icon.svg",
    "revision": "fe1723de47262706fe5e6263eb928196"
  }, {
    "url": "pwa-192x192.png",
    "revision": "c6cc94c686ae01735c4d3ab0e9ec33aa"
  }, {
    "url": "pwa-512x512.png",
    "revision": "cea89cf01aa584c2c876126aff58bd5e"
  }, {
    "url": "pwa-maskable-192x192.png",
    "revision": "c6cc94c686ae01735c4d3ab0e9ec33aa"
  }, {
    "url": "pwa-maskable-512x512.png",
    "revision": "cea89cf01aa584c2c876126aff58bd5e"
  }, {
    "url": "manifest.webmanifest",
    "revision": "7b1795de5c163986815000cdb081942d"
  }], {});
  workbox.cleanupOutdatedCaches();
  workbox.registerRoute(new workbox.NavigationRoute(workbox.createHandlerBoundToURL("index.html")));

}));
