import { ethers } from 'ethers';
import CryptoJS from 'crypto-js';

const FTR_MAINNET_RPC_URL = "https://palm-mainnet.infura.io/v3/c58e7b172b9347f1a9be8f4c8856afb6"
const FTR_TESTNET_RPC_URL = "https://palm-testnet.infura.io/v3/c58e7b172b9347f1a9be8f4c8856afb6"

let currentNetwork = 'mainnet'
let provider = new ethers.JsonRpcProvider(FTR_MAINNET_RPC_URL)

export function switchNetwork(network: string) {
  currentNetwork = network;
  provider = new ethers.JsonRpcProvider(network === 'mainnet' ? FTR_MAINNET_RPC_URL : FTR_TESTNET_RPC_URL)
}

export function getCurrentNetwork() {
  return currentNetwork;
}

export function createNewWallet() {
  const wallet = ethers.Wallet.createRandom();
  return {
    address: wallet.address,
    privateKey: wallet.privateKey,
    mnemonicPhrase: wallet.mnemonic?.phrase,
    publicKey:wallet.publicKey
  };
}

export function importWallet(privateKey : string) {
  try {
    const wallet = new ethers.Wallet(privateKey);
    return {
      address: wallet.address,
      privateKey: wallet.privateKey,
      publicKey: wallet.signingKey.publicKey
    };
  } catch (error) {
    alert("Invalid Private Key.");
    return null;
  }
}

export function encryptPrivateKey(privateKey: string, password: string) {
  return CryptoJS.AES.encrypt(privateKey, password).toString()
}

export function decryptPrivateKey(encryptedPrivateKey: string, password: string) {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedPrivateKey, password)
    return bytes.toString(CryptoJS.enc.Utf8)
  } catch (error) {
    console.error("Invalid password or corrupted data")
    return null
  }
}

export async function getWalletBalance(address: string) {
  try {    
    const balance = await provider.getBalance(address);    
    return ethers.formatEther(balance);
  } catch (error) {
    alert("Error to fetching balance.");
    return null;
  }
}

export async function estimateGasCost(from: string, to: string, amount: string) {
  try {
    const gasPrice = await provider.getFeeData();
    const gasLimit = await provider.estimateGas({
      from,
      to,
      value: ethers.parseEther(amount)
    });
    const mfpg = gasPrice.maxFeePerGas;
    if (!mfpg) {
      return "0.000000";
    }
    const gasCost = gasLimit * mfpg;
    return ethers.formatEther(gasCost);
  } catch (error) {
    console.error("Error estimating gas cost:", error)
    throw error;
  }
}

export async function sendTransaction(privateKey: string, recipient: string, amount: string) {
  try {
    const wallet = new ethers.Wallet(privateKey, provider)
    const balance = await provider.getBalance(wallet.address)
    const value = ethers.parseEther(amount)
    const gasEstimate = await estimateGasCost(wallet.address, recipient, amount)
    const totalCost = value + ethers.parseEther(gasEstimate)

    if (balance < totalCost) {
      throw new Error("Insufficient funds for transaction and gas fees")
    }

    const tx = await wallet.sendTransaction({
      to: recipient,
      value: value
    })
    await tx.wait()
    return tx
  } catch (error) {
    console.error("Error sending transaction:", error)
    throw error
  }
}

export async function getTransactionHistory(address: string, limit = 10) {
  try {
    const latestBlock = await provider.getBlockNumber();
    const logs = await provider.getLogs({
      fromBlock: latestBlock - 10, // Adjust the range as per your needs
      toBlock: "latest",
      address,
    });
    const transactions = await Promise.all(
      logs.map(async (log) => {
        const tx = await provider.getTransaction(log.transactionHash);
        if (!tx) {
          console.warn(`Transaction not found for hash: ${log.transactionHash}`);
          return null;
        }
        const block = await provider.getBlock(tx.blockNumber!); // Get block details for timestamp
        if (!block) {
          console.warn(`Block not found for block number: ${tx.blockNumber}`);
          return null;
        }
        return {
          hash: tx.hash,
          from: tx.from,
          to: tx.to,
          value: ethers.formatEther(tx.value),
          timestamp: new Date(block.timestamp * 1000).toISOString(),
          confirmations: tx.confirmations,
        };
      })
    );
    return transactions.filter((tx) => tx !== null).slice(0, limit);
  } catch (error) {
    console.error("Error fetching transaction history:", error)
    return []
  }
}

