import { ICommand, IEvent, IQuery } from '@nestjs/cqrs';

export type IContextSource = ICommand | IQuery | IEvent;
