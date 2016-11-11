// tick this to make the cache invalidate and update
const CACHE_VERSION = 2;
const CURRENT_CACHES = {
  prefetch: 'prefetch-cache-v' + CACHE_VERSION,
  read: 'read-through-cache-v' + CACHE_VERSION
};

var urlsToPrefetch = [
  './',
  'build/main.css',
  'build/main.js',
  'build/main.js.map',
  'build/polyfills.js',

  'assets/fonts/ionicons.eot',
  'assets/fonts/ionicons.svg',
  'assets/fonts/ionicons.ttf',
  'assets/fonts/ionicons.woff',
  'assets/fonts/ionicons.woff2',

  // The videos are stored remotely with CORS enabled.
  'https://firebasestorage.googleapis.com/v0/b/telavivo-8884f.appspot.com/o/srutim.webm?alt=media&token=e10a5ef9-7ae0-4a7f-958f-238a26815389',
  'https://firebasestorage.googleapis.com/v0/b/telavivo-8884f.appspot.com/o/Srutim.mp4?alt=media&token=c421c819-ff3a-4e52-8748-cfb56a9f2cac'
];

self.addEventListener('install', function(event) {

  event.waitUntil(
    caches.open(CURRENT_CACHES.prefetch).then(function(cache) {
      return cache.addAll(urlsToPrefetch);
    })
  );

});

self.addEventListener('activate', (event) => {
  // Delete all caches that aren't named in CURRENT_CACHES.
  // While there is only one cache in this example, the same logic will handle the case where
  // there are multiple versioned caches.
  const expectedCacheNames = Object.keys(CURRENT_CACHES).map((key) => {
    return CURRENT_CACHES[key];
  });

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (expectedCacheNames.indexOf(cacheName) === -1) {
            // If this cache name isn't present in the array of "expected" cache names, then delete it.
            console.log('Deleting out of date cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});


self.addEventListener('fetch', (event) => {

  if (event.request.headers.get('range')){
    var pos = Number(/^bytes\=(\d+)\-$/g.exec(event.request.headers.get('range'))[1]);
    console.log('Range request for', event.request.url,
      ', starting position:', pos);
    event.respondWith(
      caches.open(CURRENT_CACHES.prefetch)
        .then(function(cache) {
          return cache.match(event.request.url);
        }).then(function(res) {
        if (!res) {
          return fetch(event.request)
            .then((res)=>{
              return res.arrayBuffer();
            });
        }
        return res.arrayBuffer();

      }).then(function(ab) {
        return new Response(
          ab.slice(pos),
          {
            status: 206,
            statusText: 'Partial Content',
            headers: [
              ['Content-Range', 'bytes ' + pos + '-' +
              (ab.byteLength - 1) + '/' + ab.byteLength]]
          });
      }));
  } else {

    event.respondWith(
       caches.match(event.request)
         .then(function(response) {
            if(response){
              console.log('Found response in cache: ', response);
              return response;
            }

            console.log('No Response Found In Cache. Fetching From Network: ', event.request);
            return fetch(event.request)
              .then(function(response){
                console.log('Response From Network Is: ', response);
                caches.open(CURRENT_CACHES.read)
                  .then(function(cache){
                    cache.put(event.request, response.clone());
                    return response;
                  });

              }).catch(function(error) {
                console.error('Fetching Failed:', error);
                throw error;
            });

         })

    );

  }

});
