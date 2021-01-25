import { Type } from '@nestjs/common';
import { AggregateRoot, IEvent } from '@nestjs/cqrs';
import { IContextSource } from 'src/interfaces/context-source.interface';
import { RequestFactory } from './request-factory';

/** The signature for an aggregate root event handler */
export type IEventHandler<E extends IEvent> = (event: E) => void;

/** A place to keep track of event handlers */
const Handlers = new Map<string, IEventHandler<any>>();

/** The same events can be handled by multiple aggregates, if necessary */
const handlerKey = (eventName: string, aggregateRootName: string): string =>
  [eventName, aggregateRootName].join('_');

/** Registers an event handler to any method on an aggregate root */
export const EventHandler = <E extends IEvent, H extends IEventHandler<E>>(
  eventType: Type<E>,
) => <T extends IAggregateRoot>(
  target: T,
  _propertyKey: string | symbol,
  descriptor: TypedPropertyDescriptor<H>,
): void => {
  if (descriptor.value) {
    Handlers.set(
      handlerKey(eventType.name, target.constructor.name),
      descriptor.value,
    );
  }
};

/** Custom AggregateRoot class */
export abstract class IAggregateRoot<
  EventBase extends IEvent = IEvent
> extends AggregateRoot<EventBase> {
  #events: EventBase[] = [];

  constructor(readonly ctx?: IContextSource) {
    super();
  }

  commit(): void {
    this.#events.forEach((event) => this.publish(event));
    this.#events.length = 0;
  }

  uncommit(): void {
    this.#events.length = 0;
  }

  getUncommittedEvents(): EventBase[] {
    return this.#events;
  }

  apply<T extends EventBase = EventBase>(
    event: T,
    isFromHistory?: boolean,
  ): void {
    RequestFactory.copyContextId(event, this.ctx);

    if (!isFromHistory && !this.autoCommit) {
      this.#events.push(event);
    }
    this.autoCommit && this.publish<T>(event);
    const handler = this.getEventHandler<T>(event);
    handler && handler.call(this, event);
  }

  protected getEventHandler<T extends EventBase = EventBase>(
    event: T,
  ): ((event: T) => void) | undefined {
    return Handlers.get(
      handlerKey(this.getEventName(event), this.constructor.name),
    );
  }
}
