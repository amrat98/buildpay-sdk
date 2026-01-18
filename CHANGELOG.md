# Changelog

All notable changes to the BuildPay SDK will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-01-18

### Added
- Initial release of BuildPay SDK
- Customer Management API
  - Create customer
  - Get customer details
  - Create wallet for users
  - Get wallet details
  - Get wallet transactions
- Transaction API
  - Submit withdrawal requests
  - Get paginated transaction list with filters
  - Approve/reject withdrawal requests
- TypeScript type definitions for better IDE support
- Comprehensive documentation and examples
- Error handling with detailed error messages
- Support for custom headers (API key, customer ID)
- Configurable timeout for requests
- Axios-based HTTP client with interceptors

### Features
- **Automatic approval**: Withdrawals under 100 units are automatically approved
- **Manual approval**: Withdrawals over 100 units require manual approval
- **Pagination**: Support for paginated transaction queries
- **Filtering**: Filter transactions by user, status, date range
- **Type safety**: TypeScript definitions for improved developer experience
- **Examples**: Comprehensive examples for common use cases

[1.0.0]: https://github.com/amrat98/buildpay-nodejs/releases/tag/v1.0.0
