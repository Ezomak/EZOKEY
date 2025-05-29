import React from "react";

const TOKEN_IMAGES = {
  EZOCH:
    "https://ipfs.io/ipfs/QmWPd3FET5jeMGXkyETHCGkdwuiAvranxkbBcXiSoBwemP",
  POL: "https://ipfs.io/ipfs/bafkreidnthfocp3nx4msubtnnqaqrkecmt3zz772ufhpkostjthsvh7g5m",
  SUSHI:
    "https://ipfs.io/ipfs/QmajzGigJQkYMDDtfgWgzkbQhao2aKWbTf62PmZqTeJosc",
};

export function TokenIcon({
  symbol,
  size = 20,
  style = {},
}: {
  symbol: keyof typeof TOKEN_IMAGES;
  size?: number;
  style?: React.CSSProperties;
}) {
  return (
    <img
      src={TOKEN_IMAGES[symbol] || ""}
      alt={symbol + " logo"}
      style={{
        width: size,
        height: size,
        marginRight: 7,
        verticalAlign: "middle",
        borderRadius: size / 4,
        ...style,
      }}
    />
  );
}

export default TokenIcon;
