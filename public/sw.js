const CacheKey = "cache-3";

// const STATIC_ASSETS = [
//     "/src/App.vue",
//     "/src/assets/css/__index.css ",
//     "/src/main.ts",
//     "/node_modules/element-plus/theme-chalk/dark/css-vars.css",
//     "/favicon.ico",
//     "/@vite/client",
//     "/node_modules/element-plus/dist/index.css",
//     "/src/router/index.ts",
//     "/src/stores/globalStore.ts",
//     "/src/components/LeftMenu.vue",
//     "/src/components/HeadMenu.vue",
//     "/src/stores/_g_axios.ts",
//     "/src/utils/globalConstants.ts",
//     "/src/assets/icons/ic-directions-car-black-18-px.png?import",
//     "/src/assets/icons/ic-home-black-18-px.png?import",
//     "/src/assets/icons/icon-face.png?import",
//     "/src/assets/icons/icon-face.png",
//     "/src/assets/img/hamburger.png",
//     "/src/assets/img/right-toggle-arrow.png"
// ]

// to В будущем нужно будет только часть страниц кешировать, чтобы не забивать память пользователя


const tryNetwork = (req, timeout) => {
    if (!navigator.onLine) return false
    if (req.url.includes('api')) return false

    // тут кешируем все полученные данные, но игнорируем обращения к серверу по апи
    return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(reject, timeout);
        fetch && fetch(req).then((res) => {
            clearTimeout(timeoutId);
            const responseClone = res.clone();
            caches.open(CacheKey).then((cache) => {
                cache.put(req, responseClone)
            })
            resolve(res);
            // Reject also if network fetch rejects.
        }, () => reject());
    });
};

const getFromCache = (req) => {
    // console.log('network is off so getting from cache...req =', req)
    return caches.open(CacheKey).then((cache) => {
        return cache.match(req).then((result) => {
            console.log('result', result)
            return result || Promise.reject("no-match");
        });
    });
};


self.addEventListener('install', () => {
    console.log('ServiceWorker installed');
});


self.addEventListener('activate', async () => {
    // получаем имена кэшей
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map(async (cacheName) => {
        // Удаляем кэши, которые не относятся к текущей версии
        if (cacheName !== CacheKey) {
            console.log('Удаляем кэши')
            await caches.delete(cacheName);
        }
    }));
});

async function fetchAssets(e) {
    try {
        return await fetch(e.request)
    } catch (err) {
        const cache = await caches.open(CacheKey)
        return cache.match(e.request)
    }
}

self.addEventListener("fetch", (e) => {
    e.respondWith(fetchAssets(e))
    if (tryNetwork) {
        let isNet = tryNetwork(e.request, 400)
        isNet && isNet.cache && e.respondWith(isNet.cache(() => getFromCache(e.request)))
    }


});

