import { redirect } from 'next/navigation';

export default function Home() {
  // Automatically redirect from root path to /login
  redirect('/login');
}
