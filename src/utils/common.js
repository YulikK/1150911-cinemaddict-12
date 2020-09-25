export const setFirstCapital = (text) => {
  const firstLetter = text.substr(0, 1);
  return firstLetter.toUpperCase() + text.substr(1);
};

export const getCurrentDate = () => {
  const currentDate = new Date();
  currentDate.setHours(23, 59, 59, 999);

  return currentDate;
};

export const makeItemsUnique = (items) => [...new Set(items)];
