export const notEmpty = (name) => (v) =>
  !v || v.trim() === '' ? `${name} is required` : true;
