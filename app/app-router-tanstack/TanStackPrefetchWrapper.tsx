// app/app-router-tanstack/TanStackPrefetchWrapper.tsx
// ❌ 'use client' 없음 → 서버 컴포넌트!
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { fetchPosts, fetchComments } from '@/lib/api';
import { TanStackContent } from './TanStackContent';

export async function TanStackPrefetchWrapper() {
  const queryClient = new QueryClient();

  console.log('🔄 [TanStack] Prefetching 시작...');
  
  // 병렬로 prefetch
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ['posts'],
      queryFn: fetchPosts,
    }),
    queryClient.prefetchQuery({
      queryKey: ['comments'],
      queryFn: fetchComments,
    }),
  ]);
  
  console.log('✅ [TanStack] Prefetch 완료 - dehydrate 시작');

  // dehydrated state를 Client Component로 전달
  return <TanStackContent dehydratedState={dehydrate(queryClient)} />;
}