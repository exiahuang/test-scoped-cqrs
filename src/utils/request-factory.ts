import { Injectable, Scope } from '@nestjs/common';
import { ContextId, ContextIdFactory, ModuleRef, REQUEST } from '@nestjs/core';
import { IContextSource } from 'src/interfaces/context-source.interface';
import { IRequest } from 'src/interfaces/request.interface';

@Injectable({ scope: Scope.DEFAULT })
export class RequestFactory<R = IRequest> {
  constructor(private readonly moduleRef: ModuleRef) {}

  static copyContextId(dest: IContextSource, source?: IContextSource): void {
    const descriptor = Object.getOwnPropertyDescriptor(source, '_contextId');
    if (descriptor) {
      Object.defineProperty(dest, '_contextId', {
        value: descriptor.value,
        enumerable: true,
      });
    }
  }

  registerContextId<T extends IContextSource>(dest: T, req: R): void {
    const contextId = ContextIdFactory.getByRequest(req);
    Object.defineProperty(dest, '_contextId', {
      value: contextId,
      enumerable: true,
    });
  }

  async getRequestByContextId(contextId: ContextId): Promise<R> {
    return await this.moduleRef.resolve(REQUEST, contextId, { strict: false });
  }

  async getRequestForSource<T extends IContextSource>(source?: T): Promise<R> {
    const descriptor = Object.getOwnPropertyDescriptor(source, '_contextId');
    if (!descriptor) {
      throw new Error(
        `Source "${source?.constructor?.name}" has no '_contextId'`,
      );
    }
    return await this.getRequestByContextId(descriptor.value);
  }
}
