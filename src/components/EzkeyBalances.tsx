import { useEffect, useState } from "react";
import { ethers } from "ethers";

// Adresses tokens utilitaires Ez-Key sur Polygon
const POL_ADDRESS =
  "0xC959164A681BA93a4fbF846dC5c86A20D1A85C7c";
const SUSHI_ADDRESS =
  "0x668731D0d7341F0163dEA0531d2848751713633D";
const EZOCH_ADDRESS =
  "0xb7E15E994270A6B251C51B9a7358E10ce0054cd2";

// Liens logo (IPFS) des tokens
const TOKEN_IMAGES = {
  EZOCH:
    "https://ipfs.io/ipfs/QmWPd3FET5jeMGXkyETHCGkdwuiAvranxkbBcXiSoBwemP",
  POL: "https://ipfs.io/ipfs/bafkreidnthfocp3nx4msubtnnqaqrkecmt3zz772ufhpkostjthsvh7g5m",
  SUSHI:
    "https://ipfs.io/ipfs/QmajzGigJQkYMDDtfgWgzkbQhao2aKWbTf62PmZqTeJosc",
};

const ABI_ERC20 = [
  "function balanceOf(address) view returns (uint256)",
  "function decimals() view returns (uint8)",
];

// Props : adresse à analyser
export function EzKeyBalances({ address }) {
  const [pol, setPol] = useState("…");
  const [sushi, setSushi] = useState("…");
  const [ezoch, setEzoch] = useState("…");

  useEffect(() => {
    if (!address || !window.ethereum) return;
    const provider = new ethers.BrowserProvider(
      window.ethereum,
    );
    (async () => {
      const signer = await provider.getSigner();
      // POL
      const polC = new ethers.Contract(
        POL_ADDRESS,
        ABI_ERC20,
        signer,
      );
      const polBal = await polC.balanceOf(address);
      const polDecimals = await polC.decimals();
      setPol(ethers.formatUnits(polBal, polDecimals));
      // SUSHI
      const sushiC = new ethers.Contract(
        SUSHI_ADDRESS,
        ABI_ERC20,
        signer,
      );
      const sushiBal = await sushiC.balanceOf(address);
      const sushiDecimals = await sushiC.decimals();
      setSushi(ethers.formatUnits(sushiBal, sushiDecimals));
      // EZOCH
      const ezochC = new ethers.Contract(
        EZOCH_ADDRESS,
        ABI_ERC20,
        signer,
      );
      const ezochBal = await ezochC.balanceOf(address);
      const ezochDecimals = await ezochC.decimals();
      setEzoch(ethers.formatUnits(ezochBal, ezochDecimals));
    })();
  }, [address]);

  return (
    <div style={{ marginTop: 12 }}>
      <p>
        <img
          src={TOKEN_IMAGES.EZOCH}
          style={{
            width: 20,
            verticalAlign: "middle",
            marginRight: 7,
          }}
          alt="ezoch"
        />
        Solde EZOCH : <b>{ezoch}</b>
      </p>
      <p>
        <img
          src={TOKEN_IMAGES.POL}
          style={{
            width: 20,
            verticalAlign: "middle",
            marginRight: 7,
          }}
          alt="POL"
        />
        Solde Ez-Key POL : <b>{pol}</b>
      </p>
      <p>
        <img
          src={TOKEN_IMAGES.SUSHI}
          style={{
            width: 20,
            verticalAlign: "middle",
            marginRight: 7,
          }}
          alt="sushi"
        />
        Solde Ez-Key SUSHI : <b>{sushi}</b>
      </p>
    </div>
  );
}
