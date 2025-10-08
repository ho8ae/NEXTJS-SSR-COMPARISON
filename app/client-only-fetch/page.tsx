// app/client-only-fetch/page.tsx

import Link from 'next/link';
import { ClientOnlyPosts } from './ClientOnlyPosts';

export default function ClientOnlyPage() {
  return (
    <div className="p-8 max-w-2xl mx-auto font-sans">
      <Link
        href="/"
        className="inline-block mb-6 text-[#3182F6] no-underline text-sm"
      >
        ← 돌아가기
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-[#191F28]">
          Client-Only Fetch
        </h1>
        <div className="inline-block px-4 py-2 bg-gray-100 rounded-lg text-xl font-bold text-gray-600 font-mono">
          비교용
        </div>
      </div>

      {/* 설명 */}
      <div className="bg-white border border-[#E5E8EB] rounded-xl p-6 mb-4">
        <div className="text-base font-semibold mb-4 text-[#191F28]">
          TanStack Query와 비교
        </div>

        <div className="flex flex-col gap-3">
          <div className="p-3 bg-red-50 rounded-lg text-sm text-[#4E5968]">
            <div className="font-semibold mb-1 text-red-600">매번 3초 대기</div>
            캐시 없음 → 방문할 때마다 다시 fetch
          </div>

          <div className="p-3 bg-[#F0F4FF] rounded-lg text-sm text-[#4E5968]">
            <div className="font-semibold mb-1 text-[#3182F6]">
              TanStack Query
            </div>
            첫 방문 3초 → 재방문 0초 (캐시 사용)
          </div>
        </div>
      </div>

      <ClientOnlyPosts />
    </div>
  );
}
