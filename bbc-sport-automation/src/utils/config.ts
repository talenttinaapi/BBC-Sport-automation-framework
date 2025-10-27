export const config = {
  baseUrl: process.env.BASE_URL || 'https://www.bbc.com/sport',
  timeout: parseInt(process.env.TIMEOUT || '30000')
};
