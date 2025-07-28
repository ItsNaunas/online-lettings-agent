const CACHE_NAME = 'ola-images-v1';
const IMAGE_CACHE_NAME = 'ola-images-cache-v1';

// Cache strategy for images
self.addEventListener('fetch', event => {
    // Only handle image requests
    if (event.request.destination === 'image') {
        event.respondWith(
            caches.open(IMAGE_CACHE_NAME).then(cache => {
                return cache.match(event.request).then(response => {
                    if (response) {
                        // Return cached image
                        return response;
                    }
                    
                    // Fetch and cache the image
                    return fetch(event.request).then(fetchResponse => {
                        if (fetchResponse.ok) {
                            cache.put(event.request, fetchResponse.clone());
                        }
                        return fetchResponse;
                    }).catch(() => {
                        // Return a fallback image if network fails
                        return new Response(
                            '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="300" height="200" fill="#f0f0f0"/><text x="150" y="100" text-anchor="middle" fill="#999" font-family="Arial" font-size="14">Image unavailable</text></svg>',
                            { headers: { 'Content-Type': 'image/svg+xml' } }
                        );
                    });
                });
            })
        );
    }
});

// Clean up old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME && cacheName !== IMAGE_CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});