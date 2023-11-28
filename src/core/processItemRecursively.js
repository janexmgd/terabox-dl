import path from 'path';
import fs from 'fs';

const processItemRecursively = (item, currentPath = '') => {
  const results = [];

  try {
    const fullPath = path.join(
      process.cwd(),
      'download',
      currentPath,
      item.filename
    );
    if (item.is_dir === '1' || item.is_dir === 1) {
      fs.mkdirSync(fullPath, { recursive: true });

      if (item.children && item.children.length > 0) {
        item.children.forEach((child) => {
          results.push(
            ...processItemRecursively(
              child,
              path.join(currentPath, item.filename)
            )
          );
        });
      }
    } else {
      const fileObject = {
        item,
        fullPath,
      };
      results.push(fileObject);
    }
  } catch (error) {
    console.error(`Error processing item: ${error.message}`);
  }

  return results;
};
export default processItemRecursively;
