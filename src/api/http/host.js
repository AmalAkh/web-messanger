
const port = 8000;


//for debug
export default `http://${window.location.host.replace(":5173","")}:${port}`;

//for production
//export default `http://${window.location.host}`;