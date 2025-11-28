// 1. CONFIGURATION
const contractAddress = "YOUR_CONTRACT_ADDRESS_HERE"; // Paste your address from Remix
const contractABI = [
  /* Paste your ABI array from Remix here */
];

let provider;
let signer;
let contract;

// DOM Elements
const userScore_span = document.getElementById("user-score");
const computerScore_span = document.getElementById("computer-score");
const result_p = document.querySelector(".result > p");
const rock_div = document.getElementById("r");
const paper_div = document.getElementById("p");
const scissors_div = document.getElementById("s");
const connectBtn = document.getElementById("connectBtn");

let userScore = 0;
let computerScore = 0;

// 2. CONNECT WALLET FUNCTION [cite: 387]
async function connectWallet() {
  if (window.ethereum) {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      provider = new ethers.providers.Web3Provider(window.ethereum);
      signer = provider.getSigner();
      contract = new ethers.Contract(contractAddress, contractABI, signer);

      const address = await signer.getAddress();
      connectBtn.innerText = `Connected: ${address.substring(0, 6)}...`;
      console.log("Wallet connected");
    } catch (error) {
      console.error(error);
    }
  } else {
    alert("Please install MetaMask!");
  }
}

connectBtn.addEventListener("click", connectWallet);

// 3. GAME LOGIC [cite: 388, 390]
async function game(userChoiceString) {
  if (!contract) {
    alert("Please connect your wallet first!");
    return;
  }

  // Convert 'r', 'p', 's' to numbers for the contract (0, 1, 2)
  let moveMap = { r: 0, p: 1, s: 2 };
  let moveCode = moveMap[userChoiceString];

  result_p.innerHTML = "Processing transaction... Please wait."; // Loading message [cite: 392]

  try {
    // Send transaction to the blockchain
    // Note: value is the bet amount (0.0001 ETH/BNB)
    const tx = await contract.play(moveCode, {
      value: ethers.utils.parseEther("0.0001"),
    });

    console.log("Transaction sent:", tx.hash);

    // Wait for transaction to be mined [cite: 391]
    const receipt = await tx.wait();
    console.log("Transaction mined:", receipt);

    // For this practice, we will check the wallet balance or events to see if we won.
    // However, to keep it simple and visual like the assignment asks:
    // We will simulate the UI update based on the result.

    // NOTE: In a real app, you would read the "Return" value via an Event.
    // For simplicity, we will assume if the transaction didn't fail, the game was played.
    result_p.innerHTML = "Game played! Check your wallet balance for changes.";
  } catch (error) {
    console.error(error);
    result_p.innerHTML = "Transaction failed or rejected.";
  }
}

// 4. EVENT LISTENERS
function main() {
  rock_div.addEventListener("click", () => game("r"));
  paper_div.addEventListener("click", () => game("p"));
  scissors_div.addEventListener("click", () => game("s"));
}

main();
