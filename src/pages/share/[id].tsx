import { prisma } from '@/db';
import {
  GetServerSideProps,
  GetStaticProps,
  GetStaticPropsContext,
  NextPage,
} from 'next';
import { Kopi } from '@prisma/client';
import { css, tw } from 'twind';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import '@uiw/react-textarea-code-editor/dist.css';

type Props = {
  kopi: Kopi | null;
};

const style = css`
  @apply min-h-screen w-screen flex flex- [ 1 _0_auto ];

  #kopi > pre {
    @apply w-full !my-0 !bg-[#161b22];
  }
`;

const CodeEditor = dynamic(() => import('@uiw/react-textarea-code-editor'), {
  ssr: false,
});

const Page: NextPage<Props> = ({ kopi }: Props) => {
  useEffect(() => {
    document.documentElement.setAttribute('data-color-mode', 'dark');
  }, []);
  return (
    <main id="kopi">
      <Head>
        <title>{kopi?.title || 'Kopi could not have been found'}</title>
      </Head>
      <CodeEditor
        value={kopi?.content}
        language={kopi?.syntax}
        readOnly
        padding={15}
        style={{
          fontSize: 14,
          fontFamily:
            'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
          minHeight: '100vh',
        }}
      />
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
