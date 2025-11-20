import { Command, Flags } from '@oclif/core';
import { readFile } from 'fs/promises';
import * as archiver from 'archiver';
import { createReadStream, createWriteStream } from 'fs';
import { basename } from 'path';

export default class ZipHander extends Command {
  static args = {};

  static description = 'Untility for zipping entries';

  static flags = {
    target_entries: Flags.file({
      exists: true,
      required: true,
      description: 'JSON file containing the list of entries to ZIP'
    }),
    output_zip: Flags.file({ exists: false, required: true, description: 'Location to output the ZIP' }),
    notification_webhook: Flags.url({ required: true, description: 'Webhook to call once the ZIP is complete' }),
    webhook_payload: Flags.file({
      exists: true,
      required: true,
      description: 'Path to JSON representing payload to send with webhook'
    })
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(ZipHander);

    // Make the zip file
    const fileStream = createWriteStream(flags.output_zip);

    // Make a new zipper
    const archive = archiver.create('zip');
    archive.pipe(fileStream);
    archive.on('error', (err) => {
      console.error(err);
    });

    // Load in the target entries
    const entries: string[] = JSON.parse(await readFile(flags.target_entries, 'utf8'))['entries'];

    // Load the webhook payload (before taking too long with zipping)
    const payload = await readFile(flags.webhook_payload, 'utf8');

    // Add the enties to the zip
    for (const entry of entries) {
      try {
        // Keep only the file name
        const entryName = basename(entry);

        // Read in the file
        const file = createReadStream(entry);

        // Add the file to the archive
        archive.append(file, { name: entryName });
      } catch (e) {
        console.warn(`Error reading file: ${e}`);
      }
    }

    // Wait for all zip operatings to complete
    await archive.finalize();

    // Close the zip file
    fileStream.close();

    // Post to the webhook to notify of completion
    const result = await fetch(flags.notification_webhook, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: payload
    });

    // Check to make sure the request went through successfully
    if (result.status != 200) {
      console.error(await result.text());
      throw new Error('Failed to call webhook');
    }

    // Left for easier debugging
    console.log(await result.json());
  }
}
