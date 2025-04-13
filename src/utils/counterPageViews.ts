// записывает посещаемость страниц
import { useGlobalStore } from '@/stores/globalStore'
import { formatDMY_hm } from '@/utils/globalFunctions'

let pathHistory = ''
let oldTime = Date.now()
let account: any = null

function getRole() {
  account = useGlobalStore().account
  account.appealIdForShowCounter = useGlobalStore().appealIdForShowCounter
  return account.role + '[' + account.lastName + ']'
}

export const startCounter = function(path: string, time: number) {
  if (!pathHistory) pathHistory += getRole() + '-' + formatDMY_hm(new Date())
  else {
    let longTime = Math.floor((time - oldTime) / 1000)
    pathHistory += '👉' + path + '(' + longTime + 'сек.)'
    oldTime = time
  }
}

window.addEventListener('beforeunload', function(event) {
  // сохраняем только для dev и localhost
  if (location.href.includes('localhost') || location.href.includes('dev.')) {
    if (account.lastName != 'Файзрахманов') {
      useGlobalStore().sendComment({ text: pathHistory, EntityId: account.appealIdForShowCounter, entityType: 20 })
    }
  }

  // event.preventDefault()
  event.returnValue = ''   // Chrome требует наличия returnValue
  // alert()
})