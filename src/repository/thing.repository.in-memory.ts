import { Injectable, Logger } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';
import { Thing } from 'src/models/thing.model';
import { RequestFactory } from 'src/utils/request-factory';
import { IThingRepository } from './thing.repository.interface';

@Injectable()
export class ThingRepositoryInMemory implements IThingRepository {
  logger = new Logger(ThingRepositoryInMemory.name);

  constructor(
    private readonly eventPublisher: EventPublisher,
    private readonly requestFactory: RequestFactory,
  ) {}

  async save(thing: Thing): Promise<void> {
    const req = await this.requestFactory.getRequestForSource(thing.ctx);
    this.logger.debug(
      `fake selecting tenant DB for request hostname: ${req.hostname}`,
    );
    this.eventPublisher.mergeObjectContext(thing).commit();
  }
}
