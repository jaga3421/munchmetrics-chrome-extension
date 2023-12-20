// input will be number, add a INR symbol as prefix, format with proper commas as per indian numeral system (ex: 1,00,000 or 10,00,000) and return the string
export const formatINR = (number) => {
  return '₹' + number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
