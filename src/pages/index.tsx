import LoadingOverlay from 'react-loading-overlay';

import dynamic from 'next/dynamic';
import React, { Ref, useEffect, useRef, useState } from 'react';
import { Kopi, Syntax } from '@prisma/client';
import { useRouter } from 'next/router';

const CodeEditor = dynamic(() => import('@uiw/react-textarea-code-editor'), {
  ssr: false,
});

function HomePage() {
  const [code, setCode] = React.useState('');
  const [language, setLanguage] = useState('tsx');
  const [kopi, setKopi] = useState<Kopi>();
  const [loading, setLoading] = useState(false);
  const [loop, setLoop] = useState(0);
  const [speed, setSpeed] = useState(150);
  const [blink, setBlink] = useState('');

  const [placeholder, setPlaceholder] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const editor = useRef<HTMLTextAreaElement>();
  const languages = Object.keys(Syntax);

  const i: number = loop % languages.length;
  const fullText: string = languages[i];

  const handleTyping = () => {
    setPlaceholder(
      isDeleting
        ? fullText.substring(0, placeholder.length - 1)
        : fullText.substring(0, placeholder.length + 1),
    );

    setSpeed(isDeleting ? 40 : 170);

    if (!isDeleting && placeholder === fullText) {
      setTimeout(() => setIsDeleting(true), 500);
    } else if (isDeleting && placeholder === '') {
      setIsDeleting(false);
      setLoop(loop + 1);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      handleTyping();
    }, speed);
    return () => clearTimeout(timer);
  });

  useEffect(() => {
    setTimeout(() => {
      setBlink(blink === '|' ? '' : '|');
    }, 540);
  }, [blink]);
  useEffect(() => {
    document.documentElement.setAttribute('data-color-mode', 'dark');
    console.log(languages);
  }, []);

  const router = useRouter();
  useEffect(() => {
    if (!kopi?.id) return;
    console.log('Redirecting...');
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
        placeholder={`Paste ${placeholder}${blink} here and press ctrl + s to create a kopi`}
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
