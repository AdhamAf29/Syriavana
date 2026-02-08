<template>
  <div class="company-profile-page">
    <div v-if="loading" class="loading">Loading...</div>
    <div v-else-if="!company" class="error">Company not found</div>
    
    <div v-else>
      <!-- Hero Header -->
      <div class="profile-header">
        <div class="container header-content">
          <div class="company-logo">
            {{ company.name.charAt(0) }}
          </div>
          <div class="company-info">
            <h1>{{ company.name }}</h1>
            <div class="header-rating">
              <span class="stars">★</span> 
              <span class="rating-val">{{ averageRating }}</span>
              <span class="review-count">({{ reviews.length }} Reviews)</span>
            </div>
            <p class="contact"><PhEnvelope /> {{ company.companyProfile?.contactInfo || company.email }}</p>
          </div>
        </div>
      </div>

      <div class="container content-grid">
        <!-- Main Content -->
        <div class="main-column">
          <section class="section about">
            <h2>About Us</h2>
            <p>{{ company.companyProfile?.description || "No description provided." }}</p>
          </section>

          <section class="section trips">
            <h2>Our Trips ({{ trips.length }})</h2>
            <div class="trips-grid">
              <div v-for="trip in trips" :key="trip.id" class="trip-card">
                <div class="trip-img" :style="{ backgroundImage: `url(${trip.images?.[0] || '/images/placeholder.jpg'})` }"></div>
                <div class="trip-content">
                  <h3>{{ trip.title }}</h3>
                  <div class="meta">
                    <span>{{ trip.duration }}</span>
                    <span class="price">${{ trip.price }}</span>
                  </div>
                  <router-link :to="`/trips/${trip.id}`" class="btn-view">View Details</router-link>
                </div>
              </div>
            </div>
          </section>
        </div>

        <!-- Sidebar -->
        <div class="sidebar-column">
          <section class="section reviews">
            <h2>Reviews</h2>
            <div class="rating-summary">
              <div class="stars" style="color: #f39c12; font-size: 1.2rem; font-weight: bold;">
                ★ {{ averageRating }} / 5
              </div>
              <span>{{ reviews.length }} Reviews</span>
            </div>
            
            <div class="reviews-list">
              <div v-for="review in reviews" :key="review.id" class="review-item">
                <div class="review-header">
                  <strong>{{ review.userId?.name || 'User' }}</strong>
                  <span class="date">{{ new Date(review.createdAt).toLocaleDateString() }}</span>
                </div>
                <div class="review-rating">Rating: {{ review.rating }}/5</div>
                <p>{{ review.comment }}</p>
              </div>
              <div v-if="reviews.length === 0" class="no-reviews">No reviews yet.</div>
            </div>

            <button v-if="auth.loggedIn && auth.user.role === 'user'" @click="showReviewForm = true" class="btn-review">Write a Review</button>
          </section>
        </div>
      </div>
    </div>

    <!-- Review Modal -->
    <div v-if="showReviewForm" class="modal-overlay">
      <div class="modal">
        <h3>Write a Review</h3>
        <form @submit.prevent="submitReview">
          <div class="form-group">
            <label>Rating</label>
            <div class="rating-input">
              <span 
                v-for="n in 5" 
                :key="n" 
                @click="newReview.rating = n"
                :class="{ active: n <= newReview.rating }"
              >★</span>
            </div>
          </div>
          <div class="form-group">
            <label>Your Experience</label>
            <textarea v-model="newReview.comment" rows="4" required placeholder="Share your experience with this company..." @input="autoResize" class="auto-grow"></textarea>
          </div>
          <div class="modal-actions">
            <button type="button" @click="showReviewForm = false" class="btn-cancel">Cancel</button>
            <button type="submit" class="btn-submit" :disabled="submitting">
              {{ submitting ? 'Submitting...' : 'Submit Review' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { useAuthStore } from "../store/auth";
import { PhEnvelope } from "@phosphor-icons/vue";
import api from "../api";

const route = useRoute();
const auth = useAuthStore();
const company = ref(null);
const trips = ref([]);
const reviews = ref([]);
const loading = ref(true);
const showReviewForm = ref(false);
const submitting = ref(false);
const newReview = ref({ rating: 5, comment: "" });

function autoResize(event) {
  event.target.style.height = 'auto';
  event.target.style.height = event.target.scrollHeight + 'px';
}

const averageRating = computed(() => {
  if (!reviews.value.length) return "0.0";
  const sum = reviews.value.reduce((acc, r) => acc + r.rating, 0);
  return (sum / reviews.value.length).toFixed(1);
});

async function submitReview() {
  if (!auth.loggedIn) return;
  submitting.value = true;
  try {
    await api.post(`/api/companies/${route.params.id}/reviews`, {
      rating: newReview.value.rating,
      comment: newReview.value.comment
    });
    
    // Refresh reviews
    const res = await api.get(`/api/companies/${route.params.id}`);
    reviews.value = res.data.reviews || [];
    
    // Reset and close
    showReviewForm.value = false;
    newReview.value = { rating: 5, comment: "" };
  } catch (e) {
    console.error(e);
    alert("Failed to submit review. Please try again.");
  } finally {
    submitting.value = false;
  }
}

onMounted(async () => {
  try {
    const res = await api.get(`/api/companies/${route.params.id}`);
    company.value = res.data;
    trips.value = res.data.trips || [];
    reviews.value = res.data.reviews || [];
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.profile-header {
  background-color: #235789;
  color: white;
  padding: 60px 0;
  margin-bottom: 40px;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 30px;
}

.company-logo {
  width: 100px;
  height: 100px;
  background: white;
  color: #235789;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  font-weight: bold;
}

.company-info h1 {
  margin: 0 0 10px 0;
  font-size: 2.5rem;
}

.header-rating {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 15px;
  font-size: 1.1rem;
}

.header-rating .stars {
  color: #f39c12;
}

.header-rating .rating-val {
  font-weight: bold;
}

.header-rating .review-count {
  opacity: 0.8;
  font-size: 0.9rem;
}

.contact {
  display: flex;
  align-items: center;
  gap: 8px;
  opacity: 0.9;
}

.content-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 40px;
}

.section {
  margin-bottom: 40px;
}

.section h2 {
  color: #235789;
  border-bottom: 2px solid #eee;
  padding-bottom: 10px;
  margin-bottom: 20px;
}

.trips-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.trip-card {
  background: white;
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
}

.trip-img {
  height: 150px;
  background-size: cover;
  background-position: center;
}

.trip-content {
  padding: 15px;
}

.trip-content h3 {
  margin: 0 0 10px 0;
  font-size: 1.1rem;
}

.meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  font-weight: 600;
  color: #666;
}

.price {
  color: var(--primary);
}

.btn-view {
  display: block;
  text-align: center;
  background: #f0f0f0;
  color: #333;
  padding: 8px;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 600;
}

.reviews-list {
  background: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
}

.review-item {
  border-bottom: 1px solid #eee;
  padding-bottom: 15px;
  margin-bottom: 15px;
}

.review-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}

.date {
  font-size: 0.8rem;
  color: #999;
}

.review-rating {
  color: #f39c12;
  font-weight: bold;
  margin-bottom: 5px;
}

.btn-review {
  width: 100%;
  padding: 10px;
  margin-top: 15px;
  background: var(--primary);
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
}

@media (max-width: 768px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  padding: 30px;
  border-radius: 8px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
}

.modal h3 {
  margin-top: 0;
  color: #235789;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
}

.rating-input {
  font-size: 2rem;
  color: #ddd;
  cursor: pointer;
}

.rating-input .active {
  color: #f39c12;
}

textarea.auto-grow {
  resize: none;
  overflow-y: hidden;
  min-height: 80px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.btn-cancel {
  background: #eee;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
}

.btn-submit {
  background: var(--primary);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
}
</style>
