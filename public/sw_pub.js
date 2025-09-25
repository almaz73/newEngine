const CACHE_NAME = 'my-public_01'; // При обновлении приложения измените эту версию, например, на 'my-garage-v4'

// todo - serviceWorker сломался по причине, что не может найти файлы для кэша, нужно потом поправить

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

// Обработка запросов (стратегия "Cache first")
self.addEventListener('fetch', event => {
	event.respondWith(
		caches.match(event.request).then(cachedResponse => {
			// Если ресурс есть в кэше, возвращаем его
			if (cachedResponse) return cachedResponse;

			// Если ресурса нет в кэше, делаем запрос к сети
			return fetch(event.request).catch(error => {
				// Запрос к сети не удался, скорее всего, из-за отсутствия подключения.
				console.log('Не удалось получить; отправка автономного сообщения клиенту.', error);

				// Отправляем сообщение всем клиентам (открытым вкладкам)
				self.clients.matchAll().then(clients => {
					clients.forEach(client => {
						client.postMessage({ type: 'STATUS_UPDATE', payload: { online: false } });
					});
				});

				// Важно: после отправки сообщения нужно что-то вернуть.
				// Пробрасываем ошибку дальше, чтобы запрос завершился неудачей,
				// как и ожидается при отсутствии сети.
				throw error;
			});
		})
	);
});

