import axios from 'axios';
import ProgressBarClass from '../utils/progressBar.js'; // Ubah nama ProgressBar ke ProgressBarClass
import fs from 'fs';
import { formatFileSize, formatSpeed } from '../utils/formatter.js';

const downloadFile = async (url, outputPath, currentLength, length) => {
  const MAX_RETRIES = 5;
  let retries = 0;
  const progressBar = new ProgressBarClass();

  while (retries < MAX_RETRIES) {
    try {
      const parts = outputPath.split('/');
      const filename = parts[parts.length - 1];
      const { data, headers: responseHeaders } = await axios.get(url, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36',
        },
        responseType: 'stream',
      });

      const totalSize = parseInt(responseHeaders['content-length'], 10);
      const fileSize = formatFileSize(totalSize);
      let downloadedSize = 0;
      let lastTimestamp = Date.now();

      // Buat instance baru dari kelas ProgressBar

      progressBar.start(100, {
        filename,
        size: fileSize,
        total: 1,
        bar: { width: 0 },
      });

      await new Promise((resolve, reject) => {
        const writeStream = fs.createWriteStream(outputPath);

        data.on('data', (chunk) => {
          downloadedSize += chunk.length;

          const current = downloadedSize;
          const currentTime = Date.now();
          const timeDiff = currentTime - lastTimestamp;
          const speed = (current / timeDiff) * 1000;

          const percentage = (current / totalSize) * 100;
          progressBar.update(
            percentage,
            formatSpeed(speed),
            currentLength,
            length
          );
        });

        data.on('end', () => {
          progressBar.complete();
          console.log(`Success download ${outputPath} \n`);
          resolve();
        });

        data.on('error', (error) => {
          progressBar.complete();
          console.error(`Error download ${outputPath}:`, error);
          reject(error);
        });

        data.pipe(writeStream);
      });

      return; // Exit the function if download is successful
    } catch (error) {
      console.error(`Error download file: ${outputPath}`, error);
      retries++;
      console.log(`Retrying... (Attempt ${retries}/${MAX_RETRIES})`);
    }
  }

  console.error(`Max retries reached for ${outputPath}`);
  throw new Error(`Failed to download file after ${MAX_RETRIES} attempts`);
};

export default downloadFile;
