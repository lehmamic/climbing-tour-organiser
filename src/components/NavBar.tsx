import { Button } from "@/components/ui/button";
import { useUser } from '@auth0/nextjs-auth0/client';
import { getSession, Claims } from '@auth0/nextjs-auth0';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuShortcut, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";

const avatarInitials = (name: string): string => {
  const myNames = name.split(" ");

  if (myNames.length >= 2) {
    const initials = myNames[0][0] + myNames[1][0];

    const nameInitials = initials.toUpperCase();
    return nameInitials;
  }

  return name[0]
}

const NavBar: React.FunctionComponent = async () => {
  // const { user, error, isLoading } = useUser();
  const { user } = await getSession() || {};

  return (
    <div className="flex items-center p-4">
      <div className="flex-auto" />
      {!user && (<><a href="/api/auth/login">Login</a>
        <Button>Register</Button></>)}
      {user && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar>
             <AvatarImage src={user.picture} alt="profile image" />
             <AvatarFallback>{avatarInitials(user.name)}</AvatarFallback>
          </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuItem>
              <a href="/api/auth/logout" className="flex">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
                {/* <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut> */}
              </a>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

      )}
    </div>
  );
};

export { NavBar };
