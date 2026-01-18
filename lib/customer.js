/**
 * Customer API Module
 * 
 * Handles all customer/wallet-related API calls including:
 * - Create customers
 * - Get customer details
 * - Create wallets
 * - Get wallet transactions
 * - Get wallet details
 */

class CustomerAPI {
    /**
     * @param {import('axios').AxiosInstance} httpClient - Axios instance
     * @param {Object} config - SDK configuration
     */
    constructor(httpClient, config) {
        this.httpClient = httpClient;
        this.config = config;
    }

    /**
     * Create a SaaS customer (tenant)
     * 
     * @param {Object} params - Customer creation parameters
     * @param {string} params.name - Customer name
     * @param {string} params.rpcUrl - RPC URL for blockchain
     * @param {string} [params.tokenAddress] - Token contract address
     * @param {string} [params.vaultContractAddress] - Vault contract address
     * @param {string} [params.adminAddress] - Admin wallet address
     * @param {string} [params.hotwalletAddress] - Hot wallet address
     * @param {string} [params.adminPvtKey] - Admin private key
     * @param {string} [params.hotwalletPvtKey] - Hot wallet private key
     * @returns {Promise<Object>} Customer creation response with customerId
     * 
     * @example
     * const result = await client.customer.createCustomer({
     *   name: 'Acme Corp',
     *   rpcUrl: 'https://bsc-dataseed.binance.org/',
     *   tokenAddress: '0x1234567890abcdef1234567890abcdef12345678'
     * });
     */
    async createCustomer(params) {
        const response = await this.httpClient.post('/api/v1/customers/create', params);
        return response.data;
    }

    /**
     * Get SaaS customer by ID
     * 
     * @param {string} customerId - Customer ID
     * @returns {Promise<Object>} Customer details
     * 
     * @example
     * const customer = await client.customer.getCustomer('customer123');
     */
    async getCustomer(customerId) {
        const response = await this.httpClient.get(`/api/v1/customers/${customerId}`);
        return response.data;
    }

    /**
     * Create a wallet for a user within a customer/tenant
     * 
     * @param {Object} params - Wallet creation parameters
     * @param {string} params.userId - User ID as a string value
     * @param {string} [params.customerId] - Customer/Tenant ID (optional if set in config)
     * @returns {Promise<Object>} Created wallet details
     * 
     * @example
     * const wallet = await client.customer.createWallet({
     *   userId: 'user_12345',
     *   customerId: 'customer123'
     * });
     */
    async createWallet(params) {
        const { userId, customerId } = params;

        const payload = {
            userId,
            customerId: customerId || this.config.customerId,
        };

        const response = await this.httpClient.post('/api/v1/customers/wallet', payload);
        return response.data;
    }

    /**
     * Get deposit/withdraw transactions for a wallet
     * 
     * @param {Object} params - Query parameters
     * @param {string} params.walletAddress - Blockchain wallet address
     * @param {string} [params.customerId] - Customer/Tenant ID (optional if set in config)
     * @param {string} [params.type] - Filter by transaction type (DEPOSIT or WITHDRAW)
     * @returns {Promise<Object>} List of transactions
     * 
     * @example
     * const transactions = await client.customer.getWalletTransactions({
     *   walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
     *   customerId: 'customer123',
     *   type: 'DEPOSIT'
     * });
     */
    async getWalletTransactions(params) {
        const queryParams = {
            walletAddress: params.walletAddress,
            customerId: params.customerId || this.config.customerId,
            type: params.type,
        };

        // Remove undefined values
        Object.keys(queryParams).forEach(key => 
            queryParams[key] === undefined && delete queryParams[key]
        );

        const response = await this.httpClient.get('/api/v1/customers/wallet/transactions', {
            params: queryParams,
        });
        return response.data;
    }

    /**
     * Get wallet details for a specific user and customer
     * 
     * @param {Object} params - Query parameters
     * @param {string} params.userId - User ID as a string value
     * @param {string} [params.customerId] - Customer/Tenant ID (optional if set in config)
     * @returns {Promise<Object>} Wallet details with recent transactions
     * 
     * @example
     * const walletDetails = await client.customer.getUserWalletDetails({
     *   userId: 'user_12345',
     *   customerId: 'customer123'
     * });
     */
    async getUserWalletDetails(params) {
        const queryParams = {
            userId: params.userId,
            customerId: params.customerId || this.config.customerId,
        };

        // Remove undefined values
        Object.keys(queryParams).forEach(key => 
            queryParams[key] === undefined && delete queryParams[key]
        );

        const response = await this.httpClient.get('/api/v1/customers/wallet/details', {
            params: queryParams,
        });
        return response.data;
    }
}

module.exports = CustomerAPI;
