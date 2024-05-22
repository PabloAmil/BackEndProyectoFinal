
const checkDate = (queryDate) => {

  const dateTime1 = new Date(queryDate);
  const dateTime2 = new Date();

  const differenceInMilliseconds = Math.abs(dateTime2 - dateTime1);
  const differenceInHours = differenceInMilliseconds / (1000 * 60 * 60);

  if (differenceInHours >= 1) {
    return true;
  } else {
    return false;
  }
};

export default checkDate;



