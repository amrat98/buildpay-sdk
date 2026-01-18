/**
 * Customer and Wallet Management Example
 * 
 * This example demonstrates customer and wallet operations
 */

const BuildPayClient = require('../index');

async function customerExample() {
    const client = new BuildPayClient({
        baseURL: 'http://localhost:3000'
    });

    try {
        // 1. Create a new customer
        console.log('Creating a new customer...');
        const newCustomer = await client.customer.createCustomer({
            name: 'Acme Corporation',
            rpcUrl: 'https://bsc-dataseed.binance.org/',
            tokenAddress: '0x1234567890abcdef1234567890abcdef12345678',
            vaultContractAddress: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
            adminAddress: '0xadminadminadminadminadminadminadminadmin',
            hotwalletAddress: '0xhotwhotwhotwhotwhotwhotwhotwhotwhotwhotw'
        });
        console.log('Customer created with ID:', newCustomer.data.customerId);
        
        const customerId = newCustomer.data.customerId;

        // 2. Get customer details
        console.log('\nFetching customer details...');
        const customer = await client.customer.getCustomer(customerId);
        console.log('Customer details:', customer.data);

        // 3. Create wallets for multiple users
        console.log('\nCreating wallets for users...');
        const users = ['user_001', 'user_002', 'user_003'];
        const wallets = [];

        for (const userId of users) {
            const wallet = await client.customer.createWallet({
                userId,
                customerId
            });
            wallets.push({
                userId,
                address: wallet.data.address,
                balance: wallet.data.balance
            });
            console.log(`Wallet created for ${userId}: ${wallet.data.address}`);
        }

        // 4. Get wallet details for a specific user
        console.log('\nFetching wallet details for user_001...');
        const walletDetails = await client.customer.getUserWalletDetails({
            userId: 'user_001',
            customerId
        });
        console.log('Wallet details:', {
            address: walletDetails.data.wallet.address,
            balance: walletDetails.data.wallet.balance,
            totalDeposit: walletDetails.data.wallet.totalDeposit,
            totalSpent: walletDetails.data.wallet.totalSpent
        });
        console.log('Recent transactions:', walletDetails.data.transactions.length);

        // 5. Get transactions for a wallet address
        console.log('\nFetching transactions for wallet...');
        const walletAddress = wallets[0].address;
        const transactions = await client.customer.getWalletTransactions({
            walletAddress,
            customerId
        });
        console.log(`Transactions for ${walletAddress}:`, transactions.data.length);

        // 6. Get only deposit transactions
        console.log('\nFetching deposit transactions...');
        const deposits = await client.customer.getWalletTransactions({
            walletAddress,
            customerId,
            type: 'DEPOSIT'
        });
        console.log(`Deposit transactions:`, deposits.data.length);

        // 7. Get only withdrawal transactions
        console.log('\nFetching withdrawal transactions...');
        const withdrawals = await client.customer.getWalletTransactions({
            walletAddress,
            customerId,
            type: 'WITHDRAW'
        });
        console.log(`Withdrawal transactions:`, withdrawals.data.length);

    } catch (error) {
        console.error('Error:', error.message);
        if (error.status) {
            console.error('Status:', error.status);
        }
    }
}

// Run the example
if (require.main === module) {
    customerExample();
}

module.exports = customerExample;
