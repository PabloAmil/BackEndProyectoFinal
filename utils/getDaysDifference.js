function daysDifference(date1, date2) {
  const oneDay = 24 * 60 * 60 * 1000; 
  const diffDays = Math.round(Math.abs((date1 - date2) / oneDay));
  return diffDays;
}

export default daysDifference;