export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const getRandomFloat = (a = 0, b = 1, round = 2) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return (lower + Math.random() * (upper - lower + 1)).toFixed(round);
};

export const ucFirst = (str) => {
  const firstLetter = str.substr(0, 1);
  return firstLetter.toUpperCase() + str.substr(1);
};

export const generateId = () => Date.now() + parseInt(Math.random() * 10000, 10);
