export function formatDate(inputDate, dateOnly) {
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
  let formattedDate = dateOnly
    ? date.toLocaleString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
    : date.toLocaleString('en-US', options);
  formattedDate = formattedDate.replace('24:00', '00:00');

  return formattedDate;
}

export function firstSentence(paragraph) {
  return `${paragraph.split('.')[0]}.`;
}
