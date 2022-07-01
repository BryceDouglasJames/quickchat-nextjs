import { trpc } from '../utils/trpc';
import { NextPageWithLayout } from './_app';
import { useForm, UseFormProps } from 'react-hook-form';
import Link from 'next/link';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

export const validationschema = z.object({
  title: z.string().min(1),
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

const IndexPage: NextPageWithLayout = () => {
  const utils = trpc.useContext();
  const postsQuery = trpc.useQuery(['post.all']);
  const addPost = trpc.useMutation('post.add', {
    async onSuccess() {
      // refetches posts after a post is added
      await utils.invalidateQueries(['post.all']);
    },
  });

  const formhandle = useZodForm({
    schema: validationschema,
    defaultValues: {
      title: '...',
      text: '...',
    },
  });

  return (
    <>
      <h1>tRPC starter!</h1>

      <Link href={'/chat/TEST'}>
        <a>See all user post</a>
      </Link>

      <h2>
        Posts
        {postsQuery.status === 'loading' && '(loading)'}
      </h2>
      {postsQuery.data?.map((item) => (
        <article key={item.id}>
          <h3>{item.title}</h3>
          <Link href={`/post/${item.id}`}>
            <a>View more</a>
          </Link>
        </article>
      ))}

      <hr />

      <form
        onSubmit={formhandle.handleSubmit(async (vals) => {
          await addPost.mutateAsync(vals);
          formhandle.reset();
        })}
      >
        <label htmlFor="title">Title:</label>
        <br />
        <input
          type="text"
          {...formhandle.register('title')}
          disabled={addPost.isLoading}
        />
        <br />
        <label htmlFor="text">Text:</label>
        <br />
        <input
          type="text"
          {...formhandle.register('text')}
          disabled={addPost.isLoading}
        />
        <br />
        <input type="submit" disabled={addPost.isLoading} />
        {addPost.error && (
          <p style={{ color: 'red' }}>{addPost.error.message}</p>
        )}
      </form>
    </>
  );
};

export default IndexPage;

/**
 * If you want to statically render this page
 * - Export `appRouter` & `createContext` from [trpc].ts
 * - Make the `opts` object optional on `createContext()`
 *
 * @link https://trpc.io/docs/ssg
 */
// export const getStaticProps = async (
//   context: GetStaticPropsContext<{ filter: string }>,
// ) => {
//   const ssg = createSSGHelpers({
//     router: appRouter,
//     ctx: await createContext(),
//   });
//
//   await ssg.fetchQuery('post.all');
//
//   return {
//     props: {
//       trpcState: ssg.dehydrate(),
//       filter: context.params?.filter ?? 'all',
//     },
//     revalidate: 1,
//   };
// };
