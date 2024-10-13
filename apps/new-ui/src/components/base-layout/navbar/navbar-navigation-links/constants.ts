import { clientUrls } from "@/utils/urls";
import { NavMenuItem } from "./types";

export const NAV_MENU_ITEMS: NavMenuItem[] = [
  {
    title: "Assets",
    href: clientUrls.assets,
  },
  {
    title: "Marketplace",
    href: clientUrls.marketplace,
  },
  {
    title: "Token Creation",
    href: clientUrls.createToken,
  },
  {
    title: "Listing Creation",
    href: clientUrls.createListing,
  },
];
