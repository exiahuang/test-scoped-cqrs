import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotifyPeopleCommand } from './notify-people.command';

// example
@CommandHandler(NotifyPeopleCommand)
export class NotifyPeopleHandler
  implements ICommandHandler<NotifyPeopleCommand> {
  logger = new Logger(this.constructor.name);

  async execute(command: NotifyPeopleCommand): Promise<any> {
    this.logger.debug(command);
  }
}
