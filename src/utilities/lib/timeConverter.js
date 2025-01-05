/* eslint-disable no-unsafe-optional-chaining */
const timeConverter = (time) => {
  if (!time) {
    return null;
  }
  const [hours, minutes] = time.split(":");

  let formattedHours = parseInt(hours, 10);
  const ampm = formattedHours >= 12 ? "PM" : "AM";
  formattedHours = formattedHours % 12 || 12;

  const formattedMinutes = minutes.padStart(2, "0");

  return `${formattedHours}:${formattedMinutes}${"\u00A0"}${ampm}`;
};

export default timeConverter;
