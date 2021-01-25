import { Injectable, Logger } from '@nestjs/common';
import { IEvent, ofType, Saga } from '@nestjs/cqrs';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ThingCreated } from 'src/events/thing-created.event';
import { createSaga } from 'src/utils/create-saga';
import { NotifyPeopleCommand } from '../notify-people/notify-people.command';

@Injectable()
export class CreateSomethingProcess {
  logger = new Logger(this.constructor.name);
  @Saga()
  notifyWhenThingCreated = createSaga((event$: Observable<IEvent>) =>
    event$.pipe(
      ofType(ThingCreated),
      tap((event) => this.logger.debug(`Received ${event.constructor.name}`)),
      map(
        (event) =>
          new NotifyPeopleCommand(['Person1', 'Person2'], event.aggregateId),
      ),
    ),
  );
}
