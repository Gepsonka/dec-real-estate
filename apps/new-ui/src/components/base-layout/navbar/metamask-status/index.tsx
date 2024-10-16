import { Button } from "@/components/ui/button";
import { Unplug, Wallet } from "lucide-react";
import { useAccount, useBalance, useConnect, useDisconnect } from "wagmi";
import { metaMask } from "wagmi/connectors";

export function MetamaskStatus() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();

  if (!isConnected) {
    return (
      <Button
        className="metamask-button"
        onClick={() => connect({ connector: metaMask() })}
      >
        Connect to MetaMask
      </Button>
    );
  }

  return <DisplayEthBalance address={address!} />;
}

function DisplayEthBalance(props: { address: `0x${string}` }) {
  const { disconnect } = useDisconnect();
  const result = useBalance({
    address: props.address,
  });

  return (
    <div className="wallet-balance-container">
      <Wallet />
      <span>{result.data?.formatted.toString()}</span>
      <Button onClick={() => disconnect()} variant={"outline"}>
        <Unplug className="mr-3" size={"20px"} /> Disconnect
      </Button>
    </div>
  );
}
