// Service Worker регистрация
if ('serviceWorker' in navigator) {
	window.addEventListener('load', function () {
		navigator.serviceWorker
			.register('sw.js')
			.then(function (registration) {
				console.log('ServiceWorker зарегистрирован успешно:', registration)
			})
			.catch(function (error) {
				console.log('Ошибка регистрации ServiceWorker:', error)
			})
	})
}

// Обработка кнопки установки
let deferredPrompt
const installBtn = document.getElementById('installBtn')

window.addEventListener('beforeinstallprompt', e => {
	e.preventDefault()
	deferredPrompt = e
	installBtn.style.opacity = 1

	installBtn.addEventListener('click', () => {
		installBtn.style.display = 'none'
		deferredPrompt.prompt()
		deferredPrompt.userChoice.then(choiceResult => {
			if (choiceResult.outcome === 'accepted') {
				console.log('Пользователь принял предложение установки')
			} else {
				console.log('Пользователь отклонил предложение установки')
			}
			deferredPrompt = null
		})
	})
})

// --- Управление статусом онлайн/офлайн ---
const offlineBanner = document.getElementById('offline-text')

/**
 * Обновляет UI в зависимости от статуса сети.
 */
function updateOnlineStatus() {
	const isOnline = navigator.onLine
	if (offlineBanner) {
		offlineBanner.style.opacity = isOnline ? 0 : 1
	}
}

// Проверяем статус при загрузке страницы
window.addEventListener('load', updateOnlineStatus)

// Слушаем нативные события браузера для быстрого реагирования
window.addEventListener('online', updateOnlineStatus)
window.addEventListener('offline', updateOnlineStatus)

// Слушаем сообщения от сервис-воркера для более надежного определения офлайна
navigator.serviceWorker.addEventListener('message', event => {
	// Проверяем, что сообщение от нашего SW и касается статуса сети
	if (
		event.data &&
		event.data.type === 'STATUS_UPDATE' &&
		!event.data.payload.online
	) {
		console.log('Сообщение от SW: офлайн-режим подтвержден.')
		if (offlineBanner) offlineBanner.style.opacity = 0

		console.log('offlineBanner.style = ', offlineBanner.style)
	}
})

// Функция для проверки режима отображения и скрытия кнопки, если приложение запущено как PWA
function checkAndHideInstallButton() {
	if (installBtn) {
		const isStandalone =
			window.matchMedia('(display-mode: standalone)').matches ||
			window.matchMedia('(display-mode: fullscreen)').matches ||
			window.matchMedia('(display-mode: minimal-ui)').matches
		if (isStandalone) {
			installBtn.style.display = 'none'
			console.log(
				'Приложение запущено в автономном режиме. Кнопка установки скрыта.'
			)
			return true // Приложение установлено и запущено автономно
		}
	}
	return false // Приложение открыто в браузере
}

// Выполняем проверку сразу при загрузке скрипта.
const isAppInstalledAndRunningStandalone = checkAndHideInstallButton()

// По умолчанию скрываем кнопку, если она есть и еще не была скрыта проверкой режима.
if (installBtn && !isAppInstalledAndRunningStandalone) {
	installBtn.style.display = 'none'
}

window.addEventListener('beforeinstallprompt', e => {
	e.preventDefault()
	deferredPrompt = e
	installBtn.style.display = 'block'
	// Показываем кнопку, только если приложение НЕ запущено в автономном режиме
	if (!isAppInstalledAndRunningStandalone) {
		installBtn.style.display = 'block'
	}

	installBtn.addEventListener('click', () => {
		installBtn.style.display = 'none'
		deferredPrompt.prompt()
		deferredPrompt.userChoice.then(choiceResult => {
			if (choiceResult.outcome === 'accepted') {
				console.log('Пользователь принял предложение установки')
			} else {
				console.log('Пользователь отклонил предложение установки')
			}
			deferredPrompt = null
		})
	})
})
