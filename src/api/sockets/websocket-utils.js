import host from '../http/host';
function getSetupConnectionFunction()
{
    let connectionAttempts = 0;
    return function setupConnection(ticket)
    {
       
        connectionAttempts+=1;
        
        return new Promise(async(resolve,reject)=>
        {
            let websocket = new WebSocket(`ws://${host.replace("http://", "")}?ticket=${ticket}`);
            
            websocket.onerror = async (err)=>
            {
                setTimeout(async ()=>
                {
                    if(connectionAttempts > 4)
                    {
                        reject(err);
                        return;
                    }else
                    {
                        resolve(await setupConnection(ticket));
                    }
                }, 3000);
                
                
            };
            websocket.onopen = ()=>
            {
                connectionAttempts = 0;
                resolve(websocket);
                    
            };
        })
    }
}
export { getSetupConnectionFunction} ;