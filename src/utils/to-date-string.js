
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "Octobet", "November", "December"]

export default function toDateString(date)
{
    return `${date.getDate()} ${months[date.getMonth()]}`
}