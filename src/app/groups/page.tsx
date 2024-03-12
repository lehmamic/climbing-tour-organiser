import { LinkButton } from '@/components/LinkButton';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Paged } from '../../model/paged';
import { Group } from '../../model/group';
import { getGroups } from '@/services/groups.service';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { NextPage } from 'next';
import Link from 'next/link';

const GroupsPage: NextPage = withPageAuthRequired(async () => {
  const groups: Paged<Group> = await getGroups(0, 10);

  return (
    <main className="flex min-h-screen flex-col sm:container sm:mx-auto">
      <h1>My groups</h1>
      <div className="flex flex-row flex-wrap gap-4">
        {groups.data.map((g) => (
          <Link key={g._id.toString()} href={`/groups/${g._id}`}>
            <Card className="h-60 w-60">
              <CardHeader>
                <CardTitle>{g.name}</CardTitle>
                <CardDescription>{g.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
      <LinkButton variant={'default'} href={'/create'}>
        Create new group
      </LinkButton>
    </main>
  );
});

export default GroupsPage;
