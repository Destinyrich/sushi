// Browser-side helper for the admin panel. Cookies carry the session.
async function request(method, url, body) {
  const isForm = typeof FormData !== 'undefined' && body instanceof FormData;
  const res = await fetch(url, {
    method,
    credentials: 'same-origin',
    headers: body && !isForm ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? (isForm ? body : JSON.stringify(body)) : undefined,
  });

  if (res.status === 401 && url.startsWith('/api/admin')) {
    window.location.href = '/admin/login';
    throw new Error('Session expired');
  }

  const data = await res.json().catch(() => null); // 204 has no body
  if (!res.ok) {
    const err = new Error(data?.error || `Request failed (${res.status})`);
    err.status = res.status;
    err.details = data?.details;
    throw err;
  }
  return data;
}

const api = {
  get: (url) => request('GET', url),
  post: (url, body) => request('POST', url, body),
  patch: (url, body) => request('PATCH', url, body),
  delete: (url) => request('DELETE', url),
};

export const authAPI = {
  login: (credentials) => api.post('/api/auth/login', credentials),
  logout: () => api.post('/api/auth/logout'),
};

export const portfolioAPI = {
  // categories
  getCategories: () => api.get('/api/admin/categories'),
  createCategory: (data) => api.post('/api/admin/categories', data),
  deleteCategory: (id) => api.delete(`/api/admin/categories/${id}`),
  // photos
  getPhotos: () => api.get('/api/admin/photos'),
  createPhoto: (data) => api.post('/api/admin/photos', data),
  updatePhoto: (id, data) => api.patch(`/api/admin/photos/${id}`, data),
  deletePhoto: (id) => api.delete(`/api/admin/photos/${id}`),
  // testimonials
  getTestimonials: () => api.get('/api/admin/testimonials'),
  createTestimonial: (data) => api.post('/api/admin/testimonials', data),
  updateTestimonial: (id, data) => api.patch(`/api/admin/testimonials/${id}`, data),
  deleteTestimonial: (id) => api.delete(`/api/admin/testimonials/${id}`),
  // hero slides
  getAdminHeroSlides: () => api.get('/api/admin/hero-slides'),
  createHeroSlide: (data) => api.post('/api/admin/hero-slides', data),
  updateHeroSlide: (id, data) => api.patch(`/api/admin/hero-slides/${id}`, data),
  deleteHeroSlide: (id) => api.delete(`/api/admin/hero-slides/${id}`),
  // gallery spots
  getAdminGallerySpots: () => api.get('/api/admin/gallery-spots'),
  createGallerySpot: (data) => api.post('/api/admin/gallery-spots', data),
  updateGallerySpot: (id, data) => api.patch(`/api/admin/gallery-spots/${id}`, data),
  deleteGallerySpot: (id) => api.delete(`/api/admin/gallery-spots/${id}`),
};

export const bookingAPI = {
  getBookings: () => api.get('/api/admin/bookings'),
  updateBooking: (id, data) => api.patch(`/api/admin/bookings/${id}`, data),
  // services (admin list includes inactive ones)
  getServices: () => api.get('/api/admin/services'),
  createService: (data) => api.post('/api/admin/services', data),
  updateService: (id, data) => api.patch(`/api/admin/services/${id}`, data),
  deleteService: (id) => api.delete(`/api/admin/services/${id}`),
};
