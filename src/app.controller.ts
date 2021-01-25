import { Controller, Get } from '@nestjs/common';
import { CreateSomethingCommand } from './commands/create-something/create-something.command';
import { CommandExecutor } from './utils/command-executor';

@Controller()
export class AppController {
  constructor(private readonly commandExecutor: CommandExecutor) {}

  @Get()
  async getHello(): Promise<void> {
    return await this.commandExecutor.execute(
      new CreateSomethingCommand('test'),
    );
  }
}
