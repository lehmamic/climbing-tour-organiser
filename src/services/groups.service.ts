import { GROUPS_COLLECTION_NAME, Group, GroupMemberRole } from '@/model/group';
import { Paged } from '@/model/paged';
import { MONGODB_DATABASE, clientPromise } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { USERS_COLLECTION_NAME, User } from '@/model/user';
import { getSession } from '@auth0/nextjs-auth0';

export const getGroup = async (id: string | undefined): Promise<Group | null> => {
  if (!id || !ObjectId.isValid(id)) {
    return null;
  }

  const { user } = await getSession() || {};

  const client = await clientPromise;
  const db = client.db(MONGODB_DATABASE);

  const result = await db
    .collection<Group>(GROUPS_COLLECTION_NAME)
    .aggregate<Group>([
      { $match: { _id: new ObjectId(id) } },
      { $unwind: "$members" },
      {
        $lookup: {
          from: "users",
          localField: "members.userId",
          foreignField: "_id",
          as: "members.user"
        }
      },
      { $unwind: "$members.user" },
      {
        $group: {
          _id: "$_id",
          name: { $first: "$name" },
          description: { $first: "$description" },
          members: { $push: "$members" }
        }
      },
      { $match: { "members.user.sub": user?.sub } },
    ])
    .toArray();

  return result.length > 0 ? result[0] : null;
};

export const getGroups = async (skip: number, take: number): Promise<Paged<Group>> => {
  const { user } = await getSession() || {};

  const client = await clientPromise;
  const db = client.db(MONGODB_DATABASE);
  const result = await db
    .collection<Group>(GROUPS_COLLECTION_NAME)
    .aggregate<Paged<Group>>([
      { $unwind: "$members" },
      {
        $lookup: {
          from: USERS_COLLECTION_NAME,
          localField: "members.userId",
          foreignField: "_id",
          as: "members.user",
        }
      },
      { $unwind: "$members.user" },
      {
        $group: {
          _id: "$_id",
          name: { $first: "$name" },
          description: { $first: "$description" },
          members: { $push: "$members" },
        }
      },
      { $match: { "members.user.sub": user?.sub } },
      // { "$match": filter},
      {
        $facet: {
          data: [{ $match: {} }, { $skip: skip }, { $limit: take }],
          totalCount: [{ $count: 'count' }],
        },
      },
      {
        $addFields: {
          totalCount: {
            $first: '$totalCount.count',
          },
        },
      },
    ])
    .toArray();

  return result[0];
};

export const createGroup = async (claims: { sub: string; }, name: string, description?: string): Promise<Group> => {
  const client = await clientPromise;
  const db = client.db(MONGODB_DATABASE);

  const user = await db.collection<User>(USERS_COLLECTION_NAME)
    .findOne({ sub: claims.sub });

  const group: Group = {
    _id: undefined!,
    name,
    description,
    members: [
      {
        userId: user?._id!,
        role: GroupMemberRole.Owner,
      }
    ],
  };

  const result = await db.collection<Group>(GROUPS_COLLECTION_NAME)
    .insertOne(group);

  return { ...group, _id: result.insertedId };
}
