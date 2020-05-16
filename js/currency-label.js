Vue.component('currency-label', {
    props: {
        sellerCrypto: String,
    },
    computed: {
        getSellerCryptoImg: function () {
            return `img/${this.sellerCrypto.toLowerCase()}.svg`;
        }
    },
    template: `
    <div class="input-group-prepend">
        <div class="input-group-text">
            <img class="mr-1" width="22px" :src="getSellerCryptoImg" />
            {{ sellerCrypto }}
        </div>
    </div>
    `
});