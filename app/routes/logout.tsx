import { LoaderFunction } from '@remix-run/node';
import { destroySession } from '~/utils/session.server';

export const loader: LoaderFunction = ({ request }) => {
  return destroySession(request, '/')
};
