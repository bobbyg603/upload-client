import fetch from 'node-fetch';
import * as path from 'path';
import * as fs from 'fs/promises';

module.exports = (on: any, config: any) => {
    on('task', {
        async 'uploadFile'(args: { fileName: string, filePath: string }) {
            const { fileName, filePath } = args;
            const fullFilePath = path.join(config.fixturesFolder, filePath);
            
            console.log(`About to upload file ${fileName}, ${fullFilePath}...`);

            // fs.stat(fullFilePath, () => null) // todo bg remove
            const stats = await fs.stat(fullFilePath);
            if (stats.size <= 0) {
                throw new Error('Invalid file!');
            }
            
            const fileHandle = await fs.open(fullFilePath);
            const response = await fetch(
                config.env.serverUrl,
                {
                    method: 'POST',
                    body: fileHandle.createReadStream()
                }
            );

            if (response.status !== 200) {
                throw new Error('Could not upload file!');
            }

            return null;
        }
    });
}
