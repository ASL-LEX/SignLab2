import { Command, Flags } from '@oclif/core';
import AdmZip from 'adm-zip';
import { readFile } from 'fs/promises';

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

    // Open a ZIP
    const zip = new AdmZip();

    // Load in the target entries
    const entries: string[] = JSON.parse(await readFile(flags.target_entries, 'utf8'))['entries'];

    // Load the webhook payload (before taking too long with zipping)
    const payload = await readFile(flags.webhook_payload, 'utf8');

    // Add the enties to the zip
    for (const entry of entries) {
      try {
        zip.addLocalFile(entry, 'entries/');
      } catch (e) {
        console.warn(`Error reading file: ${e}`);
      }
    }

    // Save the zip
    await zip.writeZipPromise(flags.output_zip);

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
