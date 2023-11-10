import { format } from "date-fns";

const formatChatDate = (date: Date) => {
  const currentDate = new Date();

  const [year, month, day] = [
    currentDate.getFullYear(), // full year -> 4 digits
    currentDate.getMonth(), //month->0 to 11
    currentDate.getDate(), // day of m->1 to 31
  ];

  if (
    year === date.getFullYear() &&
    month === date.getMonth() &&
    day === date.getDate()
  ) {
    return `Today, ${format(date, "hh:mm a")}`;
  }

  if (year === date.getFullYear()) {
    return format(date, "dd MMM, hh:mm a");
  }

  return format(date, "dd MMM, yyyy");
};

export default formatChatDate;
