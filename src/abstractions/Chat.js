export default class Chat
{
    userName;avatar;userId;id;messages;
    constructor(userName, avatar, id, userId, messages=[])
    {
        this.userName = userName;
        this.avatar = avatar;
        this.unseenMessageCounts = 0;
        this.lastMessageText = null;
        this.id = id;
        this.userId = userId;
        
    }
}