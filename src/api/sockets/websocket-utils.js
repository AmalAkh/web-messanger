function getSetupConnectionFunction()
{
    let connectionAttempts = 0;
    return function setupConnection(ticket)
    {
        console.log(ticket)
        connectionAttempts+=1;
        console.log(connectionAttempts);
        return new Promise(async(resolve,reject)=>
        {
            let websocket = new WebSocket(`ws://localhost:8000?ticket=${ticket}`);
            
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