
const port = 8000;


let backendHost;
if(import.meta.env.PROD)
{
    backendHost = `http://${window.location.host}`;
}else
{
    backendHost = `http://${window.location.host.replace(":5173","")}:${port}`;
}
console.log(backendHost);
export default backendHost;


//for debug
//export default `http://${window.location.host.replace(":5173","")}:${port}`;

//for production
