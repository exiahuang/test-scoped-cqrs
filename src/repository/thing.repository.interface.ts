import { Thing } from 'src/models/thing.model';

export abstract class IThingRepository {
  abstract save(thing: Thing): Promise<void>;
}
