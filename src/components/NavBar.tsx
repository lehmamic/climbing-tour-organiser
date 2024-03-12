import { Button } from '@/components/ui/button';
import { useUser } from '@auth0/nextjs-auth0/client';
import { getSession } from '@auth0/nextjs-auth0';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { LinkButton } from '@/components/LinkButton';

const avatarInitials = (name: string): string => {
  const myNames = name.split(' ');

  if (myNames.length >= 2) {
    const initials = myNames[0][0] + myNames[1][0];

    const nameInitials = initials.toUpperCase();
    return nameInitials;
  }

  return name[0];
};

const NavBar: React.FunctionComponent = async () => {
  // const { user, error, isLoading } = useUser();
  const { user } = (await getSession()) || {};

  return (
    <div className="flex items-center border-b p-4">
      <div className="flex-auto" />
      {!user && (
        <>
          <Link href="/api/auth/login">Login</Link>
          <LinkButton href={'/api/auth/signup'} className="ml-4">
            Register
          </LinkButton>
        </>
      )}
      {user && (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="ml-4">
              <Avatar>
                <AvatarImage src={user.picture} alt="profile image" />
                <AvatarFallback>{avatarInitials(user.name)}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuItem>
                <Link href="/groups" className="flex">
                  <span>My groups</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link href="/api/auth/logout" className="flex">
                  <span>Log out</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      )}
    </div>
  );
};

export { NavBar };
