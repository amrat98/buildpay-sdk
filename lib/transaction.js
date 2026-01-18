/**
 * Transaction API Module
 * 
 * Handles all transaction-related API calls including:
 * - Withdraw assets
 * - Get transactions
 * - Approve/reject withdrawals
 */

class TransactionAPI {
    /**
     * @param {import('axios').AxiosInstance} httpClient - Axios instance
     * @param {Object} config - SDK configuration
     */
    constructor(httpClient, config) {
        this.httpClient = httpClient;
        this.config = config;
    }

    /**
     * Submit a withdraw request from the tenant hot wallet to a user wallet
     * 
     * @param {Object} params - Withdraw parameters
     * @param {string} params.walletAddress - Destination wallet address for the withdrawal
     * @param {string} params.userId - User ID as a string value
     * @param {string} params.customerId - Customer/Tenant ID (optional if set in config)
     * @param {number} params.amount - Amount to withdraw
     * @returns {Promise<Object>} Transaction details
     * 
     * @example
     * const result = await client.transaction.withdrawAsset({
     *   walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
     *   userId: 'user123',
     *   customerId: 'customer123',
     *   amount: 50
     * });
     */
    async withdrawAsset(params) {
        const { walletAddress, userId, customerId, amount } = params;
        
        const payload = {
            walletAddress,
            userId,
            customerId: customerId || this.config.customerId,
            amount,
        };

        const response = await this.httpClient.post('/api/v1/assetsTransaction/WithdrawAsset', payload);
        return response.data;
    }

    /**
     * Get transactions with pagination and optional filters
     * 
     * @param {Object} [params] - Query parameters
     * @param {string} [params.customerId] - Return transactions for a specific customer
     * @param {string} [params.userId] - Filter transactions by user ID
     * @param {string} [params.status] - Filter by transaction status
     * @param {string} [params.fromDate] - ISO string for start date
     * @param {string} [params.toDate] - ISO string for end date
     * @param {number} [params.page=1] - Page number
     * @param {number} [params.limit=10] - Results per page
     * @returns {Promise<Object>} Paginated transactions response
     * 
     * @example
     * const result = await client.transaction.getTransactions({
     *   customerId: 'customer123',
     *   userId: 'user123',
     *   status: 'COMPLETED',
     *   page: 1,
     *   limit: 20
     * });
     */
    async getTransactions(params = {}) {
        const queryParams = {
            customerId: params.customerId || this.config.customerId,
            userId: params.userId,
            status: params.status,
            fromDate: params.fromDate,
            toDate: params.toDate,
            page: params.page || 1,
            limit: params.limit || 10,
        };

        // Remove undefined values
        Object.keys(queryParams).forEach(key => 
            queryParams[key] === undefined && delete queryParams[key]
        );

        const response = await this.httpClient.get('/api/v1/assetsTransaction/transactions', {
            params: queryParams,
        });
        return response.data;
    }

    /**
     * Approve or reject a withdraw request that is waiting for approval
     * 
     * @param {Object} params - Approval parameters
     * @param {string} params.transactionId - Transaction ID
     * @param {boolean} params.approve - true to approve, false to reject
     * @returns {Promise<Object>} Updated transaction details
     * 
     * @example
     * const result = await client.transaction.approveWithdraw({
     *   transactionId: 'txn123',
     *   approve: true
     * });
     */
    async approveWithdraw(params) {
        const { transactionId, approve } = params;

        const response = await this.httpClient.post('/api/v1/assetsTransaction/withdraw/approve', {
            transactionId,
            approve,
        });
        return response.data;
    }
}

module.exports = TransactionAPI;
