import { useEffect, useState } from "react";
import { ethers } from "ethers";

// Adresses des contrats sur Polygon (mets à jour ici si besoin)
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

// ABI ERC20 et NFT utilisées
const ABI_ERC20 = [
  "function balanceOf(address) view returns (uint256)",
  "function decimals() view returns (uint8)",
];
const ABI_EZKEY = [
  "function mintKey()",
  "function claimReward()",
  "function upgradeToSilver()",
  "function upgradeToGold()",
  "function holders(address) view returns (uint8 level,uint256 lastClaim)",
  "function tokenOfOwnerByIndex(address owner,uint256 i) view returns (uint256)",
  "function tokenURI(uint256 tokenId) view returns (string)",
];

const LEVELS = ["Bronze", "Silver", "Gold"];

export default function EzKeyDashboard() {
  const [provider, setProvider] = useState();
  const [signer, setSigner] = useState();
  const [address, setAddress] = useState("");
  const [tokenId, setTokenId] = useState();
  const [holderData, setHolderData] = useState({
    level: 0,
    lastClaim: 0,
  });
  const [tokenUri, setTokenUri] = useState("");
  const [pol, setPol] = useState("…");
  const [sushi, setSushi] = useState("…");
  const [ezoch, setEzoch] = useState("…");
  const [loading, setLoading] = useState(false);

  // Connexion au wallet
  useEffect(() => {
    if (window.ethereum) {
      const prov = new ethers.BrowserProvider(
        window.ethereum,
      );
      setProvider(prov);
      prov.send("eth_requestAccounts", []).then(() => {
        prov.getSigner().then((s) => {
          setSigner(s);
          s.getAddress().then((a) => setAddress(a));
        });
      });
    }
  }, []);

  // Lecture blockchain : NFT (niveau, image), tokens internes
  useEffect(() => {
    if (!provider || !signer || !address) return;
    const nft = new ethers.Contract(
      EZKEY_NFT,
      ABI_EZKEY,
      signer,
    );

    (async () => {
      setLoading(true);
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

      // POL/SUSHI/EZOCH balances
      const polC = new ethers.Contract(
        POL_ADDRESS,
        ABI_ERC20,
        signer,
      );
      const polBal = await polC.balanceOf(address);
      const polDecimals = await polC.decimals();
      setPol(ethers.formatUnits(polBal, polDecimals));

      const sushiC = new ethers.Contract(
        SUSHI_ADDRESS,
        ABI_ERC20,
        signer,
      );
      const sushiBal = await sushiC.balanceOf(address);
      const sushiDecimals = await sushiC.decimals();
      setSushi(ethers.formatUnits(sushiBal, sushiDecimals));

      const ezochC = new ethers.Contract(
        EZOCH_ADDRESS,
        ABI_ERC20,
        signer,
      );
      const ezochBal = await ezochC.balanceOf(address);
      const ezochDecimals = await ezochC.decimals();
      setEzoch(ethers.formatUnits(ezochBal, ezochDecimals));
      setLoading(false);
    })();
  }, [provider, signer, address]);

  // Helper pour le call d'action (mint, claim, upgrade)
  async function call(contractAddr, abi, fn) {
    if (!signer) {
      alert("Connexion nécessaire");
      return;
    }
    const contract = new ethers.Contract(
      contractAddr,
      abi,
      signer,
    );
    setLoading(true);
    await contract[fn]()
      .then((tx) => tx.wait())
      .then(() => window.location.reload());
    setLoading(false);
  }

  function formattedDate(ts) {
    return ts && Number(ts) > 0
      ? new Date(Number(ts) * 1000).toLocaleString()
      : "Jamais";
  }

  return (
    <div
      style={{
        maxWidth: 500,
        margin: "30px auto",
        padding: 20,
        border: "1px solid #DDD",
        borderRadius: 16,
        background: "#fafbfc",
      }}
    >
      <h2 style={{ textAlign: "center" }}>
        Ma Ez-Key NFT (ethers.js)
      </h2>
      {address ? (
        <>
          <div
            style={{
              fontSize: 13,
              color: "#999",
              marginBottom: 8,
            }}
          >
            Adresse connectée :{" "}
            <span style={{ color: "#222" }}>{address}</span>
          </div>
          <div>
            <p>
              <img
                src={TOKEN_IMAGES.EZOCH}
                style={{
                  width: 22,
                  verticalAlign: "middle",
                  marginRight: 7,
                }}
                alt="ezoch"
              />
              Solde EZOCH : <b>{ezoch}</b>
            </p>
            <p>
              <img
                src={TOKEN_IMAGES.POL}
                style={{
                  width: 22,
                  verticalAlign: "middle",
                  marginRight: 7,
                }}
                alt="pol"
              />
              Solde Ez-Key POL : <b>{pol}</b>
            </p>
            <p>
              <img
                src={TOKEN_IMAGES.SUSHI}
                style={{
                  width: 22,
                  verticalAlign: "middle",
                  marginRight: 7,
                }}
                alt="sushi"
              />
              Solde Ez-Key SUSHI : <b>{sushi}</b>
            </p>
          </div>
          {tokenId !== null ? (
            <>
              {tokenUri && (
                <div style={{ textAlign: "center" }}>
                  <img
                    src={tokenUri}
                    alt="Ez-Key Level"
                    style={{
                      width: 180,
                      marginBottom: 12,
                      borderRadius: 12,
                      border: "2px solid #ccc",
                    }}
                  />
                </div>
              )}
              <p>
                <b>Niveau :</b>{" "}
                <span
                  style={{ fontSize: 18, color: "#093" }}
                >
                  {LEVELS[holderData?.level || 0]}
                </span>
              </p>
              <p>
                <b>Dernier claim :</b>{" "}
                {formattedDate(holderData?.lastClaim)}
              </p>

              <button
                disabled={loading}
                onClick={() =>
                  call(EZKEY_NFT, ABI_EZKEY, "claimReward")
                }
                style={{
                  margin: 5,
                  padding: "6px 16px",
                  background: "#9fb4f8",
                  color: "#222",
                  border: "none",
                  borderRadius: 7,
                  fontWeight: 600,
                }}
              >
                Claim Reward
              </button>
              <button
                disabled={loading}
                onClick={() =>
                  call(
                    EZKEY_NFT,
                    ABI_EZKEY,
                    "upgradeToSilver",
                  )
                }
                style={{
                  margin: 5,
                  padding: "6px 16px",
                  background: "#b9ccc1",
                  color: "#222",
                  border: "none",
                  borderRadius: 7,
                }}
              >
                Upgrade Silver
              </button>
              <button
                disabled={loading}
                onClick={() =>
                  call(
                    EZKEY_NFT,
                    ABI_EZKEY,
                    "upgradeToGold",
                  )
                }
                style={{
                  margin: 5,
                  padding: "6px 16px",
                  background: "#ffe29b",
                  color: "#222",
                  border: "none",
                  borderRadius: 7,
                }}
              >
                Upgrade Gold
              </button>
            </>
          ) : (
            <>
              <p style={{ marginTop: 30, marginBottom: 4 }}>
                Vous ne possédez pas encore d’Ez-Key NFT.
              </p>
              <button
                disabled={loading}
                onClick={() =>
                  call(EZKEY_NFT, ABI_EZKEY, "mintKey")
                }
                style={{
                  padding: "7px 30px",
                  fontSize: 18,
                  background: "#229",
                  color: "#fff",
                  borderRadius: 8,
                  border: "none",
                  fontWeight: 600,
                }}
              >
                Mint Ez-Key
              </button>
            </>
          )}
          {loading && (
            <p style={{ color: "#888" }}>
              Traitement en cours...
            </p>
          )}
        </>
      ) : (
        <div style={{ textAlign: "center", marginTop: 24 }}>
          <button
            onClick={async () => {
              if (window.ethereum) {
                const prov = new ethers.BrowserProvider(
                  window.ethereum,
                );
                await prov.send("eth_requestAccounts", []);
                const s = await prov.getSigner();
                setProvider(prov);
                setSigner(s);
                setAddress(await s.getAddress());
              }
            }}
            style={{
              padding: "10px 24px",
              fontSize: 19,
              background: "#4a6df3",
              color: "#fff",
              border: "none",
              borderRadius: 10,
              fontWeight: "bold",
            }}
          >
            Se connecter
          </button>
        </div>
      )}
    </div>
  );
}
