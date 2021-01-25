import { CreateSomethingHandler } from './create-something/create-something.handler';
import { CreateSomethingProcess } from './create-something/create-something.process';
import { NotifyPeopleHandler } from './notify-people/notify-people.handler';

export const Handlers = [CreateSomethingHandler, NotifyPeopleHandler];
export const Processes = [CreateSomethingProcess];
