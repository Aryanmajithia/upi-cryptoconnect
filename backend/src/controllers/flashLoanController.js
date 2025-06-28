import FLHistory from "../models/FLHistory.js";

// export const FLStatusRead = async (req,res) => {
//     try {
//         const addr = req.body.arenaAddress;
//         const data = await FLStatus.find({'arenaAddress': addr});
//         console.log(data[0].status);
//         return res.json(data[0].status);
//     } catch (error) {
//         console.log("Error in FLStatusRead: " + error);
//         return res.json('failed');
//     }
// }

// export const FLStatusWrite = async (req,res) => {
//     try {
//         const addr = req.body.arenaAddress;
//         const status = req.body.status;
//         const data = await FLStatus.insertMany({'arenaAddress': addr, 'status': status});
//         console.log(data);
//         return res.json("success");
//     } catch (error) {
//         console.log("Error in FLStatusWrite: " + error);
//         return res.json("failed");
//     }
// }

// Get loan history
export const getLoanHistory = async (req, res) => {
  try {
    const data = await FLHistory.find().sort({ createdAt: -1 }).limit(10);
    res.json(data);
  } catch (error) {
    console.log("Error in getLoanHistory: " + error);
    res.status(500).json({ message: "Failed to fetch loan history" });
  }
};

// Get balance
export const getBalance = async (req, res) => {
  try {
    // Mock balance for now - in real implementation this would come from blockchain
    const balance = Math.random() * 10000;
    res.json({ balance: balance.toFixed(2) });
  } catch (error) {
    console.log("Error in getBalance: " + error);
    res.status(500).json({ message: "Failed to get balance" });
  }
};

// Withdraw funds
export const withdraw = async (req, res) => {
  try {
    // Mock withdrawal - in real implementation this would interact with smart contract
    res.json({ message: "Withdrawal successful" });
  } catch (error) {
    console.log("Error in withdraw: " + error);
    res.status(500).json({ message: "Failed to withdraw" });
  }
};

// Lock arena
export const lockArena = async (req, res) => {
  try {
    // Mock arena locking - in real implementation this would interact with smart contract
    res.json({ message: "Arena locked successfully" });
  } catch (error) {
    console.log("Error in lockArena: " + error);
    res.status(500).json({ message: "Failed to lock arena" });
  }
};

// Find arbitrage opportunity
export const findArbitrage = async (req, res) => {
  try {
    const { amount } = req.body;

    // Mock arbitrage finding - in real implementation this would scan DEXes
    const pairs = ["USDC-DAI", "ETH-USDC", "WBTC-ETH"];
    const randomPair = pairs[Math.floor(Math.random() * pairs.length)];
    const profit = (Math.random() * 0.1 * amount).toFixed(2);

    res.json({
      pair: randomPair,
      profit: `${profit} USDC`,
      message: "Arbitrage opportunity found",
    });
  } catch (error) {
    console.log("Error in findArbitrage: " + error);
    res.status(500).json({ message: "Failed to find arbitrage opportunity" });
  }
};

// Execute flash loan
export const executeFlashLoan = async (req, res) => {
  try {
    const { pair, amount } = req.body;

    // Mock execution - in real implementation this would execute the flash loan
    const profit = (Math.random() * 0.1 * amount).toFixed(2);

    // Save to history
    await FLHistory.create({
      address: req.user?.id || "anonymous",
      date: new Date().toLocaleDateString(),
      token: "USDC",
      loan: amount,
      pl: `+${profit}`,
    });

    res.json({
      message: "Flash loan executed successfully",
      profit: profit,
    });
  } catch (error) {
    console.log("Error in executeFlashLoan: " + error);
    res.status(500).json({ message: "Failed to execute flash loan" });
  }
};

// Legacy functions for backward compatibility
export const FLHistoryRead = async (req, res) => {
  try {
    const addr = req.body.address;
    const data = await FLHistory.find({ address: addr });
    console.log(data);
    return res.json(data);
  } catch (error) {
    console.log("Error in FLHistoryRead: " + error);
    return res.json("failed");
  }
};

export const FLHistoryWrite = async (req, res) => {
  try {
    const addr = req.body.address;
    const date = req.body.date;
    const token = req.body.token;
    const loan = req.body.amt;
    const pl = req.body.pft;

    const data = await FLHistory.insertMany({
      address: addr,
      date: date,
      token: token,
      loan: loan,
      pl: pl,
    });
    console.log(data);
    return res.json({ status: "success", data: data });
  } catch (error) {
    console.log("Error in FLHistoryWrite: " + error);
    return res.json("failed");
  }
};
