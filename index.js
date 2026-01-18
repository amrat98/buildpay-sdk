/**
 * BuildPay SDK - Main Entry Point
 * 
 * A Node.js SDK for interacting with the BuildPay API
 * 
 * @example
 * const BuildPayClient = require('buildpay-sdk');
 * 
 * const client = new BuildPayClient({
 *   baseURL: 'https://api.buildpay.com',
 *   apiKey: 'your-api-key',
 *   customerId: 'your-customer-id'
 * });
 * 
 * // Use the SDK
 * const wallet = await client.customer.createWallet({ userId: 'user123' });
 */

const axios = require('axios');
const TransactionAPI = require('./lib/transaction');
const CustomerAPI = require('./lib/customer');

class BuildPayClient {
    /**
     * Create a new BuildPay client instance
     * 
     * @param {Object} config - Configuration options
     * @param {string} config.baseURL - The base URL of the BuildPay API
     * @param {string} [config.apiKey] - API key for authentication (if required)
     * @param {string} [config.customerId] - Default customer ID for API calls
     * @param {number} [config.timeout=30000] - Request timeout in milliseconds
     */
    constructor(config = {}) {
        if (!config.baseURL) {
            throw new Error('BuildPay SDK requires a baseURL in the configuration');
        }

        this.config = {
            baseURL: config.baseURL,
            apiKey: config.apiKey,
            customerId: config.customerId,
            timeout: config.timeout || 30000,
        };

        // Create axios instance with default configuration
        this.httpClient = axios.create({
            baseURL: this.config.baseURL,
            timeout: this.config.timeout,
            headers: {
                'Content-Type': 'application/json',
                ...(this.config.apiKey && { 'Authorization': `Bearer ${this.config.apiKey}` }),
                ...(this.config.customerId && { 'X-Customer-Id': this.config.customerId }),
            },
        });

        // Add response interceptor for error handling
        this.httpClient.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    const err = new Error(error.response.data.message || error.message);
                    err.status = error.response.status;
                    err.data = error.response.data;
                    throw err;
                } else if (error.request) {
                    // The request was made but no response was received
                    throw new Error('No response received from the server');
                } else {
                    // Something happened in setting up the request that triggered an Error
                    throw error;
                }
            }
        );

        // Initialize API modules
        this.transaction = new TransactionAPI(this.httpClient, this.config);
        this.customer = new CustomerAPI(this.httpClient, this.config);
    }

    /**
     * Update the customer ID for all subsequent requests
     * 
     * @param {string} customerId - The new customer ID
     */
    setCustomerId(customerId) {
        this.config.customerId = customerId;
        this.httpClient.defaults.headers['X-Customer-Id'] = customerId;
    }

    /**
     * Update the API key for all subsequent requests
     * 
     * @param {string} apiKey - The new API key
     */
    setApiKey(apiKey) {
        this.config.apiKey = apiKey;
        this.httpClient.defaults.headers['Authorization'] = `Bearer ${apiKey}`;
    }
}

module.exports = BuildPayClient;
