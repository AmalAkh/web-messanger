
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "Octobet", "November", "December"]

export default function toDateString(date)
{
    if(typeof date == "string")
    {
        date = new Date(date);
    }
    return `${date.getDate()} ${months[date.getMonth()]}`
}