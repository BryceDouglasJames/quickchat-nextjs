import { createContextInner } from '../context';
import { appRouter } from './_app';
import { inferMutationInput } from '~/utils/trpc';

test('add and get post', async () => {
  const ctx = await createContextInner({});
  const caller = appRouter.createCaller(ctx);

  const input: inferMutationInput<'message.add'> = {
    id: '48ae0239-bd44-430e-a06f-bc99d1cdc11b',
    text: 'hello test',
    user: 'TEST',
  };
  const message = await caller.mutation('message.add', input);
  const newpost = await caller.query('message.byID', {
    id: message.id,
  });

  expect(newpost).toMatchObject(input);
});
