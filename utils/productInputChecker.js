const productIntputChecker = (product) => {

  for (let [key, value] of Object.entries(product)) {

    if (value === '') {
      return false;
    }
  }
  return true;
}
export default productIntputChecker;