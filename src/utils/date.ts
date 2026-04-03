export const formatUTCDate = (UTCDate: Date) => {
  if (UTCDate) {
    return UTCDate.toLocaleDateString('en-GB', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  }

  return 'N.D.';
};

export const stringToDate = (dateString: string): Date => {
  const [day, month, year] = dateString.split('/').map(Number);
  return new Date(Date.UTC(year, month - 1, day));
};

export const isValidDate = (UTCDate: Date) => UTCDate instanceof Date && !Number.isNaN(UTCDate);

export const isSameOrBefore = (
  date: Date,
  otherDate: Date,
) => date.getTime() <= otherDate.getTime();
