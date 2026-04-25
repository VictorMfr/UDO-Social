"use client";

import Profile from "@/components/FeedPage/Profile";
import Inbox from "@/components/FeedPage/Inbox/Inbox";
import UserProvider from "@/context/UserProvider";
import Feed from "@/components/FeedPage/Feed/Feed";

export default function FeedPage() {
  return (
    <UserProvider>
      <div className="min-h-screen bg-gray-100">
        {/* Contenedor principal con Grid */}
        <main className="mx-auto py-6 px-4 grid grid-cols-1 md:grid-cols-12 gap-6">

          {/* COLUMNA IZQUIERDA: PERFIL (Ocupa 1 de 3 columnas) */}
          <aside className="hidden md:block col-span-3">
            <Profile />
          </aside>

          {/* COLUMNA DERECHA: FEED (Ocupa 2 de 3 columnas) */}
          <section className="md:col-span-6 space-y-6">
            <Feed />
          </section>

          {/* COLUMNA DERECHA: CHATS */}
          <aside className="hidden lg:block col-span-3">
            <Inbox/>
          </aside>
        </main>
      </div>
    </UserProvider>
  );
}