import {
    Connection,
    PublicKey,
    clusterApiUrl
} from "@solana/web3.js";
import ITransaction from "../interfaces/transaction.interface";

const solanaConnection = new Connection("https://long-withered-paper.solana-mainnet.quiknode.pro/35927df28741e5bef80b6f558cc3d2165bbf1c40/");

export const getTransactions = async (publicKey: string, numTx: number) => {
    try {
        const pubKey = new PublicKey(publicKey);

        console.log(await solanaConnection.getSlot());

        // Fetch the initial balance of the wallet
        const initialBalance = await solanaConnection.getBalance(pubKey);
        // console.log(initialBalance)

        // Fetch transaction signatures for the address
        const transactionList = await solanaConnection.getSignaturesForAddress(
            pubKey,
            { limit: numTx }
        );
        const transactions: ITransaction[] = [];
        let currentBalance = initialBalance;

        for (const transaction of transactionList) {
            const date = new Date((transaction.blockTime || 0) * 1000);

            // Fetch transaction details to get the amount transferred
            const txDetails = await solanaConnection.getTransaction(
                transaction.signature,
                { commitment: "confirmed" }
            );

            const amount =
                (txDetails?.meta?.preBalances[0] || 0) -
                (txDetails?.meta?.postBalances[0] || 0);

            transactions.push({
                signature: transaction.signature,
                date: date.toISOString(),
                // status: transaction.confirmationStatus || "unknown",
                amount: Number((amount / 1e9).toFixed(4)), // Convert lamports to SOL
            });
        }

        return (transactions);
    } catch (error) {
        console.error("Error fetching transactions from Solana:", error);
        throw new Error("Error fetching transactions from Solana.");
    }
};