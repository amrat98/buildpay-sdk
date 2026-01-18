/**
 * Basic Usage Example
 * 
 * This example demonstrates the basic usage of the BuildPay SDK
 */

const BuildPayClient = require('../index');

async function basicExample() {
    // Initialize the client
    const client = new BuildPayClient({
        baseURL: 'http://localhost:3000', // Replace with your API URL
        apiKey: 'your-api-key-here',      // Optional: Your API key
        customerId: 'your-customer-id'    // Optional: Default customer ID
    });

    try {
        // Get customer details
        console.log('Fetching customer details...');
        const customer = await client.customer.getCustomer('your-customer-id');
        console.log('Customer:', customer.data);

        // Create a wallet for a user
        console.log('\nCreating wallet...');
        const wallet = await client.customer.createWallet({
            userId: 'user_12345'
        });
        console.log('Wallet created:', wallet.data.address);

        // Get wallet details
        console.log('\nFetching wallet details...');
        const walletDetails = await client.customer.getUserWalletDetails({
            userId: 'user_12345'
        });
        console.log('Wallet balance:', walletDetails.data.wallet.balance);
        console.log('Total deposits:', walletDetails.data.wallet.totalDeposit);
        console.log('Recent transactions:', walletDetails.data.transactions.length);

    } catch (error) {
        console.error('Error:', error.message);
        if (error.status) {
            console.error('Status:', error.status);
            console.error('Data:', error.data);
        }
    }
}

// Run the example
if (require.main === module) {
    basicExample();
}

module.exports = basicExample;
