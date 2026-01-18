# BuildPay SDK

Official Node.js SDK for the BuildPay API. This SDK provides a simple and convenient way to integrate BuildPay's blockchain wallet and transaction management features into your Node.js applications.

## Features

- 🏦 **Customer Management** - Create and manage SaaS customers (tenants)
- 👛 **Wallet Operations** - Create and manage user wallets within customers
- 💸 **Transactions** - Handle withdrawals, deposits, and transaction queries
- 🔐 **Secure** - Built-in authentication and error handling
- 📝 **Well-documented** - Comprehensive JSDoc annotations and examples
- 🚀 **Easy to use** - Simple, intuitive API design

## Installation

```bash
npm install buildpay-sdk
```

## Quick Start

```javascript
const BuildPayClient = require('buildpay-sdk');

// Initialize the client
const client = new BuildPayClient({
  baseURL: 'https://api.buildpay.com',
  apiKey: 'your-api-key',        // Optional
  customerId: 'your-customer-id' // Optional default customer ID
});

// Create a wallet for a user
const wallet = await client.customer.createWallet({
  userId: 'user_12345',
  customerId: 'customer_abc'
});

console.log('Wallet created:', wallet.data.address);
```

## API Reference

### Initialization

Create a new BuildPay client instance:

```javascript
const client = new BuildPayClient({
  baseURL: 'https://api.buildpay.com',  // Required: Your BuildPay API endpoint
  apiKey: 'your-api-key',                // Optional: API key for authentication
  customerId: 'default-customer-id',     // Optional: Default customer ID
  timeout: 30000                          // Optional: Request timeout (default: 30000ms)
});
```

### Customer API

#### Create Customer

Create a new SaaS customer (tenant):

```javascript
const result = await client.customer.createCustomer({
  name: 'Acme Corp',
  rpcUrl: 'https://bsc-dataseed.binance.org/',
  tokenAddress: '0x1234567890abcdef1234567890abcdef12345678',
  vaultContractAddress: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
  adminAddress: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
  hotwalletAddress: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
  adminPvtKey: '0xabcdef...',
  hotwalletPvtKey: '0xabcdef...'
});

console.log('Customer ID:', result.data.customerId);
```

#### Get Customer

Get customer details by ID:

```javascript
const customer = await client.customer.getCustomer('customer_id');
console.log('Customer:', customer.data);
```

#### Create Wallet

Create a wallet for a user within a customer:

```javascript
const wallet = await client.customer.createWallet({
  userId: 'user_12345',
  customerId: 'customer_abc' // Optional if set in client config
});

console.log('Wallet address:', wallet.data.address);
console.log('Balance:', wallet.data.balance);
```

#### Get Wallet Details

Get comprehensive wallet details including balance and recent transactions:

```javascript
const walletDetails = await client.customer.getUserWalletDetails({
  userId: 'user_12345',
  customerId: 'customer_abc' // Optional if set in client config
});

console.log('Balance:', walletDetails.data.wallet.balance);
console.log('Recent transactions:', walletDetails.data.transactions);
```

#### Get Wallet Transactions

Get transactions for a specific wallet address:

```javascript
const transactions = await client.customer.getWalletTransactions({
  walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
  customerId: 'customer_abc',
  type: 'DEPOSIT' // Optional: filter by DEPOSIT or WITHDRAW
});

console.log('Transactions:', transactions.data);
```

### Transaction API

#### Withdraw Asset

Submit a withdrawal request from the tenant hot wallet to a user wallet:

```javascript
const result = await client.transaction.withdrawAsset({
  walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
  userId: 'user_12345',
  customerId: 'customer_abc',
  amount: 50
});

console.log('Transaction status:', result.data.transacionStatus);
console.log('Transaction hash:', result.data.txHash);
```

**Note:** Withdrawals under 100 units are automatically completed. Larger withdrawals require approval.

#### Get Transactions

Get paginated transaction list with optional filters:

```javascript
const result = await client.transaction.getTransactions({
  customerId: 'customer_abc',
  userId: 'user_12345',
  status: 'COMPLETED',
  fromDate: '2024-01-01T00:00:00Z',
  toDate: '2024-12-31T23:59:59Z',
  page: 1,
  limit: 20
});

console.log('Total transactions:', result.data.total);
console.log('Transactions:', result.data.transactions);
```

**Available status values:**
- `COMPLETED` - Transaction completed successfully
- `WAITING_APPROVAL` - Awaiting approval (for large withdrawals)
- `PENDING` - Transaction pending
- `CANCELLED` - Transaction cancelled
- `REJECTED` - Transaction rejected

#### Approve/Reject Withdrawal

Approve or reject a withdrawal that's waiting for approval:

```javascript
// Approve
const approveResult = await client.transaction.approveWithdraw({
  transactionId: 'txn_123',
  approve: true
});

// Reject
const rejectResult = await client.transaction.approveWithdraw({
  transactionId: 'txn_456',
  approve: false
});
```

## Configuration Management

You can update the configuration at runtime:

```javascript
// Update customer ID
client.setCustomerId('new-customer-id');

// Update API key
client.setApiKey('new-api-key');
```

## Error Handling

The SDK automatically handles errors and provides detailed error information:

```javascript
try {
  const wallet = await client.customer.createWallet({
    userId: 'user_12345',
    customerId: 'invalid_customer'
  });
} catch (error) {
  console.error('Error status:', error.status);
  console.error('Error message:', error.message);
  console.error('Error data:', error.data);
}
```

## TypeScript Support

While this SDK is written in JavaScript, it includes JSDoc annotations for better IDE support and type hints.

## Examples

### Complete Workflow Example

```javascript
const BuildPayClient = require('buildpay-sdk');

async function main() {
  // Initialize client
  const client = new BuildPayClient({
    baseURL: 'https://api.buildpay.com',
    apiKey: 'your-api-key'
  });

  try {
    // 1. Create a customer
    const customerResult = await client.customer.createCustomer({
      name: 'My Company',
      rpcUrl: 'https://bsc-dataseed.binance.org/'
    });
    const customerId = customerResult.data.customerId;
    console.log('Created customer:', customerId);

    // 2. Create a wallet for a user
    const walletResult = await client.customer.createWallet({
      userId: 'user_001',
      customerId: customerId
    });
    console.log('Created wallet:', walletResult.data.address);

    // 3. Get wallet details
    const walletDetails = await client.customer.getUserWalletDetails({
      userId: 'user_001',
      customerId: customerId
    });
    console.log('Wallet balance:', walletDetails.data.wallet.balance);

    // 4. Submit a withdrawal
    const withdrawResult = await client.transaction.withdrawAsset({
      walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
      userId: 'user_001',
      customerId: customerId,
      amount: 25
    });
    console.log('Withdrawal status:', withdrawResult.data.transacionStatus);

    // 5. Get transaction history
    const transactions = await client.transaction.getTransactions({
      customerId: customerId,
      userId: 'user_001',
      page: 1,
      limit: 10
    });
    console.log('Total transactions:', transactions.data.total);

  } catch (error) {
    console.error('Error:', error.message);
  }
}

main();
```

## License

MIT

## Support

For issues, questions, or contributions, please visit:
https://github.com/amrat98/buildpay-nodejs/issues
