import { useState } from "react";
import { ethers } from "ethers";

// Adresse de ton smart contract NFT Ez-Key (à adapter si besoin)
const EZKEY_NFT =
  "0xbca0C59Ee51CaA9837EA2f05d541E9936738Ce6b";
const ABI_EZKEY = [
  "function setBronzeURI(string uri)",
  "function setSilverURI(string uri)",
  "function setGoldURI(string uri)",
  "function setCooldown(uint256 v)",
  "function setRewards(tuple(uint256,uint256,uint256) bronze, tuple(uint256,uint256,uint256) silver, tuple(uint256,uint256,uint256) gold)",
];

export function EzKeyAdminPanel() {
  const [bronzeURI, setBronzeURI] = useState("");
  const [silverURI, setSilverURI] = useState("");
  const [goldURI, setGoldURI] = useState("");
  const [cooldown, setCooldown] = useState("");
  const [rewards, setRewards] = useState({
    bronze: { ezoch: "", pol: "", sushi: "" },
    silver: { ezoch: "", pol: "", sushi: "" },
    gold: { ezoch: "", pol: "", sushi: "" },
  });
  const [status, setStatus] = useState("");

  async function getSigner() {
    if (!window.ethereum) return;
    const provider = new ethers.BrowserProvider(
      window.ethereum,
    );
    await provider.send("eth_requestAccounts", []);
    return await provider.getSigner();
  }

  async function updateURI(level, uri) {
    setStatus(`Changement URI ${level}…`);
    const signer = await getSigner();
    const nft = new ethers.Contract(
      EZKEY_NFT,
      ABI_EZKEY,
      signer,
    );
    let tx;
    if (level === "bronze")
      tx = await nft.setBronzeURI(uri);
    if (level === "silver")
      tx = await nft.setSilverURI(uri);
    if (level === "gold") tx = await nft.setGoldURI(uri);
    await tx.wait();
    setStatus("✅ URI " + level + " mise à jour !");
  }

  async function updateCooldown() {
    setStatus("Changement cooldown…");
    const signer = await getSigner();
    const nft = new ethers.Contract(
      EZKEY_NFT,
      ABI_EZKEY,
      signer,
    );
    const tx = await nft.setCooldown(Number(cooldown));
    await tx.wait();
    setStatus("✅ Cooldown mis à jour !");
  }

  async function updateRewards() {
    setStatus("Changement rewards…");
    const signer = await getSigner();
    const nft = new ethers.Contract(
      EZKEY_NFT,
      ABI_EZKEY,
      signer,
    );

    // Les rewards sont données en human (ex : "100"), conversion en wei
    const format = ({ ezoch, pol, sushi }) => [
      ethers.parseUnits(ezoch || "0", 18),
      ethers.parseUnits(pol || "0", 18),
      ethers.parseUnits(sushi || "0", 18),
    ];
    const tx = await nft.setRewards(
      format(rewards.bronze),
      format(rewards.silver),
      format(rewards.gold),
    );
    await tx.wait();
    setStatus("✅ Rewards mis à jour !");
  }

  return (
    <div
      style={{
        margin: "28px 0",
        padding: 18,
        border: "2px solid #d3e7ff",
        borderRadius: 12,
        maxWidth: 520,
        background: "#f3f8fd",
      }}
    >
      <h3>🎛️ Panel Admin Ez-Key</h3>

      <div style={{ marginBottom: 12 }}>
        <span style={{ fontWeight: 600 }}>
          Changer les images / URI par niveau :
        </span>
        <div style={{ margin: "8px 0" }}>
          Bronze CID :
          <input
            value={bronzeURI}
            onChange={(e) => setBronzeURI(e.target.value)}
            placeholder="ipfs://..."
            style={{ width: 230 }}
          />
          <button
            onClick={() => updateURI("bronze", bronzeURI)}
          >
            Set
          </button>
        </div>
        <div style={{ margin: "8px 0" }}>
          Silver CID :
          <input
            value={silverURI}
            onChange={(e) => setSilverURI(e.target.value)}
            placeholder="ipfs://..."
            style={{ width: 230 }}
          />
          <button
            onClick={() => updateURI("silver", silverURI)}
          >
            Set
          </button>
        </div>
        <div style={{ margin: "8px 0" }}>
          Gold CID :
          <input
            value={goldURI}
            onChange={(e) => setGoldURI(e.target.value)}
            placeholder="ipfs://..."
            style={{ width: 230 }}
          />
          <button
            onClick={() => updateURI("gold", goldURI)}
          >
            Set
          </button>
        </div>
      </div>

      <div style={{ marginBottom: 12 }}>
        <span style={{ fontWeight: 600 }}>
          ⚡ Cooldown (en secondes, 1 jour = 86400) :
        </span>
        <input
          value={cooldown}
          onChange={(e) => setCooldown(e.target.value)}
          type="number"
          min="0"
          style={{ width: 120, marginLeft: 10 }}
        />
        <button onClick={updateCooldown}>Set</button>
      </div>

      <div style={{ marginBottom: 12 }}>
        <span style={{ fontWeight: 600 }}>
          ⚡ Changer Rewards (montants en EZOCH POL SUSHI,
          18 décimales) :
        </span>
        <div>
          Bronze :{" "}
          <input
            style={{ width: 60 }}
            placeholder="EZOCH"
            value={rewards.bronze.ezoch}
            onChange={(e) =>
              setRewards((r) => ({
                ...r,
                bronze: {
                  ...r.bronze,
                  ezoch: e.target.value,
                },
              }))
            }
          />
          <input
            style={{ width: 50 }}
            placeholder="POL"
            value={rewards.bronze.pol}
            onChange={(e) =>
              setRewards((r) => ({
                ...r,
                bronze: {
                  ...r.bronze,
                  pol: e.target.value,
                },
              }))
            }
          />
          <input
            style={{ width: 50 }}
            placeholder="SUSHI"
            value={rewards.bronze.sushi}
            onChange={(e) =>
              setRewards((r) => ({
                ...r,
                bronze: {
                  ...r.bronze,
                  sushi: e.target.value,
                },
              }))
            }
          />
        </div>
        <div>
          Silver :{" "}
          <input
            style={{ width: 60 }}
            placeholder="EZOCH"
            value={rewards.silver.ezoch}
            onChange={(e) =>
              setRewards((r) => ({
                ...r,
                silver: {
                  ...r.silver,
                  ezoch: e.target.value,
                },
              }))
            }
          />
          <input
            style={{ width: 50 }}
            placeholder="POL"
            value={rewards.silver.pol}
            onChange={(e) =>
              setRewards((r) => ({
                ...r,
                silver: {
                  ...r.silver,
                  pol: e.target.value,
                },
              }))
            }
          />
          <input
            style={{ width: 50 }}
            placeholder="SUSHI"
            value={rewards.silver.sushi}
            onChange={(e) =>
              setRewards((r) => ({
                ...r,
                silver: {
                  ...r.silver,
                  sushi: e.target.value,
                },
              }))
            }
          />
        </div>
        <div>
          Gold :{" "}
          <input
            style={{ width: 60 }}
            placeholder="EZOCH"
            value={rewards.gold.ezoch}
            onChange={(e) =>
              setRewards((r) => ({
                ...r,
                gold: { ...r.gold, ezoch: e.target.value },
              }))
            }
          />
          <input
            style={{ width: 50 }}
            placeholder="POL"
            value={rewards.gold.pol}
            onChange={(e) =>
              setRewards((r) => ({
                ...r,
                gold: { ...r.gold, pol: e.target.value },
              }))
            }
          />
          <input
            style={{ width: 50 }}
            placeholder="SUSHI"
            value={rewards.gold.sushi}
            onChange={(e) =>
              setRewards((r) => ({
                ...r,
                gold: { ...r.gold, sushi: e.target.value },
              }))
            }
          />
        </div>
        <button
          onClick={updateRewards}
          style={{ marginTop: 5 }}
        >
          Set Rewards
        </button>
      </div>

      <div
        style={{
          color: "#0aa",
          fontSize: 14,
          marginTop: 8,
        }}
      >
        {status}
      </div>
      <div
        style={{
          fontSize: 12,
          color: "#888",
          marginTop: 8,
        }}
      >
        Seules les transactions signées depuis le wallet
        owner/admin seront acceptées.
      </div>
    </div>
  );
}
