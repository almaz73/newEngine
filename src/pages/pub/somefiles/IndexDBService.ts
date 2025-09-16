let db = null;
const dbName = "PhotoDB";
const storeName = "photos";
const photoKey = "savedPhoto";


export function initDatabase() {
    const request = indexedDB.open(dbName, 1);

    request.onerror = function (event) {
        console.error("Ошибка открытия базы данных:", event.target.error);
        showStatus('Ошибка инициализации базы данных.', 'error');
    };

    request.onsuccess = function (event) {
        db = event.target.result;
        console.log("База данных успешно открыта");
        // Проверяем, есть ли сохраненное изображение
        checkSavedImage();
    };

    request.onupgradeneeded = function (event) {
        const db = event.target.result;

        // Создаем хранилище объектов, если его нет
        if (!db.objectStoreNames.contains(storeName)) {
            const objectStore = db.createObjectStore(storeName, {keyPath: 'id'});
            console.log("Хранилище объектов создано");
        }
    };
}

// Функция проверки сохраненного изображения
function checkSavedImage() {
    getPhotoFromDB()
        .then(photoData => {
            if (photoData) {
                imagePreview.src = photoData;
                previewContainer.classList.add('active');
            }
        })
        .catch(error => {
            console.error('Ошибка при получении фото:', error);
        });
}

// Функция получения фото из IndexedDB
function getPhotoFromDB() {
    return new Promise((resolve, reject) => {
        if (!db) {
            reject(new Error('База данных не инициализирована'));
            return;
        }

        const transaction = db.transaction([storeName], 'readonly');
        const objectStore = transaction.objectStore(storeName);
        const request = objectStore.get(photoKey);

        request.onsuccess = function () {
            if (request.result) {
                resolve(request.result.data);
            } else {
                resolve(null);
            }
        };

        request.onerror = function (event) {
            reject(event.target.error);
        };
    });
}

export function savePhotoToDB(photoData) {
    return new Promise((resolve, reject) => {
        if (!db) {
            reject(new Error('База данных не инициализирована'));
            return;
        }

        const transaction = db.transaction([storeName], 'readwrite');
        const objectStore = transaction.objectStore(storeName);

        const request = objectStore.put({id: photoKey, data: photoData});

        request.onsuccess = function () {
            resolve();
        };

        request.onerror = function (event) {
            reject(event.target.error);
        };
    });
}