const CACHE_NAME = 'my-public_01'; // При обновлении приложения измените эту версию, например, на 'my-garage-v4'


const tryNetwork = (req, timeout) => {
	if (!navigator.onLine) return false
	if (req.url.includes('api')) return false

	// тут кешируем все полученные данные, но игнорируем обращения к серверу по апи
	return new Promise((resolve, reject) => {
		const timeoutId = setTimeout(reject, timeout);
		fetch && fetch(req).then((res) => {
			clearTimeout(timeoutId);
			const responseClone = res.clone();
			caches.open(CACHE_NAME).then((cache) => {
				cache.put(req, responseClone)
			})
			resolve(res);
			// Reject also if network fetch rejects.
		}, () => reject());
	});
};

const getFromCache = (req) => {
	// console.log('network is off so getting from cache...req =', req)
	return caches.open(CACHE_NAME).then((cache) => {
		return cache.match(req).then((result) => {
			return result || Promise.reject("no-match");
		});
	});
};


self.addEventListener('install', () => {
	console.log('ServiceWorker успешно установлен!');
});


self.addEventListener('activate', async () => {
	// получаем имена кэшей
	const cacheNames = await caches.keys();
	
	await Promise.all(cacheNames.map(async (cacheName) => {
		// Удаляем кэши, которые не относятся к текущей версии
		if (cacheName !== CACHE_NAME) {
			console.log('Удаляем кэши')
			await caches.delete(cacheName);
		}
	}));
});

async function fetchAssets(e) {
	try {
		return await fetch(e.request)
	} catch (err) {
		const cache = await caches.open(CACHE_NAME)
		return cache.match(e.request)
	}
}

self.addEventListener("fetch", (event) => {
	event.respondWith(fetchAssets(event))
	if (tryNetwork) {
		let isNet = tryNetwork(event.request, 400)
		isNet && isNet.cache && event.respondWith(isNet.cache(() => getFromCache(event.request)))
	}


});

