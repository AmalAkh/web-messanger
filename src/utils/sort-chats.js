export default function sortChats(chats)
{
    return chats.sort((chat1, chat2)=>
    {
        const chat1Date = chat1.lastMessageDate ?? chat1.date;
        const chat2Date = chat2.lastMessageDate ?? chat2.date;
        
       
        if(chat1Date > chat2Date)
        {
            return -1;
        }else if(chat1Date < chat2Date)
        {
            return 1;
        }
        return 0;
        
        
    })
}