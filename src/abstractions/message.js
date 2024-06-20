export default class Message
{
    constructor(text, date, id,isLocal=true, files=[])
    {
        this.text = text;
        this.date = new Date(date);
        this.files = [];
        this.isLocal = isLocal;
        this.id = id;
    }
}