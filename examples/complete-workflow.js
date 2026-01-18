/**
 * Complete Workflow Example
 * 
 * This example demonstrates a complete workflow from customer creation
 * to wallet management and transactions
 */

const BuildPayClient = require('../index');

async function completeWorkflow() {
    const client = new BuildPayClient({
        baseURL: 'http://localhost:3000',
        apiKey: 'your-api-key-here'
    });

    try {
        console.log('========================================');
        console.log('BuildPay SDK - Complete Workflow Example');
        console.log('========================================\n');

        // Step 1: Create a customer
        console.log('Step 1: Creating a new customer...');
        const customer = await client.customer.createCustomer({
            name: 'Demo Company Ltd',
            rpcUrl: 'https://bsc-dataseed.binance.org/'
        });
        const customerId = customer.data.customerId;
        console.log(`✓ Customer created: ${customerId}\n`);

        // Update default customer ID
        client.setCustomerId(customerId);

        // Step 2: Create wallets for users
        console.log('Step 2: Creating wallets for users...');
        const wallet1 = await client.customer.createWallet({
            userId: 'alice'
        });
        console.log(`✓ Wallet created for Alice: ${wallet1.data.address}`);

        const wallet2 = await client.customer.createWallet({
            userId: 'bob'
        });
        console.log(`✓ Wallet created for Bob: ${wallet2.data.address}\n`);

        // Step 3: Get wallet details
        console.log('Step 3: Fetching wallet details...');
        const aliceWallet = await client.customer.getUserWalletDetails({
            userId: 'alice'
        });
        console.log(`✓ Alice's wallet balance: ${aliceWallet.data.wallet.balance}`);
        console.log(`  Total deposits: ${aliceWallet.data.wallet.totalDeposit}`);
        console.log(`  Total spent: ${aliceWallet.data.wallet.totalSpent}\n`);

        // Step 4: Simulate a withdrawal (small amount - auto-approved)
        console.log('Step 4: Submitting a small withdrawal (auto-approved)...');
        const smallWithdrawal = await client.transaction.withdrawAsset({
            walletAddress: wallet1.data.address,
            userId: 'alice',
            amount: 50
        });
        console.log(`✓ Withdrawal submitted: ${smallWithdrawal.data._id}`);
        console.log(`  Status: ${smallWithdrawal.data.transacionStatus}`);
        console.log(`  Amount: ${smallWithdrawal.data.amount}\n`);

        // Step 5: Simulate a large withdrawal (requires approval)
        console.log('Step 5: Submitting a large withdrawal (requires approval)...');
        const largeWithdrawal = await client.transaction.withdrawAsset({
            walletAddress: wallet2.data.address,
            userId: 'bob',
            amount: 150
        });
        console.log(`✓ Withdrawal submitted: ${largeWithdrawal.data._id}`);
        console.log(`  Status: ${largeWithdrawal.data.transacionStatus}`);
        console.log(`  Amount: ${largeWithdrawal.data.amount}\n`);

        // Step 6: Get all pending transactions
        console.log('Step 6: Fetching pending transactions...');
        const pendingTxs = await client.transaction.getTransactions({
            status: 'WAITING_APPROVAL'
        });
        console.log(`✓ Found ${pendingTxs.data.total} pending transaction(s)\n`);

        // Step 7: Approve the pending withdrawal
        if (pendingTxs.data.transactions.length > 0) {
            console.log('Step 7: Approving the pending withdrawal...');
            const txToApprove = pendingTxs.data.transactions[0];
            const approvalResult = await client.transaction.approveWithdraw({
                transactionId: txToApprove._id,
                approve: true
            });
            console.log(`✓ Transaction approved: ${approvalResult.data._id}`);
            console.log(`  New status: ${approvalResult.data.transacionStatus}\n`);
        }

        // Step 8: Get transaction history for a user
        console.log('Step 8: Fetching transaction history for Alice...');
        const aliceTransactions = await client.transaction.getTransactions({
            userId: 'alice',
            page: 1,
            limit: 10
        });
        console.log(`✓ Found ${aliceTransactions.data.total} transaction(s)`);
        if (aliceTransactions.data.transactions.length > 0) {
            console.log('  Recent transactions:');
            aliceTransactions.data.transactions.forEach((tx, index) => {
                console.log(`    ${index + 1}. ${tx.transacionType} - ${tx.amount} (${tx.transacionStatus})`);
            });
        }
        console.log();

        // Step 9: Get wallet transactions
        console.log('Step 9: Fetching wallet transactions for Alice...');
        const walletTxs = await client.customer.getWalletTransactions({
            walletAddress: wallet1.data.address
        });
        console.log(`✓ Found ${walletTxs.data.length} transaction(s) for this wallet\n`);

        console.log('========================================');
        console.log('Workflow completed successfully!');
        console.log('========================================');

    } catch (error) {
        console.error('\n❌ Error occurred:', error.message);
        if (error.status) {
            console.error('Status code:', error.status);
        }
        if (error.data) {
            console.error('Error details:', error.data);
        }
    }
}

// Run the example
if (require.main === module) {
    completeWorkflow();
}

module.exports = completeWorkflow;
