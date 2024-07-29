export default function createDateWithOffset(value)
{
    let date = new Date(value);
    date.setTime(date.getTime()+(date.getTimezoneOffset()*60000*(-1)));
    return date;
}