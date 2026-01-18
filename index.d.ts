// Type definitions for buildpay-sdk
// Project: https://github.com/amrat98/buildpay-nodejs
// Definitions by: BuildPay Team

export = BuildPayClient;

declare class BuildPayClient {
    constructor(config: BuildPayClient.Config);
    
    transaction: BuildPayClient.TransactionAPI;
    customer: BuildPayClient.CustomerAPI;
    
    setCustomerId(customerId: string): void;
    setApiKey(apiKey: string): void;
}

declare namespace BuildPayClient {
    interface Config {
        baseURL: string;
        apiKey?: string;
        customerId?: string;
        timeout?: number;
    }

    interface Response<T> {
        data: T;
        message: string;
    }

    interface PaginatedResponse<T> {
        data: {
            transactions: T[];
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
        message: string;
    }

    interface Transaction {
        _id: string;
        customerId: string;
        userId: string;
        amount: number;
        // Note: Property names match backend API (formWalletAddress and transacion* are intentional)
        formWalletAddress: string;
        toWalletAddress: string;
        transacionType: 'DEPOSIT' | 'WITHDRAW' | 'TRANSFER' | 'CREDIT' | 'DEBIT' | 'PLAN PURCHASE';
        transacionStatus: 'CANCELLED' | 'COMPLETED' | 'PENDING' | 'WAITING_APPROVAL' | 'SELF_TRANSFER' | 'REJECTED';
        transactionFee?: number;
        remark?: string;
        hash?: string;
        txHash?: string;
        createdAt: string;
        updatedAt: string;
    }

    interface Wallet {
        _id: string;
        userId: string;
        customerId: string;
        address: string;
        balance: number;
        incomeBalance: number;
        totalDeposit: number;
        totalSpent: number;
        totalFloatingBalance: number;
        withdrawLimitAmount: number;
        withdrawLimitCount: number;
        currentWithdrawLimitAmount: number;
        currentWithdrawLimitCount: number;
        isBlocked: boolean;
        createdAt: string;
        updatedAt: string;
    }

    interface WalletDetails {
        wallet: Wallet;
        transactions: Transaction[];
    }

    interface Customer {
        _id: string;
        name: string;
        rpcUrl: string;
        tokenAddress?: string;
        vaultContractAddress?: string;
        adminAddress?: string;
        hotwalletAddress?: string;
        createdAt: string;
        updatedAt: string;
    }

    class TransactionAPI {
        withdrawAsset(params: {
            walletAddress: string;
            userId: string;
            customerId?: string;
            amount: number;
        }): Promise<Response<Transaction>>;

        getTransactions(params?: {
            customerId?: string;
            userId?: string;
            status?: string;
            fromDate?: string;
            toDate?: string;
            page?: number;
            limit?: number;
        }): Promise<PaginatedResponse<Transaction>>;

        approveWithdraw(params: {
            transactionId: string;
            approve: boolean;
        }): Promise<Response<Transaction>>;
    }

    class CustomerAPI {
        createCustomer(params: {
            name: string;
            rpcUrl: string;
            tokenAddress?: string;
            vaultContractAddress?: string;
            adminAddress?: string;
            hotwalletAddress?: string;
            adminPvtKey?: string;
            hotwalletPvtKey?: string;
        }): Promise<Response<{ customerId: string }>>;

        getCustomer(customerId: string): Promise<Response<Customer>>;

        createWallet(params: {
            userId: string;
            customerId?: string;
        }): Promise<Response<Wallet>>;

        getWalletTransactions(params: {
            walletAddress: string;
            customerId?: string;
            type?: 'DEPOSIT' | 'WITHDRAW';
        }): Promise<Response<Transaction[]>>;

        getUserWalletDetails(params: {
            userId: string;
            customerId?: string;
        }): Promise<Response<WalletDetails>>;
    }
}
