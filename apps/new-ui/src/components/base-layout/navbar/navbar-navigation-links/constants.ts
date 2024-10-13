import { clientUrlPaths } from "@/utils/urls";
import { NavMenuItem } from "./types";

export const NAV_MENU_ITEMS: NavMenuItem[] = [
  {
    title: "Assets",
    href: clientUrlPaths.assets,
  },
  {
    title: "Marketplace",
    href: clientUrlPaths.marketplace,
  },
  {
    title: "Token Creation",
    href: clientUrlPaths.createToken,
  },
];
