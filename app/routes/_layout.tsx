import * as React from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem
} from "@nextui-org/navbar";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem
} from "@nextui-org/dropdown";
import { Button } from "@nextui-org/button";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { LoaderFunction, json } from "@remix-run/node";
import { getCurrentUser, getUserSession } from "~/utils/session.server";
import { Avatar } from "@nextui-org/react";

export const loader: LoaderFunction = async ({ request }) => {
  const sessionUser = await getUserSession(request);
  if (!sessionUser) {
    return null;
  }

  const user = await getCurrentUser(sessionUser);
  if (!user) {
    return null;
  }

  return json(user);
};

const NavbarLayout: React.FunctionComponent = () => {
  const user = useLoaderData<typeof loader>();

  return (
    <div>
      <Navbar>
        <NavbarBrand>
          {/* <AcmeLogo /> */}
          <p className="font-bold text-inherit">ACME</p>
        </NavbarBrand>
        {!user && (
          <NavbarContent justify="end">
            <NavbarItem className="lg:flex">
              <Link to="/login">Login</Link>
            </NavbarItem>
            <NavbarItem>
              <Button as={Link} color="primary" href="/signup" variant="flat">
                Sign Up
              </Button>
            </NavbarItem>
          </NavbarContent>
        )}
        {user && (
          <NavbarContent justify="end">
            <NavbarItem>
            <Dropdown>
              <DropdownTrigger>
                <Avatar src={user.imageUrl} name={user.displayName}></Avatar>
              </DropdownTrigger>
              <DropdownMenu aria-label="Static Actions">
                <DropdownItem key="groups" showDivider>
                  <Link to={'/groups'}>Groups</Link>
                </DropdownItem>
                <DropdownItem key="logout">
                  <Link to={'/logout'}>Log out</Link>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
            </NavbarItem>
          </NavbarContent>
        )}
      </Navbar>
      <Outlet />
    </div>
  );
};

export default NavbarLayout;
