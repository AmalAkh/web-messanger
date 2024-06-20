export default function toTimeString(date)
{
    return `${date.getHours() >=10 ?date.getHours():`0${date.getHours()}` }:${date.getMinutes() >= 10 ? date.getMinutes() : `0${date.getMinutes()}` }`;
} 