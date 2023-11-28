import axios from 'axios';

const getInfo = async (shortCode, pwd) => {
  const maxRetries = 5;
  const delayBetweenRetries = 1000; // Dalam milidetik (misalnya, 1000 ms = 1 detik)

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const url = 'https://terabox-dl.qtcloud.workers.dev/api/get-info';
      const params = {
        shorturl: shortCode,
        pwd: pwd,
      };
      const headers = {
        'User-Agent':
          'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36',
      };

      const { data } = await axios.get(url, { params, headers });
      return data;
    } catch (error) {
      console.error(`Attempt ${attempt} failed. Error: ${error.message}`);

      if (attempt < maxRetries) {
        console.log(`Retrying in ${delayBetweenRetries / 1000} seconds...`);
        await new Promise((resolve) =>
          setTimeout(resolve, delayBetweenRetries)
        );
      }
    }
  }
  console.error(`All ${maxRetries} attempts failed.`);
  throw new Error('Max retries reached');
};

export default getInfo;
