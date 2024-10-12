import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import { NAV_MENU_ITEMS } from "./constants";
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";

export function NavbarNavigationLinks() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        {NAV_MENU_ITEMS.map((menuItem) => (
          <NavigationMenuItem key={menuItem.title}>
            <Link href={menuItem.href} legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                {menuItem.title}
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
