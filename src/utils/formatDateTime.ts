export const FormatDateTime = (dateString: string | null | Date): string => {
  if (!dateString) return 'N/A';

  const date = new Date(dateString);

  // Date format: 17 Jan 2026
  const dateOptions: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };

  // Time format: 5:30pm
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  };

  const formattedDate = new Intl.DateTimeFormat('en-GB', dateOptions).format(date);
  const formattedTime = new Intl.DateTimeFormat('en-US', timeOptions)
    .format(date)
    .toLowerCase()
    .replace(/\s/g, '');

  return `${formattedDate}, ${formattedTime}`;
};

export const FormatDate = (dateString: string | null | Date): string => {
  if (!dateString) return 'N/A';

  const date = new Date(dateString);

  // Date format: 17 Jan 2026
  const dateOptions: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };

  return new Intl.DateTimeFormat('en-GB', dateOptions).format(date);
};
