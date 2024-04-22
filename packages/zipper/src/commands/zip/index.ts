import { Args, Command, Flags } from '@oclif/core';

export default class ZipHander extends Command {
  static args = {};

  static description = 'Untility for zipping entries';

  static flags = {
    target_entries: Flags.file({ exists: true, required: true, description: 'JSON file containing the list of entries to ZIP' }),
    output_zip: Flags.file({ exists: false, required: true, description: 'Location to output the ZIP' }),
    notification_webhook: Flags.url({ required: true, description: 'Webhook to call once the ZIP is complete' }),
    webhook_payload: Flags.file({ exists: true, required: true, description: 'Path to JSON representing payload to send with webhook' }),
    from: Flags.string({ char: 'f', description: 'Who is saying hello', required: true })
  };

  async run(): Promise<void> {
    const { args, flags } = await this.parse(ZipHander);
    this.log(`hello`);
  }
}
