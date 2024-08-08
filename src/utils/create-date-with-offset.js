export default function createDateWithOffset(value)
{
    if(!value)
    {
        return null;
    }
    console.log(value);
    let date = new Date(value);
    console.log(date);

    date.setTime(date.getTime()+(date.getTimezoneOffset()*60000*(-1)));
    console.log(date);
    return date;
}