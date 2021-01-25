import { ThingCreated } from 'src/events/thing-created.event';
import { EventHandler, IAggregateRoot } from 'src/utils/aggregate-root';

export class Thing extends IAggregateRoot {
  id!: string;
  description!: string;

  create(aggregateId: string, description: string): void {
    this.apply(new ThingCreated(aggregateId, description));
  }

  @EventHandler(ThingCreated)
  onThingCreated(event: ThingCreated): void {
    this.id = event.aggregateId;
    this.description = event.description;
  }
}
