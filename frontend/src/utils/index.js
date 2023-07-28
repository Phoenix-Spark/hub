export function formatDate(inputDate) {
  const date = new Date(inputDate);
  const options = {
    weekday: 'short',
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
    hour12: false,
  };
  let formattedDate = date.toLocaleString('en-US', options);
  formattedDate = formattedDate.replace('24:00', '00:00');

  return formattedDate;
}
