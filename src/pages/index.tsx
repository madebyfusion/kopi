import Head from 'next/head';
import Image from 'next/image';

import styles from '@/styles/Home.module.css';
import { css, style, tw } from 'twind';
import { styled } from '../types/styled';
import { Button } from '../components';
import LoadingOverlay from 'react-loading-overlay';

import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
import '@uiw/react-textarea-code-editor/dist.css';
import { TextareaCodeEditorProps } from '@uiw/react-textarea-code-editor';
import { Kopi } from '@prisma/client';
import { useRouter } from 'next/router';

const CodeEditor = dynamic(() => import('@uiw/react-textarea-code-editor'), {
  ssr: false,
});

function HomePage() {
  const [code, setCode] = React.useState('');
  const [language, setLanguage] = useState('tsx');
  const [kopi, setKopi] = useState<Kopi>();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    document.documentElement.setAttribute('data-color-mode', 'dark');
  }, []);
  const router = useRouter();
  useEffect(() => {
    if (!kopi?.id) return;
    console.log('Redirecting...');
    window.history.replaceState(null, 'Redirecting...', '/share/' + kopi.id);
    router.push({
      pathname: '/share/[id]',
      query: { id: kopi.id },
    });
  }, [kopi, router]);
  return (
    <LoadingOverlay active={loading} spinner>
      <CodeEditor
        value={code}
        language={language}
        placeholder={`Please enter ${(
          language || ''
        ).toLocaleUpperCase()} code.`}
        onChange={(evn) => setCode(evn.target.value)}
        onKeyDown={(event) => {
          if (kopi) return;
          //Implement save feature
          if (!(event.ctrlKey && event.key === 's')) return;
          event.preventDefault();
          console.log('Save code');
          setLoading(true);
          const body = {
            title: 'New Kopi',
            syntax: language,
            content: code,
          };
          const saveKopi = async () => {
            const res = await fetch('/api/add', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(body),
            });
            const newKopi: Kopi = await res.json();
            console.log('Setting new Kopi!');
            setKopi(newKopi);
          };
          saveKopi();
        }}
        padding={15}
        style={{
          fontSize: 14,
          fontFamily:
            'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
          minHeight: '100vh',
        }}
      />
    </LoadingOverlay>
  );
}

export default HomePage;
