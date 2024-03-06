import { NavBar } from '@/components/NavBar';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <NavBar />
    </main>
  );
}
