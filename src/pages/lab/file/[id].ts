// Dev-only: serves a lab image from its original location on disk.
// In a production build there are no paths, so nothing is generated.
import type { APIRoute, GetStaticPaths } from 'astro';
import { readFile } from 'node:fs/promises';
import { games, fileId, type Kind } from '../../../lab/itch-covers';

export const getStaticPaths: GetStaticPaths = () => {
  if (!import.meta.env.DEV) return [];
  return games.flatMap((g) =>
    (Object.entries(g.files) as [Kind, string][]).map(([kind, path]) => ({
      params: { id: fileId(g, kind) },
      props: { path },
    })),
  );
};

export const GET: APIRoute = async ({ props }) => {
  try {
    const body = await readFile(props.path as string);
    return new Response(body, { headers: { 'content-type': 'image/png', 'cache-control': 'no-store' } });
  } catch {
    return new Response('not found', { status: 404 });
  }
};
