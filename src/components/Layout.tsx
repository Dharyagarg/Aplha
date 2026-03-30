import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { AIChat } from './AIChat';
import { Toaster } from 'sonner';

export function Layout() {
  return (
    <div className="min-h-screen bg-background text-foreground pb-16 md:pb-0">
      <Navbar />
      <main className="pt-16 min-h-[calc(100vh-4rem)]">
        <Outlet />
      </main>
      <AIChat />
      <Toaster theme="dark" position="top-center" toastOptions={{
        className: 'glass border-gold-500/20 text-white'
      }} />
    </div>
  );
}
