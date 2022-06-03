

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