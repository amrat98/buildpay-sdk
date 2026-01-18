/**
 * Transaction Examples
 * 
 * This example demonstrates transaction-related operations
 */

const BuildPayClient = require('../index');

async function transactionExample() {
    const client = new BuildPayClient({
        baseURL: 'http://localhost:3000',
        customerId: 'your-customer-id'
    });

    try {
        // 1. Submit a withdrawal
        console.log('Submitting withdrawal...');
        const withdrawal = await client.transaction.withdrawAsset({
            walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
            userId: 'user_12345',
            amount: 50
        });
        console.log('Withdrawal submitted:', withdrawal.data);
        console.log('Status:', withdrawal.data.transacionStatus);
        console.log('Transaction ID:', withdrawal.data._id);

        // 2. Get all transactions for a user
        console.log('\nFetching user transactions...');
        const userTransactions = await client.transaction.getTransactions({
            userId: 'user_12345',
            page: 1,
            limit: 10
        });
        console.log(`Found ${userTransactions.data.total} transactions`);
        console.log('Recent transactions:', userTransactions.data.transactions);

        // 3. Get completed transactions
        console.log('\nFetching completed transactions...');
        const completedTransactions = await client.transaction.getTransactions({
            status: 'COMPLETED',
            page: 1,
            limit: 5
        });
        console.log(`Completed transactions: ${completedTransactions.data.total}`);

        // 4. Get transactions within a date range
        console.log('\nFetching transactions by date range...');
        const dateRangeTransactions = await client.transaction.getTransactions({
            fromDate: '2024-01-01T00:00:00Z',
            toDate: '2024-12-31T23:59:59Z',
            page: 1,
            limit: 20
        });
        console.log(`Transactions in range: ${dateRangeTransactions.data.total}`);

        // 5. Approve a pending withdrawal (if any)
        const pendingTxs = await client.transaction.getTransactions({
            status: 'WAITING_APPROVAL',
            limit: 1
        });

        if (pendingTxs.data.transactions.length > 0) {
            console.log('\nApproving pending withdrawal...');
            const txToApprove = pendingTxs.data.transactions[0];
            const approvalResult = await client.transaction.approveWithdraw({
                transactionId: txToApprove._id,
                approve: true
            });
            console.log('Approval result:', approvalResult.data);
        } else {
            console.log('\nNo pending withdrawals to approve');
        }

    } catch (error) {
        console.error('Error:', error.message);
        if (error.status) {
            console.error('Status:', error.status);
        }
    }
}

// Run the example
if (require.main === module) {
    transactionExample();
}

module.exports = transactionExample;
