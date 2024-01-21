const CachKey = 'cach-v1'

function initCache(){
    return caches.open(CachKey).then(cache=>{
        return cache.addAll([
            "1.html","2.html", "3.html"
        ], err=>{
            console.log('err', err);
        })
    })
}


self.addEventListener('install', e => {
    console.log('Install');
    e.waitUntil(initCache())
})

self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then(keyList=>{
            return Promise.all(keyList.map(key=>{
                if(key !== CachKey){
                    return caches.delete(key)
                }
            }))
        })
    )
})


self.addEventListener('fetch', e => {
    console.log('fetch try network');
    e.respondWith(tryNetwork(e.request, 400).cache(()=>getFromCach(e.request)))

})