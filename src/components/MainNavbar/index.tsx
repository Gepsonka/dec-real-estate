import React, { useContext, useEffect } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
} from "@nextui-org/react";
import { ThemeContext } from "@/contexts";
import { clientURLs } from "@/utils";
import { LucideLink, MoonStar, Sun } from "lucide-react";
import {
  useMetamaskExtensionInstallModalStore,
  useMetamaskWalletStore,
  useMetamaskWrongChainIDModalStore,
} from "@/stores";
import Image from "next/image";
import { ethers } from "ethers";
import { useAccount, useBalance, useConnect } from "wagmi";
import { metaMask } from "@wagmi/connectors";

export const MainNavbar = () => {
  const themeContext = useContext(ThemeContext);
  const { connect, status, error } = useConnect();
  const account = useAccount();
  const accountBalance = useBalance({ address: account.address });

  const metamaskExtensionInstallModalStore =
    useMetamaskExtensionInstallModalStore();
  const metamaskWrongChainIDModalStore = useMetamaskWrongChainIDModalStore();

  const themeChangeHandler = (event: React.MouseEvent) => {
    themeContext.setTheme(themeContext.theme === "light" ? "dark" : "light");
  };

  const convertEthBalanceToDecimal = (balance: string) => {
    return ethers.formatEther(balance);
  };

  useEffect(() => {
    console.log("Connecting status: ", status);
    console.log("Connecting error (if any): ", error);

    console.log("Account: ", account);
  }, [status]);

  const renderAccountInfo = () => {
    if (status === "success" || account.isConnected) {
      return (
        <div className="flex">
          <span className="my-auto">
            {convertEthBalanceToDecimal(
              accountBalance.data?.value.toString() ?? "0x0"
            )}
          </span>
          <Image
            alt={"Ethereum Logo"}
            src={"/ethereum-logo.svg"}
            width={30}
            height={30}
          />
        </div>
      );
    } else if (status === "pending") {
      return (
        <Button variant="shadow" color="primary" isLoading>
          Connecting...
        </Button>
      );
    } else if (status === "error" || account.isDisconnected) {
      return (
        <Button
          variant="shadow"
          color="primary"
          startContent={<LucideLink />}
          onClick={() => connect({ connector: metaMask() })}
        >
          Link Metamask
        </Button>
      );
    }
  };

  return (
    <Navbar className={`${themeContext.theme} text-foreground bg-background`}>
      <NavbarBrand>
        <Link className="brandname" href={clientURLs.home}>
          Dec Real Estate
        </Link>
      </NavbarBrand>
      <NavbarContent className="navbar-link" justify="center">
        <NavbarItem>
          <Link href={clientURLs.home}>Home</Link>
        </NavbarItem>
        <NavbarItem>
          <Link href={clientURLs.about}>About</Link>
        </NavbarItem>
        <NavbarItem>
          <Link href={clientURLs.contact}>Contact</Link>
        </NavbarItem>
        <NavbarItem>
          <Link href={clientURLs.marketplace}>Marketplace</Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem>
          <Button variant="light" onClick={themeChangeHandler} isIconOnly>
            {themeContext.theme === "light" ? (
              <Sun color="#ff080f" />
            ) : (
              <MoonStar color="#ffffff" />
            )}
          </Button>
        </NavbarItem>
        <NavbarItem>{renderAccountInfo()}</NavbarItem>
      </NavbarContent>
    </Navbar>
  );
};
