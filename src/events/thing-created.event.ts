import { v4 } from 'uuid';

export class ThingCreated {
  id = v4();
  constructor(readonly aggregateId: string, readonly description: string) {}
}
