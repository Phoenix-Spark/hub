/* eslint-disable no-underscore-dangle */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import db from '../index.js';

async function exportDataToJson(table: string): Promise<void> {
  try {
    const data = await db(table).select('*');
    const jsonContent = JSON.stringify(data, null, 2);
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const outputDirectory = path.join(__dirname, 'JsonFiles');
    const filePath = path.join(outputDirectory, `${table}.json`);

    fs.writeFileSync(filePath, jsonContent);

    console.log(`Data exported to ${table}.json`);
  } catch (error) {
    console.error('Error exporting data:', error);
  }
}
// /home/kyle/projects/hub/server/src/Database/JsonDB/JsonFiles
// /home/kyle/projects/hub/server/dist/Database/JsonDB/JsonFiles/bases.json
export default exportDataToJson;
// tables to export \/
exportDataToJson('bases');
exportDataToJson('cells');
exportDataToJson('users');
exportDataToJson('faqs');
// exportDataToJson('permissions');
// exportDataToJson('projects');
// exportDataToJson('project_users');
// exportDataToJson('project_photo');
// exportDataToJson('tags');
// exportDataToJson('project_tag');
// exportDataToJson('news');
// exportDataToJson('categories');
// exportDataToJson('posts');
// exportDataToJson('comments');
// exportDataToJson('replies');

