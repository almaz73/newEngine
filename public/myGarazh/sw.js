const CACHE_NAME = 'my-garage-v9'; // При обновлении приложения измените эту версию, например, на 'my-garage-v4'
const urlsToCache = [
	'/v2/myGarazh', // Кэшируем корневой путь
	'/v2/myGarazh/index.html',
	'/v2/myGarazh/about.html',
	'/v2/myGarazh/assets/style.css',
	'/v2/myGarazh/assets/icons/icon-192x192.png',
	'/v2/myGarazh/assets/icons/icon-512x512.png',
];

// Установка сервис-воркера и кэширование основных ресурсов
self.addEventListener('install', event => {
	event.waitUntil(
		caches.open(CACHE_NAME).then(cache => {
			console.log('Кэш открыт, кэшируем файлы...');
			return cache.addAll(urlsToCache);
		})
	);
});
// Активация сервис-воркера и удаление старых кэшей
self.addEventListener('activate', event => {
	event.waitUntil(
		caches.keys().then(cacheNames => {
			return Promise.all(
				cacheNames.map(cacheName => {
					// Если имя кэша не совпадает с текущим, удаляем его
					if (cacheName !== CACHE_NAME) {
						console.log('Удаление старого кэша:', cacheName);
						return caches.delete(cacheName);
					}
				})
			);
		})
	);
});
// Обработка запросов (стратегия "Cache first")
self.addEventListener('fetch', event => {
	event.respondWith(
		caches.match(event.request).then(cachedResponse => {
			// Если ресурс есть в кэше, возвращаем его
			if (cachedResponse) {
				return cachedResponse;
			}

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
			

			
