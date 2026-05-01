"use client";

import Profile from "@/components/FeedPage/Profile";
import Feed from "@/components/FeedPage/Feed/Feed";
import InboxCard from "@/features/chat/components/InboxCard";
import Tools from "@/features/tools/Tools";

export default function FeedPage() {
  return (
      <div className="min-h-screen bg-gray-100">
        {/* Contenedor principal con Grid */}
        <main className="mx-auto py-6 px-4 grid grid-cols-1 md:grid-cols-12 gap-6">

          {/* COLUMNA IZQUIERDA: PERFIL (Ocupa 1 de 3 columnas) */}
          <aside className="hidden md:block col-span-3 sticky top-10">
            <Profile />
            <Tools/>
          </aside>

          {/* COLUMNA DERECHA: FEED (Ocupa 2 de 3 columnas) */}
          <section className="md:col-span-6 space-y-6">
            <Feed />
          </section>

          {/* COLUMNA DERECHA: CHATS */}
          <aside className="hidden lg:block col-span-3">
            <InboxCard/>
          </aside>
        </main>
      </div>
  );
}