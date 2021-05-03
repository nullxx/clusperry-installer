const defaultConfig = {
  osImages: {
    retrieve: {
      url: 'https://api.jsonbin.io/b/60901d198a409667ca047835',
      method: 'GET',
      headers: {
        accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'cache-control': 'no-cache',
        pragma: 'no-cache',
      },
    },
  },
};

export default defaultConfig;
