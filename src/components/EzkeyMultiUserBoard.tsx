import { useEffect, useState } from "react";
import { ethers } from "ethers";

// --- Adresses et logos à adapter si besoin
const EZKEY_NFT =
  "0xbca0C59Ee51CaA9837EA2f05d541E9936738Ce6b";
const POL_ADDRESS =
  "0xC959164A681BA93a4fbF846dC5c86A20D1A85C7c";
const SUSHI_ADDRESS =
  "0x668731D0d7341F0163dEA0531d2848751713633D";
const EZOCH_ADDRESS =
  "0xb7E15E994270A6B251C51B9a7358E10ce0054cd2";
const TOKEN_IMAGES = {
  EZOCH:
    "https://ipfs.io/ipfs/QmWPd3FET5jeMGXkyETHCGkdwuiAvranxkbBcXiSoBwemP",
  POL: "https://ipfs.io/ipfs/bafkreidnthfocp3nx4msubtnnqaqrkecmt3zz772ufhpkostjthsvh7g5m",
  SUSHI:
    "https://ipfs.io/ipfs/QmajzGigJQkYMDDtfgWgzkbQhao2aKWbTf62PmZqTeJosc",
};
const LEVELS = ["Bronze", "Silver", "Gold"];
const ABI_ERC20 = [
  "function balanceOf(address) view returns (uint256)",
  "function decimals() view returns (uint8)",
];
const ABI_EZKEY = [
  "function holders(address) view returns (uint8 level,uint256 lastClaim)",
  "function tokenOfOwnerByIndex(address,uint256) view returns (uint256)",
  "function tokenURI(uint256) view returns (string)",
];
const DEMO_ADDRESSES = [
  "0x3EAD4A8bC39FF1fE7E17261b6c6492Cd8A16E26c",
  "0xcBa4e733563987b9582CcD0a9CbFD47265180BAC",
];
function formattedDate(ts) {
  return ts && Number(ts) > 0
    ? new Date(Number(ts) * 1000).toLocaleString()
    : "Jamais";
}
function UserSummary({ address, provider }) {
  const [tokenId, setTokenId] = useState();
  const [holderData, setHolderData] = useState({
    level: 0,
    lastClaim: 0,
  });
  const [tokenUri, setTokenUri] = useState("");
  const [pol, setPol] = useState("…");
  const [sushi, setSushi] = useState("…");
  const [ezoch, setEzoch] = useState("…");
  useEffect(() => {
    if (!provider || !address) return;
    (async () => {
      const s = await provider.getSigner();
      const nft = new ethers.Contract(
        EZKEY_NFT,
        ABI_EZKEY,
        s,
      );
      const tId = await nft
        .tokenOfOwnerByIndex(address, 0)
        .catch(() => null);
      setTokenId(tId ? tId.toString() : null);
      const data = await nft
        .holders(address)
        .catch(() => null);
      if (data)
        setHolderData({
          level: Number(data.level),
          lastClaim: Number(data.lastClaim),
        });
      if (tId !== null) nft.tokenURI(tId).then(setTokenUri);

      const polC = new ethers.Contract(
        POL_ADDRESS,
        ABI_ERC20,
        s,
      );
      const polBal = await polC.balanceOf(address);
      const polDecimals = await polC.decimals();
      setPol(ethers.formatUnits(polBal, polDecimals));
      const sushiC = new ethers.Contract(
        SUSHI_ADDRESS,
        ABI_ERC20,
        s,
      );
      const sushiBal = await sushiC.balanceOf(address);
      const sushiDecimals = await sushiC.decimals();
      setSushi(ethers.formatUnits(sushiBal, sushiDecimals));
      const ezochC = new ethers.Contract(
        EZOCH_ADDRESS,
        ABI_ERC20,
        s,
      );
      const ezochBal = await ezochC.balanceOf(address);
      const ezochDecimals = await ezochC.decimals();
      setEzoch(ethers.formatUnits(ezochBal, ezochDecimals));
    })();
  }, [provider, address]);
  return (
    <div
      style={{
        border: "1.5px solid #eaeaea",
        padding: 14,
        borderRadius: 10,
        marginBottom: 24,
      }}
    >
      <div style={{ fontWeight: "bold", fontSize: 15 }}>
        {address}
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 6,
          margin: "12px 0",
        }}
      >
        <div>
          <img
            src={TOKEN_IMAGES.EZOCH}
            style={{
              width: 18,
              marginRight: 4,
              verticalAlign: "middle",
            }}
          />
          <span style={{ fontSize: 13 }}>
            EZOCH: <b>{ezoch}</b>
          </span>
        </div>
        <div>
          <img
            src={TOKEN_IMAGES.POL}
            style={{
              width: 18,
              marginRight: 4,
              verticalAlign: "middle",
            }}
          />
          <span style={{ fontSize: 13 }}>
            POL: <b>{pol}</b>
          </span>
        </div>
        <div>
          <img
            src={TOKEN_IMAGES.SUSHI}
            style={{
              width: 18,
              marginRight: 4,
              verticalAlign: "middle",
            }}
          />
          <span style={{ fontSize: 13 }}>
            SUSHI: <b>{sushi}</b>
          </span>
        </div>
      </div>
      {tokenUri && (
        <div style={{ textAlign: "center" }}>
          <img
            src={tokenUri}
            alt="NFT"
            style={{ width: 104, margin: "4px auto" }}
          />
        </div>
      )}
      <div style={{ marginTop: 6 }}>
        <span>
          <b>Niveau NFT :</b>{" "}
          {LEVELS[holderData?.level || 0]}
        </span>
        {holderData?.lastClaim ? (
          <span
            style={{
              marginLeft: 12,
              fontSize: 13,
              color: "#666",
            }}
          >
            Dernier claim :{" "}
            {formattedDate(holderData?.lastClaim)}
          </span>
        ) : null}
      </div>
    </div>
  );
}

export function EzKeyMultiUserBoard() {
  const [provider, setProvider] = useState();
  const [addrList, setAddrList] = useState([
    ...DEMO_ADDRESSES,
  ]);
  const [addrInput, setAddrInput] = useState("");
  useEffect(() => {
    if (window.ethereum) {
      setProvider(
        new ethers.BrowserProvider(window.ethereum),
      );
    }
  }, []);
  function addAddress() {
    if (
      ethers.isAddress(addrInput) &&
      !addrList.includes(addrInput)
    ) {
      setAddrList([addrInput, ...addrList]);
      setAddrInput("");
    }
  }
  return (
    <div>
      <h3>🌍 Board multi-utilisateur Ez-Key</h3>
      <div style={{ marginBottom: 12 }}>
        <input
          style={{
            padding: 6,
            marginRight: 10,
            minWidth: 340,
          }}
          value={addrInput}
          onChange={(e) => setAddrInput(e.target.value)}
          placeholder="Entrer une adresse Ethereum à surveiller…"
        />
        <button onClick={addAddress}>
          Ajouter cette adresse
        </button>
      </div>
      {provider ? (
        addrList.map((addr) => (
          <UserSummary
            key={addr}
            address={addr}
            provider={provider}
          />
        ))
      ) : (
        <div>
          <button
            onClick={async () => {
              if (window.ethereum) {
                setProvider(
                  new ethers.BrowserProvider(
                    window.ethereum,
                  ),
                );
              }
            }}
            style={{ margin: "10px 0" }}
          >
            Se connecter (Metamask)
          </button>
        </div>
      )}
    </div>
  );
}
