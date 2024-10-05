"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wagmiConfig = void 0;
const core_1 = require("@wagmi/core");
const hardhatLocal = defineChain({
    id: 31337,
    name: "Ethereum",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    rpcUrls: {
        default: {
            http: ["http://localhost:8545"],
        },
    },
    contracts: {
        RealEstate: {
            address: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
        },
    },
});
exports.wagmiConfig = (0, core_1.createConfig)({
    chains: [hardhatLocal],
    transports: {
        [hardhatLocal.id]: http(),
    },
    connectors: [metaMask(MetaMaskOptions)],
    ssr: true,
});
