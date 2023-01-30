 
let app = new Vue({
    el: '#app',
    data: {
      product: 'Socks',
      brand: 'Vue Mastery',
      selectedVariant: 0,
      altText: "A pair of socks",
      link: 'https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=socks',
      inStock: true,
      details: ['80% cotton', '20% polyester', 'Gender-neutral'],
      variants: [
        {
          variantId: 2234,
          variantColor: 'green',
          variantImage: "./assets/vmSocks-green-onWhite.jpg",
          variantQuantity: 10,
        },
        {
          variantId: 2235,
          variantColor: 'blue',
          variantImage: "./assets/vmSocks-blue-onWhite.jpg",
          variantQuantity: 0  
        }
      ],
      cart: 0,
      onSale: true,
    },
    methods: {
      addToCart: function() {
        this.cart += 1
      },
      updateProduct: function(index) {  
        this.selectedVariant = index
    },
    },
    computed: {
        title() {
            return this.brand + ' ' + this.product  
        },
        image(){
            return this.variants[this.selectedVariant].variantImage
        },
        inStock(){
            return this.variants[this.selectedVariant].variantQuantity
        },
        sale() {
          if (this.onSale) {
            return this.brand + ' ' + this.product + ' are on sale!'
          } 
            return  this.brand + ' ' + this.product + ' are not on sale'
        }
     },
     
     
  })