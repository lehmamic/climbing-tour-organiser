import { ObjectId } from 'mongodb';

export const USERS_COLLECTION_NAME = 'users';

export interface User {
  _id: ObjectId;
  sub: string;
  name: string;
  email: string;
}
