export function isDouble(val) {
    const number = Number(val);
    return !isNaN(number) && isFinite(number) && number % 1 !== 0;
}
