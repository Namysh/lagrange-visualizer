const make = (tagName, props = {}) => {
  const elt = document.createElement(tagName);

  Object.entries(props).forEach(([key, value]) => {
    elt[key] = value;
  });

  return elt;
}

const find = query => document.querySelector(query);

export {
  make,
  find,
}