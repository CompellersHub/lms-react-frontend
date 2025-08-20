export const parseEventDate = (dateString) => {
  if (!dateString) {
    return new Date("Invalid Date");
  }

  // Regex to extract day, month, and year from "7th September 2025"
  const match = dateString.match(/(\d+)(?:st|nd|rd|th)?\s+(\w+)\s+(\d{4})/);

  if (!match) {
    console.error("Date string format not recognized:", dateString);
    return new Date("Invalid Date");
  }

  const [, day, monthName, year] = match;

  // Month names to month numbers (0-indexed for Date constructor)
  const monthMap = {
    January: 0,
    February: 1,
    March: 2,
    April: 3,
    May: 4,
    June: 5,
    July: 6,
    August: 7,
    September: 8,
    October: 9,
    November: 10,
    December: 11,
  };

  const month = monthMap[monthName];

  if (month === undefined) {
    console.error("Invalid month name in date string:", dateString);
    return new Date("Invalid Date");
  }

  // Create a Date object. Note: Month is 0-indexed.
  return new Date(year, month, day);
};
