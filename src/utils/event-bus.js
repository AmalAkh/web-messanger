class EventBus
{
    constructor()
    {
        this.events = new Map();
    }
    clear()
    {
        this.events.clear();
    }
    emit(event, ...args)
    {
        this.events.get(event) && this.events.get(event).forEach((listener)=>
        {
            listener(...args);
        })
    }
    addEventListener(event, listener)
    {
        !this.events.get(event) && this.events.set(event, [])
        this.events.get(event).push(listener);
    }
}
export default new EventBus();