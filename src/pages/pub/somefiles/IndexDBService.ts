let db = null;
let photoKey: number = 0;
const dbName: string = "PhotoDB";
const storeName: string = "photos";


export function initDatabase() {
    return new Promise((resolve) => {
        const request: IDBOpenDBRequest = indexedDB.open(dbName, 1);

        request.onerror = function (event) {
            console.error("Ошибка открытия базы данных:", event.target.error);
        };

        request.onsuccess = function (event: Event) {
            db = event.target.result;
            console.log("База данных успешно открыта");
            resolve(true)
        };

        request.onupgradeneeded = function (event: IDBVersionChangeEvent) {
            const db = event.target.result;

            // Создаем хранилище объектов, если его нет
            if (!db.objectStoreNames.contains(storeName)) {
                const objectStore = db.createObjectStore(storeName, {keyPath: 'id'});
                console.log("Хранилище объектов создано");
                resolve(true)
            }
        };
    })
}


// Функция получения фото из IndexedDB
export function getPhotoFromDB(photoK: number) {
    return new Promise((resolve, reject) => {
        photoKey = photoK
        if (!db) {
            reject(new Error('База данных не инициализирована'));
            return;
        }

        const transaction = db.transaction([storeName], 'readonly');
        const objectStore = transaction.objectStore(storeName);
        const request = objectStore.get(photoKey);

        request.onsuccess = function () {
            if (request.result) resolve(request.result.data);
            else resolve(null);
        };

        request.onerror = event => reject(event.target.error)
    });
}

export function savePhotoToDB(photoData: string, photoK:number) {
    return new Promise((resolve, reject) => {
        photoKey = photoK
        if (!db) {
            reject(new Error('База данных не инициализирована'));
            return;
        }

        const transaction = db.transaction([storeName], 'readwrite');
        const objectStore = transaction.objectStore(storeName);
        const request = objectStore.put({id: photoKey, data: photoData});

        request.onsuccess = () => resolve();
        request.onerror = event => reject(event.target.error);
    });
}