import { Command, Flags } from '@oclif/core';
import AdmZip from 'adm-zip';
import { readFile } from 'fs/promises';

export default class ZipHander extends Command {
  static args = {};

  static description = 'Untility for zipping entries';

  static flags = {
    target_entries: Flags.file({ exists: true, required: true, description: 'JSON file containing the list of entries to ZIP' }),
    output_zip: Flags.file({ exists: false, required: true, description: 'Location to output the ZIP' }),
    notification_webhook: Flags.url({ required: true, description: 'Webhook to call once the ZIP is complete' }),
    webhook_payload: Flags.file({ exists: true, required: true, description: 'Path to JSON representing payload to send with webhook' }),
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(ZipHander);

    // Open a ZIP
    const zip = new AdmZip(flags.output_zip);

    // Load in the target entries
    const entries: string[] = JSON.parse(await readFile(flags.target_entries, 'utf8'));
    console.log(entries);

  }
}
