import { ethers } from "ethers";

// Fournit le provider Metamask courrant, ou throw si absent
export function getProvider(): ethers.BrowserProvider {
  if (!window.ethereum)
    throw new Error("Metamask non détecté");
  return new ethers.BrowserProvider(window.ethereum);
}

// Connexion explicite Metamask, retourne signer
export async function connectWallet(): Promise<ethers.JsonRpcSigner> {
  const provider = getProvider();
  await provider.send("eth_requestAccounts", []);
  return provider.getSigner();
}

// Retourne l'adresse wallet active
export async function getCurrentAddress(): Promise<string> {
  const provider = getProvider();
  const signer = await provider.getSigner();
  return signer.getAddress();
}

// Conversion wei → valeur humaine (string)
export function toHuman(
  value: string | bigint,
  decimals = 18,
  maxDigits = 4,
): string {
  if (!value) return "0";
  const val = ethers.formatUnits(value, decimals);
  const dot = val.indexOf(".");
  return dot > 0 ? val.slice(0, dot + 1 + maxDigits) : val;
}

// Conversion valeur humaine → wei
export function toWei(
  value: string | number,
  decimals = 18,
): bigint {
  return ethers.parseUnits(value.toString(), decimals);
}

// Vérifie si le network est bon (Polygon = 137)
export async function checkNetwork(expectedChainId = 137) {
  const provider = getProvider();
  const net = await provider.getNetwork();
  if (net.chainId !== expectedChainId)
    throw new Error("Réseau Polygon requis !");
}

// Prépare le signer prêt à l'emploi avec vérification réseau
export async function readySigner(
  desiredChainId = 137,
): Promise<ethers.JsonRpcSigner> {
  const signer = await connectWallet();
  const provider =
    signer.provider as ethers.BrowserProvider;
  const net = await provider.getNetwork();
  if (net.chainId !== desiredChainId)
    throw new Error(
      "Connecte-toi au réseau Polygon Mainnet (chainId 137)",
    );
  return signer;
}

// Appel read sur n'importe quel smart contract (lecture mapping, getter, etc)
export async function getContractRead(
  address: string,
  abi: any,
  fn: string,
  args: any[] = [],
) {
  const signer = await connectWallet();
  const contract = new ethers.Contract(
    address,
    abi,
    signer,
  );
  return contract[fn](...args);
}

// Ajoute ici d'autres helpers si besoin (batch multicall, allowance ERC20, etc)
