import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AppController } from './app.controller';
import { Handlers, Processes } from './commands';
import { ThingRepositoryInMemory } from './repository/thing.repository.in-memory';
import { IThingRepository } from './repository/thing.repository.interface';
import { CommandExecutor } from './utils/command-executor';
import { RequestFactory } from './utils/request-factory';

const repositories = [
  {
    provide: IThingRepository,
    useClass: ThingRepositoryInMemory,
  },
];

@Module({
  imports: [CqrsModule],
  controllers: [AppController],
  providers: [
    CommandExecutor,
    RequestFactory,
    ...repositories,
    ...Handlers,
    ...Processes,
  ],
})
export class AppModule {}
