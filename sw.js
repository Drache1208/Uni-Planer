var CACHE = "uni-planer-20261022221509";
var SHELL = ["./Uni-Planer-Online.html", "./manifest.json", "./icon-180.png", "./icon-512.png"];
self.addEventListener("install", function(e){
  e.waitUntil(
    caches.open(CACHE)
      .then(function(c){ return c.addAll(SHELL); })
      .catch(function(){})
      .then(function(){ return self.skipWaiting(); })
  );
});
self.addEventListener("activate", function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.map(function(k){ if (k !== CACHE) return caches.delete(k); }));
    }).then(function(){ return self.clients.claim(); })
  );
});
self.addEventListener("fetch", function(e){
  var req = e.request;
  if (req.method !== "GET") return;
  var url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  e.respondWith(
    caches.match(req, { ignoreSearch: true }).then(function(hit){
      var net = fetch(req).then(function(res){
        if (res && res.ok){
          var cp = res.clone();
          caches.open(CACHE).then(function(c){ c.put(req, cp); });
        }
        return res;
      }).catch(function(){ return hit; });
      if (hit){ net.catch(function(){}); return hit; }
      return net;
    })
  );
});
