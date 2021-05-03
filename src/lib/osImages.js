const { default: defaultConfig } = require('../config/default');

const retrieveOSImages = async() => {
  const { url, method, headers } = defaultConfig.osImages.retrieve;

  const response = await fetch(url, { method, headers });
  const data = await response.json();
  return data; 
};

export { retrieveOSImages };

