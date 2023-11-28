import axios from 'axios';

const getDownloadUrl = async (
  shortCode,
  pwd,
  shareId,
  uk,
  sign,
  timestamp,
  fs_id
) => {
  try {
    const maxRetries = 5;
    const delayBetweenRetries = 1000;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const url = 'https://terabox-dl.qtcloud.workers.dev/api/get-download';
        const body = {
          shareid: shareId,
          uk: uk,
          sign: sign,
          timestamp: timestamp,
          fs_id: fs_id,
        };
        const headers = {
          'User-Agent':
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36',
        };

        const { data } = await axios.post(url, body, { headers });
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
  } catch (error) {
    console.log(error);
  }
};
export default getDownloadUrl;
