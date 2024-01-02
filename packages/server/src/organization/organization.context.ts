import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// TODO: After users are added in, grab organization from user
export const OrganizationContext = createParamDecorator((_data: unknown, _ctx: ExecutionContext) => {
  return { _id: '1', name: 'ASL-LEX' };
});
