// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/db';
import { Syntax } from '@prisma/client';

type RequestData = {
  title: string;
  content: string;
  syntax: Syntax;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    const { title, content, syntax }: RequestData = req.body;
    console.log(content);
    console.log(syntax);
    console.log(title);
    if (content && syntax && title) {
      const kopi = await prisma.kopi.create({
        data: {
          title,
          content,
          syntax,
        },
      });
      await fetch(
        `https://kopi.fusioncoding.dev/api/revalidate?secret=${process.env.REVALIDATE_SECRET}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            path: `/share/${kopi.id}`,
          }),
        },
      );
      res.status(200).json(kopi);
    } else {
      res.status(400).json({ error: 'Missing title, content or syntax' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
