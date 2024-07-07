export default class Message
{
    constructor(text, date, chatId, userId, id,isLocal=true, files=[])
    {
        this.text = text;
        this.date = new Date(date);
        this.files = [];
        this.chatId = chatId;
        this.userId = userId;
        this.isLocal = isLocal;
        this.id = id;
    }
}