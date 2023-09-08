/* eslint-disable no-underscore-dangle */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import db from '../Database/index.js';

async function exportDataToJson(table: string): Promise<void> {
  try {
    const data = await db(table).select('*');
    const jsonContent = JSON.stringify(data, null, 2);
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const outputDirectory = path.join(
      __dirname,
      '..',
      '..',
      '..',
      'frontend-static',
      'public',
      'json'
    );
    const filePath = path.join(outputDirectory, `${table}.json`);

    fs.writeFileSync(filePath, jsonContent);

    console.log(`Data exported to ${table}.json`);
  } catch (error) {
    console.error('Error exporting data:', error);
  }
}

export default exportDataToJson;
