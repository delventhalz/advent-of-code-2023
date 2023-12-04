/**
 * Get the time now in a particular timezone. Returns an object with the
 * following properties, all populated with numbers:
 *   - second
 *   - minute
 *   - hour
 *   - day
 *   - month
 *   - year
 *
 * @param {string} timezone - a valid timezone string
 * @param {string} [dateValue] - timestamp number, date string, or Date object
 * @returns {Object<string, number>} an object with time properties
 */
export const dateToTz = (timezone, dateValue) => {
  const date = dateValue === undefined ? new Date() : new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid Date from value: ${dateValue}`)
  }

  const second = date.toLocaleString([], { timeZone: timezone, second: 'numeric' });
  const minute = date.toLocaleString([], { timeZone: timezone, minute: 'numeric' });
  const hour = date.toLocaleString([], { timeZone: timezone, hour: 'numeric', hourCycle: 'h23' });
  const day = date.toLocaleString([], { timeZone: timezone, day: 'numeric' });
  const month = date.toLocaleString([], { timeZone: timezone, month: 'numeric' });
  const year = date.toLocaleString([], { timeZone: timezone, year: 'numeric' });

  return {
    second: Number(second),
    minute: Number(minute),
    hour: Number(hour),
    day: Number(day),
    month: Number(month),
    year: Number(year)
  };
};
