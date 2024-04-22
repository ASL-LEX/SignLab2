import { Args, Command, Flags } from '@oclif/core';

export default class ZipHander extends Command {
  static args = {};

  static description = 'Untility for zipping entries';

  static flags = {
    from: Flags.string({ char: 'f', description: 'Who is saying hello', required: true })
  };

  async run(): Promise<void> {
    const { args, flags } = await this.parse(ZipHander);
    this.log(`hello`);
  }
}
