import { prisma } from '@/db';
import {
  GetServerSideProps,
  GetStaticProps,
  GetStaticPropsContext,
  NextPage,
} from 'next';
import { Kopi } from '@prisma/client';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { darcula } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { css, tw } from 'twind';
import Head from 'next/head';

type Props = {
  kopi: Kopi | null;
};

const style = css`
  @apply min-h-screen w-screen flex flex- [ 1 _0_auto ];

  #kopi > pre {
    @apply w-full !my-0 !bg-[#161b22];
  }
`;

const Page: NextPage<Props> = ({ kopi }: Props) => {
  return (
    <main id="kopi" className={tw(style)}>
      <Head>
        <title>{kopi?.title || 'Kopi could not have been found'}</title>
      </Head>
      <SyntaxHighlighter
        showLineNumbers={true}
        language="typescript"
        style={darcula}
      >
        {kopi?.content}
      </SyntaxHighlighter>
    </main>
  );
};

export const getStaticProps: GetStaticProps<Props> = async (
  content: GetStaticPropsContext,
) => {
  const { id } = content.params as { id: string };
  const kopi = await prisma.kopi.findFirst({
    where: {
      id: {
        equals: id,
      },
    },
  });
  console.log(kopi);
  return {
    props: {
      kopi: JSON.parse(JSON.stringify(kopi)),
    },
    revalidate: 60,
  };
};

export const getStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export default Page;
