import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { CommandBus, ICommand } from '@nestjs/cqrs';
import { IRequest } from 'src/interfaces/request.interface';
import { RequestFactory } from './request-factory';

@Injectable({ scope: Scope.REQUEST })
export class CommandExecutor<RequestBase = IRequest> {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly requestFactory: RequestFactory<RequestBase>,
    @Inject(REQUEST) private readonly req: RequestBase,
  ) {}
  async execute<R, T extends ICommand = ICommand>(command: T): Promise<R> {
    this.requestFactory.registerContextId(command, this.req);
    return await this.commandBus.execute(command);
  }
}
