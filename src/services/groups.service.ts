import { GROUPS_COLLECTION_NAME, Group } from '@/model/group';
import { Paged } from '@/model/paged';
import { MONGODB_DATABASE, clientPromise } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export const getGroup = async (id: string | undefined): Promise<Group | null> => {
  if (!id || !ObjectId.isValid(id)) {
    return null;
  }

  const client = await clientPromise;
  const db = client.db(MONGODB_DATABASE);

  var result = await db.collection<Group>(GROUPS_COLLECTION_NAME).findOne({ _id: new ObjectId(id) });

  return result;
};

export const getGroups = async (skip: number, take: number): Promise<Paged<Group>> => {
  const client = await clientPromise;
  const db = client.db(MONGODB_DATABASE);
  const result = await db
    .collection<Group>(GROUPS_COLLECTION_NAME)
    .aggregate<Paged<Group>>([
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
