import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getGroup } from '@/services/groups.service';
import { getUserBySub } from '@/services/user.service';
import { getSession, withPageAuthRequired } from '@auth0/nextjs-auth0';
import { NextPage } from 'next';
import { notFound } from 'next/navigation';
import { GroupMember } from '@/components/group-member';

const GroupPage: NextPage = withPageAuthRequired(async ({ params }) => {
  const group = await getGroup(params?.id as string);
  if (!group) {
    notFound();
  }

  return (
    <main className="flex min-h-screen flex-col sm:container sm:mx-auto">
      <h1>{group.name}</h1>
      <Tabs defaultValue="about">
        <TabsList>
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
        </TabsList>
        <TabsContent value="about">
          {group.description}
        </TabsContent>
        <TabsContent value="members">
          <div className='flex flex-col'>
            {group.members.map(m => (
              <GroupMember key={m.userId.toString()} member={m} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </main>
  );
});

export default GroupPage;
