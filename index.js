import inquirer from 'inquirer';
import getShortUrl from './src/core/getShortUrl.js';
import getInfo from './src/core/getInfo.js';
import processItemRecursively from './src/core/processItemRecursively.js';
import getDownloadUrl from './src/core/getDownloadUrl.js';
import downloadFile from './src/core/downloadFile.js';

(async () => {
  try {
    const question = await inquirer.prompt([
      {
        type: 'input',
        name: 'url',
        message: 'insert your terabox url',
      },
      {
        type: 'confirm',
        name: 'hasPass',
        message: 'terabox url have password ?',
      },
    ]);

    // has password
    if (question.hasPass == true) {
      const ask = await inquirer.prompt({
        type: 'input',
        name: 'password',
        message: 'insert password terabox url',
      });
      const pwd = ask.password;
      const shortCode = getShortUrl(question.url);
      const info = await getInfo(shortCode, pwd);
      if (info.ok == false) {
        console.error(info.message);
        return;
      }

      const allResults = [];
      info.list.forEach((item) => {
        const result = processItemRecursively(item);
        allResults.push(...result);
      });
      console.log(`processing ${allResults.length} item \n`);
      const getDownloadPromises = allResults.map(async (element) => {
        const link = await getDownloadUrl(
          shortCode,
          pwd,
          info.shareid,
          info.uk,
          info.sign,
          info.timestamp,
          element.item.fs_id
        );
        const { item, fullPath } = element;
        const object = {
          item,
          fullPath,
          link,
        };
        return object;
      });
      console.log(`Get download link from ${allResults.length} item \n`);
      const data = await Promise.all(getDownloadPromises);
      console.log(
        `success get download link from ${allResults.length} item \n`
      );
      for (let index = 0; index < data.length; index++) {
        const element = data[index];
        const url = element.link.downloadLink;
        const fullPath = element.fullPath;
        try {
          await downloadFile(url, fullPath, index, data.length);
        } catch (error) {
          console.error(error);
        }
      }
      return;
    }
    const shortCode = getShortUrl(question.url);
    const info = await getInfo(shortCode, '');
    if (info.ok == false) {
      console.error(info.message);
      return;
    }

    const allResults = [];
    info.list.forEach((item) => {
      const result = processItemRecursively(item);
      allResults.push(...result);
    });
    console.log(`processing ${allResults.length} item \n`);
    const getDownloadPromises = allResults.map(async (element) => {
      const link = await getDownloadUrl(
        shortCode,
        '',
        info.shareid,
        info.uk,
        info.sign,
        info.timestamp,
        element.item.fs_id
      );
      const { item, fullPath } = element;
      const object = {
        item,
        fullPath,
        link,
      };
      return object;
    });
    console.log(`Get download link from ${allResults.length} item \n`);
    const data = await Promise.all(getDownloadPromises);
    console.log(`success get download link from ${allResults.length} item \n`);
    for (let index = 0; index < data.length; index++) {
      const element = data[index];
      const url = element.link.downloadLink;
      const fullPath = element.fullPath;
      try {
        await downloadFile(url, fullPath, index, data.length);
      } catch (error) {
        console.error(error);
      }
    }
  } catch (error) {
    console.error(error);
  }
})();
