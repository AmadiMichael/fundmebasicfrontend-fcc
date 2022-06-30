import { ethers } from "./ethers-5.6.esm.min.js";
import { abi, contractAddress } from "./constants.js";

const connectButton = document.getElementById("connectButton");
const fundButton = document.getElementById("fund");
const balanceButton = document.getElementById("balanceButton");
const withdrawButton = document.getElementById("withdrawButton");

connectButton.onclick = connect;
fundButton.onclick = fund;
balanceButton.onclick = balance;
withdrawButton.onclick = withdraw;

async function connect() {
  if (typeof window.ethereum !== "undefined") {
    try {
      console.log("I see a metamask");
      await window.ethereum.request({ method: "eth_requestAccounts" });
    } catch (error) {
      console.log(error);
    }
    console.log("Connected");
    connectButton.innerHTML = "Connected!";
    const accounts = await ethereum.request({ method: "eth_accounts" });
    console.log(accounts);
    console.log(ethers);
  } else {
    console.log("No metamask");
    connectButton.innerHTML = "Please connect Metamask";
  }
}

async function fund() {
  const ethAmount = document.getElementById("ethAmount").value;
  console.log(` Funding with ${ethAmount}...`);
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    console.log(signer);
    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
      const transactionResponse = await contract.fund({
        value: ethers.utils.parseEther(ethAmount),
      });
      await listenForTransactionMined(transactionResponse, provider);
      console.log("Done");
    } catch (error) {
      console.log(error);
    }
    // await transactionResponse.wait(1);
    // console.log("done");
  }
}

function listenForTransactionMined(transactionResponse, provider) {
  console.log(`Mining ${transactionResponse.hash}...`);
  return new Promise((resolve, reject) => {
    provider.once(transactionResponse.hash, (getTransactionReceipt) => {
      console.log(
        `Completed with ${getTransactionReceipt.confirmations} confirmations`
      );
      resolve();
    });
  });
}

async function balance() {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    console.log(signer);
    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
      const balance = await provider.getBalance(contractAddress);
      console.log(ethers.utils.formatEther(balance));
    } catch (error) {
      console.log(error);
    }
  }
}

async function withdraw() {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    console.log(signer);
    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
      const transactionResponse = await contract.withdraw();
      await listenForTransactionMined(transactionResponse, provider);
      console.log("Withdrawn");
    } catch (error) {
      console.log(error);
    }
    // await transactionResponse.wait(1);
    // console.log("done");
  }
}
