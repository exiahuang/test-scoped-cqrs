import { ICommand, IEvent } from '@nestjs/cqrs';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { RequestFactory } from './request-factory';

/** The signature of any given saga */
export type ISaga<EventBase extends IEvent, CommandBase extends ICommand> = (
  event: Observable<EventBase>,
) => Observable<CommandBase>;

/**
 * Helper method for creating sagas. This copies the contextId from the last
 * processed event to any resulting commands.
 */
export const createSaga = <
  EventBase extends IEvent,
  CommandBase extends ICommand
>(
  saga: ISaga<EventBase, CommandBase>,
  lastEvent?: IEvent,
) => (event$: Observable<EventBase>) =>
  saga(event$.pipe(tap((event) => (lastEvent = event)))).pipe(
    tap(
      (command) =>
        command &&
        lastEvent &&
        RequestFactory.copyContextId(command, lastEvent),
    ),
  );
