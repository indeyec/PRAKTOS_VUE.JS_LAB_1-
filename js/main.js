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
    <img alt="#" :src="image" :alt="altText">
  </div>
  <div class="product-info">
    <h1>{{ title }}</h1>
    <p>{{ description }}</p>
    <a v-bind:href="link">More products like this</a> <br>
    <p>{{ sale }}</p>
    <product-details :details="details">{{ details }}</product-details>
    <p>Shipping: {{ shipping }}</p>
    <div @mouseover="updateProduct(index)"
         class="color-box" v-for="(variant, index) in variants"
         :key="variant.variantId" :style="{ backgroundColor:variant.variantColor }">
    </div>
    <ul>
      <li v-for="size in sizes">{{ size }}</li>
    </ul>
    <p v-if="inStock">In stock</p>
    <p v-else-if="inventory <= 10 && inventory > 0">Almost sold out!</p>
    <p v-else style="text-decoration: line-through">Out of Stock</p>
    <button :disabled="!inStock"
            v-on:click="addToCart()"
            :class="{ disabledButton: !inStock }">Add to cart</button>
    <button :disabled="!inStock"
            :class="{ disabledButton: !inStock }"
            v-on:click="deleteFromCart">Delete cart</button>
    
  </div>
  <div>
  <h2>Reviews</h2>
      <p v-if="!reviews.length">There are no reviews yet.</p>
      <ul>
          <li v-for="review in reviews">
            <p>{{ review.name }}</p>
            <p>Rating: {{ review.rating }}</p>
            <p>{{ review.review }}</p>
            <p>Рекомендуют: {{ review.final_question }}</
          </li>
      </ul>
    <product-review @review-submitted="addReview"></product-review>
</div>
</div>
`,
  data() {
      return {
          product: "Socks",
          brand: "Vue",
          description: "A pair of warm, fuzzy socks",
          selectedVariant: 0,
          altText: "A pair of socks",
          link: "https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias=aps&field-keywords=socks",
          
          inventory: 100,
          onSale: true,

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
                  variantQuantity: 0,

              }
          ],

          sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
          reviews: [],
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
      deleteFromCart() {
          this.$emit('delete-from-cart', this.variants[this.selectedVariant].variantId);
      },
      addReview(productReview) {
          this.reviews.push(productReview)
      }
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
      sale() {
          if(!this.onSale) return this.brand + ' ' + this.product + ' Not on Sale!';
          else return this.brand + ' ' + this.product + ' On Sale!';
      },
      shipping() {
          if(this.premium) return "Free";
          else return 2.99
      }
  }
})

Vue.component('product-details', {
  props: {
    details: {
        type: Array,
        required: true,
    }
  },
  template: `
 <ul>
      <li v-for="detail in details">{{ detail }}</li>
 </ul>
`
})

Vue.component('product-review', {
  template: `   
  <form class="review-form" @submit.prevent="onSubmit">
  <p v-if="errors.length">
<b>Please correct the following error(s):</b>
<ul>
 <li v-for="error in errors">{{ error }}</li>
</ul>
</p>
<p>
 <label for="name">Name:</label>
 <input id="name" v-model="name" placeholder="name">
</p>
<p>
 <label for="review">Review:</label>
 <textarea id="review" v-model="review"></textarea>
</p>
<p>
 <label for="rating">Rating:</label>
 <select id="rating" v-model.number="rating">
   <option>5</option>
   <option>4</option>
   <option>3</option>
   <option>2</option>
   <option>1</option>
 </select>
</p>
<p>
<p>Вы бы порекомендовали этот продукт?</p>
<div class="line-input">
<input type="radio" value="Yes" v-model="final_question">
  <label>Да</label>
</div>
<div class="line-input">
  <input type="radio" value="No" v-model="final_question">
  <label>Нет</label>
</div>
</p>
<p>
 <input type="submit" value="Submit"> 
</p>
</form>
  `,
  data() {
      return {
          name: null,
          review: null,
          rating: null,
          errors: [],
          final_question: null,
      }
  },
  methods: {
      onSubmit() {
          if(this.name && this.review && this.rating && this.final_question) {
              let productReview = {
                  name: this.name,
                  review: this.review,
                  rating: this.rating,
                  final_question: this.final_question
              }
              this.$emit('review-submitted', productReview)
              this.name = null
              this.review = null
              this.rating = null
              this.final_question = null
          }
         else {
              if(!this.name) this.errors.push("Name required.")
              if(!this.review) this.errors.push("Review required.")
              if(!this.rating) this.errors.push("Rating required.")
              if(!this.final_question) this.errors.push("Answer to -> Would you recommend this product? required.")
          }
      },
  }
})

Vue.component('product-tabs', {
  template: `
 <div>
   <span class="tab" v-for="(tab, index) in tabs" :key="index">{{ tab }}</span>
 </div>
`,
  data() {
      return {
          tabs: ['Reviews', 'Make a Review']
      }
  }
})


let app = new Vue({
  el: '#app',
  data: {
      premium: true,
      cart: [],
  },
  methods: {
      updateCart(id) {
          this.cart.push(id);
      },
      deleteCart(id) {
          this.cart.pop(id);
      }
  }
})

