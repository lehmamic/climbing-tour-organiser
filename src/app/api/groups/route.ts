import { GROUPS_COLLECTION_NAME, Group } from '@/model/group';
import { Paged } from '@/model/paged';
import { MONGODB_DATABASE, clientPromise } from '@/lib/mongodb';
import { getGroups } from '@/services/groups.service';
import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0';
import { NextRequest, NextResponse } from 'next/server';

export const GET = withApiAuthRequired(async (req: NextRequest) => {
  req.nextUrl.searchParams.get('take') as string;

  const skip = parseInt(req.nextUrl.searchParams.get('skip') ?? '0') ?? 10;
  const take = parseInt(req.nextUrl.searchParams.get('take') ?? '10') ?? 10;

  const groups = await getGroups(skip, take);

  const res = new NextResponse();
  return NextResponse.json(groups, res);
});

export const POST = withApiAuthRequired(async (req: NextRequest) => {
  const res = new NextResponse();
  const { user } = (await getSession(req, res)) || {};

  const dto = await req.json();
  const group: Group = {
    _id: undefined!,
    name: dto.name,
    description: dto.description,
    members: [],
  };

  const client = await clientPromise;
  const db = client.db('ClimbingTourOrganiser');
  const result = await db.collection(GROUPS_COLLECTION_NAME).insertOne(group);

  return NextResponse.json({ ...group, _id: result.insertedId }, res);
});
