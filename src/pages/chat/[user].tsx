/* eslint-disable prettier/prettier */

import { trpc } from '../../utils/trpc';
import { NextPageWithLayout } from '../_app';
import { useForm, UseFormProps } from 'react-hook-form';
import Link from 'next/link';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/router';
import NextError from 'next/error'


const messageschema = z.object({
  user: z.string(),
  text: z.string().min(1),
});

function useZodForm<TSchema extends z.ZodType>(
  props: Omit<UseFormProps<TSchema['_input']>, 'resolver'> & {
    schema: TSchema;
  },
) {
  const form = useForm<TSchema['_input']>({
    ...props,
    resolver: zodResolver(props.schema, undefined, {
      rawValues: true,
    }),
  });

  return form;
}

const ChatroomPage: NextPageWithLayout = () => {
  const utils = trpc.useContext();
  const router_user = useRouter().query.user as string; 
  const messagesQuery = trpc.useQuery([
    'message.allUserMessages',
    { user: router_user },
  ]);

  if(messagesQuery.error){
    //console.log(messagesQuery)
    return(
      <>
        <h1>OHHH NO!</h1>
        <br></br><br></br>
        <NextError
            title = {messagesQuery.error.message}
            statusCode= {messagesQuery.error.data?.httpStatus ?? 500}
        />
      </>
    );
  }

  const addMessage = trpc.useMutation('message.add', {
    async onSuccess() {
      // refetches posts after a post is added
      await utils.invalidateQueries([
        'message.allUserMessages',
        { user: router_user }
      ]);
    },
  });

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const formhandle = useZodForm({
    schema: messageschema,
    defaultValues: {
      user: router_user,
      text: '...',
    },
  });

  if (messagesQuery.status !== 'success') {
    return <>Loading...</>;
  }

  return (
    <>
      <h1>These are {messagesQuery.data[0]?.user}</h1>

      {messagesQuery.data?.map((item) => (
        <article key={item.id}>
          <h3>{item.text}</h3>
        </article>
      ))}
      

      <form
        onSubmit={formhandle.handleSubmit(async (vals) => {
          await addMessage.mutateAsync(vals);
          console.log(vals);
          formhandle.reset();
        })}
      >
        <label htmlFor="message">Enter message</label>
        <input
          type="text"
          {...formhandle.register('text')}
          disabled={addMessage.isLoading}
        />
      </form>
      <Link href={'/'}>
        <a>Back home</a>
      </Link>
    </>
  );
};

export default ChatroomPage;
