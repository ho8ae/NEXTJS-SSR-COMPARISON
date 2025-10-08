// app/app-router-tanstack/TanStackContent.tsx
'use client';

import { HydrationBoundary } from '@tanstack/react-query';
import { PostsList } from './PostsList';
import { CommentsList } from './CommentsList';

import type { DehydratedState } from '@tanstack/react-query';

interface TanStackContentProps {
  dehydratedState: DehydratedState | null | undefined;
}

export function TanStackContent({ dehydratedState }: TanStackContentProps) {
  return (
    <HydrationBoundary state={dehydratedState}>
      <div style={{ display: 'grid', gap: '1rem' }}>
        <PostsList />
        <CommentsList />
      </div>
    </HydrationBoundary>
  );
}
