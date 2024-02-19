/**
 * Не получится обойтись без евентбас - иногда требуется передать сообщения между не связанными между собой модуялми
 * Но это не создает глубокую связь - между модулями, они смогут работать друг без друга и дальше
 * связь происходит в виде оповещений и подписка на оповещения. любой модуль может создавать оповещения,
 * и любой мождуль может подписаться на эти оповещения
 * модуль заимстован отсюда https://copyprogramming.com/howto/vue-js-3-event-bus
 */

class EventBusEvent extends Event {
    public data: any

    constructor({type, data}: { type: string, data: any }) {
        super(type)
        this.data = data
    }
}

class EventBus extends EventTarget {
    private static _instance: EventBus

    public static getInstance(): EventBus {
        if (!this._instance) this._instance = new EventBus()
        return this._instance
    }

    public emit(type: string, data?: any): void {
        this.dispatchEvent(new EventBusEvent({type, data}))
    }
}

export default EventBus.getInstance()