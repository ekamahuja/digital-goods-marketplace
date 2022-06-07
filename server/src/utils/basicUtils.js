

/**
 * It takes two arguments, an amount and a percentage, and returns the amount plus the percentage of
 * the amount
 * @param amount - The amount of money you want to calculate the percentage of.
 * @param percentage - The percentage you want to add to the amount.
 * @returns the answer variable.
 */
export const calculateAmount = (amount, percentage) => {
    const answer = ((amount * (percentage / 100)) + amount).toFixed(2);
    return answer;
}



/**
 * It takes a string, splits it into an array of words, then maps over each word, captalizing the first
 * letter and lowercasing the rest, then joins the array back into a string.
 * @param string - The string you want to captalize.
 * @returns the captalized words joined by a space.
 */
export const captalize = (string) => {
    const words = string.split(" ")
    const captalizedWords = words.map(word => word[0].toUpperCase() + word.slice(1).toLowerCase())

    return captalizedWords.join(" ")
}



/**
 * It takes a timestamp, converts it to a date, then returns a string with the month, day, year, hour,
 * minutes, and AM/PM.
 * @param timestamp - the timestamp you want to convert
 * @returns A string.
 */
export const convertTimestamp = (timestamp) => {
    timestamp = new Date(timestamp)

    const month = months[timestamp.getMonth()]
    const day = timestamp.getDate()
    const year = timestamp.getFullYear()
    let hour = timestamp.getHours() % 12
    hour = hour ? hour : 12
    const minutes = (timestamp.getMinutes() < 10 ? "0" : "") + timestamp.getMinutes()
    const ampm = hour >= 12 ? 'PM' : 'AM'

    const time = `${month} ${day}, ${year}, ${hour}:${minutes} ${ampm}`    
    return time;
}


const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];