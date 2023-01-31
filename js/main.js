let eventBus = new Vue()
Vue.component('product-details', {
    props: {
        details: {
            type: Array,
            required: true
        }
    },
    template: `
           <ul>
                <li v-for="detail in details">{{ detail }}</li>
           </ul>
      `
})

Vue.component('product', {
        props: {
            premium: {
                type: Boolean,
                required: true
            }
        },

        template: `
	<div class="product">
        <div class="product-image">
            <img :src="image" :alt="altText"/>
        </div>
        <div class="product-info">
            <h1>{{ title }}</h1>
            <p>{{ description }}</p>
            <p v-if="inStock">In stock</p>
            <p v-else style="text-decoration: line-through">Out of Stock</p>
            <a v-bind:href="link">More products like this</a> <br>
            <span v-if="onSale">ON SALE</span>
            
            <span v-else="onSale"></span> 
            <p>{{sale}}</p>
            <div v-for="size in sizes">{{size}}</div>      
            <info-tabs :shipping="shipping" :details="details"></info-tabs> 
            <div class="color-box" v-for="(variant, index) in variants" :key="variant.variantId" :style="{ backgroundColor:variant.variantColor }" @mouseover="updateProduct(index)">
            
            </div>
            <button v-on:click="addToCart"
             :disabled="!inStock"
              :class="{ disabledButton: !inStock }"> Add to cart </button><br>
            <button v-on:click="removeToCart">Remove from cart</button>
        </div>
        
            <product-tabs :reviews="reviews"></product-tabs>
        </div>
 `,
        data() {
            return {
                product: "Socks",
                brand: 'Vue Mastery',
                description: "A pair of warm, fuzzy socks",
                selectedVariant: 0,
                link: "https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=socks",
                altText: "A pair of socks",
                onSale: true,
                details: ['80% cotton', '20% polyester', 'Gender-neutral'],
                reviews: [],
                variants: [
                    {
                        variantId: 2234,
                        variantColor: 'green',
                        variantImage: "./assets/vmSocks-green-onWhite.jpg",
                        variantQuantity: 10
                    },
                    {
                        variantId: 2235,
                        variantColor: 'blue',
                        variantImage: "./assets/vmSocks-blue-onWhite.jpg",
                        variantQuantity: 0
                    }
                ],
                sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
                cart: 0
            }
        },
        methods: {
            addToCart() {
                this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId);
            },

            updateProduct(index) {
                this.selectedVariant = index;
                console.log(index);
            },

            removeToCart() {
                this.$emit('remove-to-cart', this.variants[this.selectedVariant].variantId)
            },

        },
        computed: {
            title() {
                return this.brand + ' ' + this.product;
            },
            image() {
                return this.variants[this.selectedVariant].variantImage;
            },
            inStock() {
                return this.variants[this.selectedVariant].variantQuantity
            },

            shipping() {
                if (this.premium) {
                    return "Free";
                } else {
                    return 2.99
                }
            },

            sale() {
                if (this.onSale) {
                    return this.brand + ' ' + this.product + ' are on sale'
                }
                return this.brand + ' ' + this.product + ' are not sale'
            }
        },
        mounted() {
            eventBus.$on('review-submitted', productReview => {
                this.reviews.push(productReview)
            })
        }

    },


    Vue.component('product-review', {
        template: `
           
        <form class="review-form" @submit.prevent="onSubmit">
             <p>
               <label for="name">Name:</label>
               <input  id="name" v-model="name" placeholder="name">
             </p>
            
             <p>
               <label for="review">Review:</label>
               <textarea  id="review" v-model="review"></textarea>
             </p>
            
             <p>
               <label for="rating">Rating:</label>
               <select  id="rating" v-model.number="rating">
                 <option>5</option>
                 <option>4</option>
                 <option>3</option>
                 <option>2</option>
                 <option>1</option>
               </select>
             </p>
                <p>Would you recommend this product?</p>
                    <div>
                        <label for="question">yes</label>
                        <input type="radio" value="yes" v-model="question">
                        <label for="question">no</label>
                        <input type="radio" value="no" v-model="question">
                    </div>
             <p>
               <input  type="submit" value="Submit"> 
             </p>
                <p v-if="errors.length">
                     <b>Please correct the following error(s):</b>
                     <ul>
                        <li v-for="error in errors">{{ error }}</li>
                     </ul>
                </p>
       </form>
    
 `,
        data() {
            return {
                name: null,
                review: null,
                rating: null,
                question: null,
                errors: [],
            }
        },
        methods: {
            onSubmit() {
                if (this.name && this.review && this.rating) {
                    let productReview = {
                        name: this.name,
                        review: this.review,
                        rating: this.rating,
                        question: this.question,
                    }
                    eventBus.$emit('review-submitted', productReview)
                    this.name = null
                    this.review = null
                    this.rating = null
                    this.question = null
                } else {
                    if (!this.name) this.errors.push("Name required.")
                    if (!this.review) this.errors.push("Review required.")
                    if (!this.rating) this.errors.push("Rating required.")
                    if (!this.question) this.errors.push("Question required.")
                }
            },

        }
    }),

    Vue.component('product-tabs', {
        props: {
            reviews: {
                type: Array,
                required: false
            }
        },

        template: `
     <div>   
       <ul>
         <span class="tab" 
         :class="{ activeTab: selectedTab === tab }"
         v-for="(tab, index) in tabs"
         @click="selectedTab = tab"
         :key="tab"
         >{{ tab }}</span>
       </ul>
       <div v-show="selectedTab === 'Reviews'">
         <p v-if="!reviews.length">There are no reviews yet.</p>
         <ul v-else>
           <li v-for="review in reviews"
           :key="index">
           <p>{{ review.name }}</p>
           <p>Rating: {{ review.rating }}</p>
           <p>{{ review.review }}</p>
           <p>{{review.question}}</p>
           </li>
         </ul>
       </div>
       <div v-show="selectedTab === 'Make a Review'">
         <product-review @review-submitted="addReview"></product-review>
       </div>
     </div>
`,

        data() {
            return {
                tabs: ['Reviews', 'Make a Review'],
                selectedTab: 'Reviews'
            }
        }
    }),
)

Vue.component('info-tabs', {
  props: {
    shipping: {
      required: true
    },
    details: {
      type: Array,
      required: true
    }
  },
  template: `
    <div>
    
      <ul>
        <span class="tab" 
              :class="{ activeTab: selectedTab === tab }"
              v-for="(tab, index) in tabs"
              @click="selectedTab = tab"
              :key="tab"
        >{{ tab }}</span>
      </ul>

      <div v-show="selectedTab === 'Shipping'">
        <p>{{ shipping }}</p>
      </div>

      <div v-show="selectedTab === 'Details'">
        <ul>
          <li v-for="detail in details">{{ detail }}</li>
        </ul>
      </div>
  
    </div>
  `,
  data() {
    return {
      tabs: ['Shipping', 'Details'],
      selectedTab: 'Shipping'
    }
  }
})


let app = new Vue({
    el: '#app',
    data: {
        premium: true,
        cart: []
    },
    methods: {
        updateCart(id) {
            this.cart.push(id)
        },
        removeCart(id) {
            for (let i = this.cart.length - 1; i >= 0; i--) {
                if (this.cart[i] === id) {
                    this.cart.splice(i, 1);
                }
            }
        }
    }
})

