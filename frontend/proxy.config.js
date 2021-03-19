const proxy = [
  {
    context: '/api',
    target: 'https://b43dd29e7928.ngrok.io',
    pathRewrite: {'^/api' : ''}
  }
];
module.exports = proxy;