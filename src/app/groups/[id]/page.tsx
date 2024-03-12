import { getGroup } from '@/services/groups.service';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { NextPage } from 'next';
import { notFound } from 'next/navigation';

const GroupPage: NextPage = withPageAuthRequired(async ({ params }) => {
  const group = await getGroup(params?.id as string);
  if (!group) {
    notFound();
  }

  return (
    <main className="flex min-h-screen flex-col sm:container sm:mx-auto">
      <h1>My groups</h1>
    </main>
  );
});

export default GroupPage;
