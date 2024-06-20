import toDateString from "./to-date-string";

export default function groupByDate(messages)
{
    return messages.reduce((prevVal, current)=>
    {
        (prevVal[toDateString(current.date)] = prevVal[toDateString(current.date)] || []).push(current);
        return prevVal;
    }, {})
}

