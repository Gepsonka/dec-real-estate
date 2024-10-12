import { MetamaskStatus } from "./metamask-status";
import { NavbarNavigationLinks } from "./navbar-navigation-links";
import { PageTitle } from "./page-title";

export function Navbar() {
  return (
    <div className="navbar">
      <PageTitle pageTitle={"DecRealEstate"} />
      <NavbarNavigationLinks />
      <MetamaskStatus />
    </div>
  );
}
