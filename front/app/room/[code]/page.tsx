import { redis } from "@/lib/redis";
import ChatRoom from "@/components/ChatRoom";
import Link from "next/link";

interface Props {
  params: Promise<{ code: string }>;
}

export default async function RoomPage({ params }: Props) {
  const { code } = await params;
  const upper = code.toUpperCase();
  const raw = await redis.get<string>(`room:${upper}`);
  const room = raw ? (typeof raw === "string" ? JSON.parse(raw) : raw) : null;

  if (!room) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <div className="bg-white rounded-lg shadow p-8 text-center max-w-sm">
          <div className="text-4xl mb-4">🔒</div>
          <h1 className="text-lg font-semibold mb-2">방을 찾을 수 없습니다</h1>
          <p className="text-sm text-gray-500 mb-4">
            존재하지 않거나 만료된 초대코드입니다.
          </p>
          <Link href="/" className="text-sm text-green-600 hover:underline">
            공개 채팅방으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return <ChatRoom roomId={upper} />;
}
