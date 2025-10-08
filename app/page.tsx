// app/page.tsx
'use client';

import Link from 'next/link';
import { useQueryClient } from '@tanstack/react-query';
import { fetchPosts, fetchComments } from '@/lib/api';
import { useState, useEffect } from 'react';

export default function Home() {
  const queryClient = useQueryClient();
  const [prefetchState, setPrefetchState] = useState<{
    loading: boolean;
    time: number;
    done: boolean;
  }>({ loading: false, time: 0, done: false });

  const [loadingPages, setLoadingPages] = useState<Record<string, number>>({});

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (prefetchState.loading) {
      const start = Date.now();
      interval = setInterval(() => {
        setPrefetchState((prev) => ({ ...prev, time: Date.now() - start }));
      }, 10);
    } else {
      setPrefetchState((prev) => ({ ...prev, time: 0 }));
    }
    return () => clearInterval(interval);
  }, [prefetchState.loading]);

  useEffect(() => {
    const timers: Record<string, NodeJS.Timeout> = {};

    Object.keys(loadingPages).forEach((page) => {
      const start = Date.now();
      timers[page] = setInterval(() => {
        setLoadingPages((prev) => ({
          ...prev,
          [page]: Date.now() - start,
        }));
      }, 10);
    });

    return () => {
      Object.values(timers).forEach((timer) => clearInterval(timer));
    };
  }, [Object.keys(loadingPages).join(',')]);

  const handlePrefetch = async () => {
    if (prefetchState.loading || prefetchState.done) return;

    setPrefetchState({ loading: true, time: 0, done: false });

    await Promise.all([
      queryClient.prefetchQuery({ queryKey: ['posts'], queryFn: fetchPosts }),
      queryClient.prefetchQuery({
        queryKey: ['comments'],
        queryFn: fetchComments,
      }),
    ]);

    setPrefetchState({ loading: false, time: 0, done: true });
  };

  const handleLinkClick = (page: string) => {
    setLoadingPages((prev) => ({ ...prev, [page]: 0 }));
  };

  return (
    <div className="p-8 max-w-2xl mx-auto font-sans">
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>

      <h1 className="text-3xl font-bold mb-2 text-[#191F28]">
        Next.js 렌더링 비교
      </h1>
      <p className="text-[#4E5968] mb-8">각 방식을 직접 체험해보세요</p>

      <div className="flex flex-col gap-3">
        {/* Pages Router */}
        <Link
          href="/pages-router-ssr"
          onClick={() => handleLinkClick('pages')}
          className="block p-6 bg-white border border-[#E5E8EB] rounded-xl no-underline text-inherit transition-all relative overflow-hidden"
        >
          {loadingPages['pages'] !== undefined && (
            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#E5E8EB]">
              <div
                className="h-full bg-[#FF6B6B] transition-all duration-100 linear"
                style={{
                  width: `${Math.min(
                    (loadingPages['pages'] / 6000) * 100,
                    100,
                  )}%`,
                }}
              />
            </div>
          )}

          <div className="flex justify-between items-center">
            <div>
              <div className="text-lg font-semibold mb-1 text-[#191F28]">
                Pages Router
              </div>
              <div className="text-sm text-[#8B95A1]">순차 실행</div>
            </div>
            {loadingPages['pages'] !== undefined ? (
              <div
                className="text-2xl font-bold text-[#FF6B6B] font-mono"
                style={{ animation: 'pulse 1s infinite' }}
              >
                {(loadingPages['pages'] / 1000).toFixed(1)}s
              </div>
            ) : (
              <div className="text-xl text-[#FF6B6B]">~6s</div>
            )}
          </div>
        </Link>

        {/* App Router Basic */}
        <Link
          href="/app-router-basic"
          onClick={() => handleLinkClick('basic')}
          className="block p-6 bg-white border border-[#E5E8EB] rounded-xl no-underline text-inherit transition-all relative overflow-hidden"
        >
          {loadingPages['basic'] !== undefined && (
            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#E5E8EB]">
              <div
                className="h-full bg-[#FFA726] transition-all duration-100 linear"
                style={{
                  width: `${Math.min(
                    (loadingPages['basic'] / 6000) * 100,
                    100,
                  )}%`,
                }}
              />
            </div>
          )}

          <div className="flex justify-between items-center">
            <div>
              <div className="text-lg font-semibold mb-1 text-[#191F28]">
                App Router Basic
              </div>
              <div className="text-sm text-[#8B95A1]">순차 실행</div>
            </div>
            {loadingPages['basic'] !== undefined ? (
              <div
                className="text-2xl font-bold text-[#FFA726] font-mono"
                style={{ animation: 'pulse 1s infinite' }}
              >
                {(loadingPages['basic'] / 1000).toFixed(1)}s
              </div>
            ) : (
              <div className="text-xl text-[#FFA726]">~6s</div>
            )}
          </div>
        </Link>

        {/* App Router Suspense */}
        <Link
          href="/app-router-suspense"
          onClick={() => handleLinkClick('suspense')}
          className="block p-6 bg-white border border-[#E5E8EB] rounded-xl no-underline text-inherit transition-all relative overflow-hidden"
        >
          {loadingPages['suspense'] !== undefined && (
            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#E5E8EB]">
              <div
                className="h-full bg-[#4CAF50] transition-all duration-100 linear"
                style={{
                  width: `${Math.min(
                    (loadingPages['suspense'] / 3000) * 100,
                    100,
                  )}%`,
                }}
              />
            </div>
          )}

          <div className="flex justify-between items-center">
            <div>
              <div className="text-lg font-semibold mb-1 text-[#191F28]">
                App Router + Suspense
              </div>
              <div className="text-sm text-[#8B95A1]">병렬 실행 • 스트리밍</div>
            </div>
            {loadingPages['suspense'] !== undefined ? (
              <div
                className="text-2xl font-bold text-[#4CAF50] font-mono"
                style={{ animation: 'pulse 1s infinite' }}
              >
                {(loadingPages['suspense'] / 1000).toFixed(1)}s
              </div>
            ) : (
              <div className="text-xl text-[#4CAF50]">~3s</div>
            )}
          </div>
        </Link>

        {/* TanStack Query */}
        <Link
          href="/app-router-tanstack"
          onClick={() => handleLinkClick('tanstack')}
          onMouseEnter={handlePrefetch}
          className={`block p-6 border rounded-xl no-underline text-inherit transition-all relative overflow-hidden ${
            prefetchState.done
              ? 'bg-[#F0F4FF] border-[#3182F6]'
              : 'bg-white border-[#E5E8EB]'
          }`}
        >
          {prefetchState.loading && (
            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#E5E8EB]">
              <div
                className="h-full bg-[#3182F6] transition-all duration-100 linear"
                style={{
                  width: `${Math.min((prefetchState.time / 3000) * 100, 100)}%`,
                }}
              />
            </div>
          )}

          {loadingPages['tanstack'] !== undefined && (
            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#E5E8EB]">
              <div className="h-full w-full bg-[#3182F6]" />
            </div>
          )}

          <div className="flex justify-between items-center">
            <div>
              <div className="text-lg font-semibold mb-1 text-[#191F28]">
                TanStack Query
              </div>
              <div className="text-sm text-[#8B95A1]">
                {prefetchState.loading
                  ? 'Prefetching...'
                  : prefetchState.done
                  ? '캐시 완료 • 즉시 표시'
                  : '마우스 올려서 Prefetch'}
              </div>
            </div>
            {prefetchState.loading ? (
              <div
                className="text-2xl font-bold text-[#3182F6] font-mono"
                style={{ animation: 'pulse 1s infinite' }}
              >
                {(prefetchState.time / 1000).toFixed(1)}s
              </div>
            ) : loadingPages['tanstack'] !== undefined ? (
              <div className="text-2xl font-bold text-[#3182F6] font-mono">
                0.0s
              </div>
            ) : prefetchState.done ? (
              <div className="text-xl text-[#3182F6]">✓ 0s</div>
            ) : (
              <div className="text-xl text-[#3182F6]">~3s</div>
            )}
          </div>
        </Link>

        {/* Client Only */}
        <Link
          href="/client-only-fetch"
          onClick={() => handleLinkClick('client')}
          className="block p-6 bg-white border border-[#E5E8EB] rounded-xl no-underline text-inherit transition-all relative overflow-hidden"
        >
          {loadingPages['client'] !== undefined && (
            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#E5E8EB]">
              <div
                className="h-full bg-[#9E9E9E] transition-all duration-100 linear"
                style={{
                  width: `${Math.min(
                    (loadingPages['client'] / 3000) * 100,
                    100,
                  )}%`,
                }}
              />
            </div>
          )}

          <div className="flex justify-between items-center">
            <div>
              <div className="text-lg font-semibold mb-1 text-[#191F28]">
                Client-Only Fetch
              </div>
              <div className="text-sm text-[#8B95A1]">비교용</div>
            </div>
            {loadingPages['client'] !== undefined ? (
              <div
                className="text-2xl font-bold text-[#9E9E9E] font-mono"
                style={{ animation: 'pulse 1s infinite' }}
              >
                {(loadingPages['client'] / 1000).toFixed(1)}s
              </div>
            ) : (
              <div className="text-xl text-[#9E9E9E]">~3s</div>
            )}
          </div>
        </Link>
      </div>
    </div>
  );
}
