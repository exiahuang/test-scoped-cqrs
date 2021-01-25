import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Thing } from 'src/models/thing.model';
import { IThingRepository } from 'src/repository/thing.repository.interface';
import { v4 } from 'uuid';
import { CreateSomethingCommand } from './create-something.command';

@CommandHandler(CreateSomethingCommand)
export class CreateSomethingHandler
  implements ICommandHandler<CreateSomethingCommand> {
  logger = new Logger(this.constructor.name);

  constructor(private readonly thingRepository: IThingRepository) {}
  async execute(command: CreateSomethingCommand): Promise<any> {
    this.logger.debug(`Creating a Thing...`);
    const thing = new Thing(command);
    thing.create(v4(), command.message);
    await this.thingRepository.save(thing);
  }
}
