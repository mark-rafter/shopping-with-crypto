const app = new Vue({
    el: '#app',
    data: {
        sellerCrypto: 'XMR',
        sellerCheckoutTotal: 0.000,
        walletToSellerFee: 0.00,
        exchangeWithdrawalFee: 0.00,
        exchangeToWalletIncomingFee: 0.00,
        exchangeFiatPrice: 50.00,
        exchangeFiat: 'GBP',
    },
    methods: {
        toPrice(amount, symbol) {
            if (!symbol) {
                symbol = this.sellerCrypto;
            }

            const currency = this.currencyList.find(c => c.symbol === symbol);

            const factor = Math.pow(10, currency.precision);
            const roundedAmount = Math.round(amount * factor);

            return Dinero({
                amount: roundedAmount,
                currency: currency.symbol,
                precision: currency.precision
            });
        }
    },
    computed: {
        getCryptoStep: function () {
            const currency = this.currencyList.find(c => c.symbol === this.sellerCrypto);
            return `0.${'0'.repeat(currency.precision - 1)}1`;
        },
        getCryptoRegexPattern: function () {
            const currency = this.currencyList.find(c => c.symbol === this.sellerCrypto);
            return `^\d+(?:\.\d{1,${currency.precision}})?$`;
        },
        getFinalTransactionAmount: function () {
            return this.toPrice(this.walletToSellerFee)
                .add(this.toPrice(this.sellerCheckoutTotal));
        },
        getExchangeToWalletAmount: function () {
            return this.getFinalTransactionAmount
                .add(this.toPrice(this.exchangeWithdrawalFee))
                .add(this.toPrice(this.exchangeToWalletIncomingFee));
        },
        getExchangeIncomingFiatAmount: function () {
            return this.toPrice(this.exchangeFiatPrice, this.exchangeFiat)
                .multiply(this.getExchangeToWalletAmount.toUnit());
        },
    },
    created() {
        this.cryptoList = [
            { symbol: 'BTC', text: 'Bitcoin', precision: 8 },
            { symbol: 'LTC', text: 'Litecoin', precision: 8 },
            { symbol: 'XMR', text: 'Monero', precision: 12 },
            { symbol: 'ETH', text: 'Ethereum', precision: 18 },
        ];

        this.fiatList = [
            { symbol: 'GBP', text: 'GBP', precision: 2 },
            { symbol: 'EUR', text: 'EUR', precision: 2 },
            { symbol: 'USD', text: 'USD', precision: 2 },
        ];

        this.currencyList = [
            ...this.cryptoList,
            ...this.fiatList,
        ];
    },
    mounted() {
        if (typeof window.localStorage !== 'undefined') {
            const localStorageData = localStorage.getItem('data');
            if (localStorageData) {
                try {
                    const deserialisedData = JSON.parse(localStorageData);
                    const currentData = this.data;
                    this.data = {
                        ...currentData,
                        ...deserialisedData
                    };
                } catch (e) {
                    localStorage.removeItem('data');
                }
            }
        }
    },
    beforeDestroy() {
        if (typeof window.localStorage !== 'undefined') {
            const serialisedData = JSON.stringify(this.data);
            localStorage.setItem('data', serialisedData);
        }
    }
});

