const intputChecker = (...inputs) => {

  for ( let input of inputs) {
    if (input == ''){
      return false
    }
  }
  return true;
}
export default intputChecker;