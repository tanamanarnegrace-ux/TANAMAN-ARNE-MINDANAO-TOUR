const searchBtn = document.getElementById('search-btn');
const loginBtn = document.getElementById('login-btn');
const header = document.querySelector('header');
const searchBarContainer = document.querySelector('.search-bar-container');
const navbarLinks = document.querySelectorAll('header .navbar a');

const loginModal = document.getElementById('login-modal');
const closeBtn = document.querySelector('.close');
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');

loginBtn.addEventListener('click', () => {
  loginModal.style.display = 'block';
});

closeBtn.addEventListener('click', () => {
  loginModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
  if (e.target === loginModal) {
    loginModal.style.display = 'none';
  }
});

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const tabName = btn.getAttribute('data-tab');
    
    tabBtns.forEach(b => b.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));
    
    btn.classList.add('active');
    document.getElementById(tabName).classList.add('active');
  });
});

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = loginForm.querySelector('input[type="email"]').value;
  alert(`Welcome back, ${email}! You've successfully logged in.`);
  loginForm.reset();
  loginModal.style.display = 'none';
});

signupForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = signupForm.querySelector('input[type="text"]').value;
  alert(`Welcome, ${name}! Your account has been created successfully.`);
  signupForm.reset();
  loginModal.style.display = 'none';
});

searchBtn.addEventListener('click', () => {
  header.classList.toggle('header-search-open');
  document.getElementById('search-bar').focus();
});

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }

  document.querySelectorAll('section[id]').forEach((section) => {
    const top = section.offsetTop - 140;
    const bottom = top + section.offsetHeight;

    if (window.scrollY >= top && window.scrollY < bottom) {
      const id = section.getAttribute('id');
      navbarLinks.forEach(link => link.classList.remove('active'));
      const activeLink = document.querySelector(`header .navbar a[href="#${id}"]`);
      if (activeLink) activeLink.classList.add('active');
    }
  });
});

window.addEventListener('DOMContentLoaded', () => {
 
  const bookingForm = document.querySelector('#book form');
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Booking submitted successfully! We will confirm your reservation shortly.');
      bookingForm.reset();
    });
  }

  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Thank you for your message! We will get back to you within 24 hours.');
      contactForm.reset();
    });
  }

  document.querySelectorAll('.package-card .btn-primary, .package-card .btn-secondary').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      loginModal.style.display = 'block';
    });
  });

  document.querySelectorAll('.service-box .read-more').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
    });
  });

  let selectedDates = [];
  let currentMonth = new Date().getMonth();
  let currentYear = new Date().getFullYear();

  window.initializeBooking = function() {
    selectedDates = [];
    currentMonth = new Date().getMonth();
    currentYear = new Date().getFullYear();
    renderCalendar();
    updateBookingSummary();
  };

  function renderCalendar() {
    const calendar = document.getElementById('calendar');
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                       'July', 'August', 'September', 'October', 'November', 'December'];
    
    document.getElementById('current-month').textContent = `${monthNames[currentMonth]} ${currentYear}`;
    
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    calendar.innerHTML = '';
    
    const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayLabels.forEach(day => {
      const dayLabel = document.createElement('div');
      dayLabel.className = 'day-label';
      dayLabel.textContent = day;
      calendar.appendChild(dayLabel);
    });
    
    for (let i = 0; i < firstDay; i++) {
      const emptyCell = document.createElement('div');
      calendar.appendChild(emptyCell);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      const dayCell = document.createElement('div');
      dayCell.textContent = day;
      dayCell.className = 'available';
      dayCell.addEventListener('click', () => selectDate(day));
      calendar.appendChild(dayCell);
    }
  }

  function selectDate(day) {
    const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    if (selectedDates.length === 0) {
      selectedDates = [dateString];
    } else if (selectedDates.length === 1) {
      if (dateString > selectedDates[0]) {
        selectedDates.push(dateString);
      } else {
        selectedDates = [dateString];
      }
    } else {
      selectedDates = [dateString];
    }
    
    updateCalendarDisplay();
    updateDateInputs();
    updateBookingSummary();
  }

  function updateCalendarDisplay() {
    const calendar = document.getElementById('calendar');
    const days = calendar.querySelectorAll('div:not(.day-label)');
    
    days.forEach((day, index) => {
      if (day.textContent) {
        const dayNum = parseInt(day.textContent);
        const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
        
        day.className = 'available';
        if (selectedDates.includes(dateString)) {
          day.className = 'selected';
        }
      }
    });
  }

  function updateDateInputs() {
    const checkInDisplay = document.getElementById('check-in-display');
    const checkOutDisplay = document.getElementById('check-out-display');
    const nightCount = document.getElementById('night-count');
    
    if (selectedDates.length >= 1) {
      checkInDisplay.value = formatDate(selectedDates[0]);
    }
    if (selectedDates.length >= 2) {
      checkOutDisplay.value = formatDate(selectedDates[1]);
      const nights = Math.ceil((new Date(selectedDates[1]) - new Date(selectedDates[0])) / (1000 * 60 * 60 * 24));
      nightCount.textContent = nights;
    } else {
      checkOutDisplay.value = '';
      nightCount.textContent = '0';
    }
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }

  document.getElementById('prev-month').addEventListener('click', () => {
    currentMonth--;
    if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
    }
    renderCalendar();
  });

  document.getElementById('next-month').addEventListener('click', () => {
    currentMonth++;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
    renderCalendar();
  });

  document.getElementById('guests-minus').addEventListener('click', () => {
    const input = document.getElementById('guests-count');
    const currentValue = parseInt(input.value);
    if (currentValue > 1) {
      input.value = currentValue - 1;
      updateBookingSummary();
    }
  });

  document.getElementById('guests-plus').addEventListener('click', () => {
    const input = document.getElementById('guests-count');
    const currentValue = parseInt(input.value);
    if (currentValue < 10) {
      input.value = currentValue + 1;
      updateBookingSummary();
    }
  });

  document.getElementById('accommodation').addEventListener('change', updateBookingSummary);

  function updateBookingSummary() {
    const accommodation = document.getElementById('accommodation');
    const selectedOption = accommodation.options[accommodation.selectedIndex];
    const price = selectedOption.getAttribute('data-price') || 0;
    const nights = parseInt(document.getElementById('night-count').textContent) || 0;
    const guests = parseInt(document.getElementById('guests-count').value) || 1;
    
    document.getElementById('summary-accommodation').textContent = selectedOption.text.split(' - ')[0] || '-';
    document.getElementById('summary-nights').textContent = nights;
    document.getElementById('summary-price').textContent = `₱${parseInt(price).toLocaleString()}`;
    document.getElementById('summary-guests').textContent = guests;
    document.getElementById('summary-total').textContent = `₱${(parseInt(price) * nights).toLocaleString()}`;
  }

  document.getElementById('advanced-booking-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = {
      name: document.getElementById('guest-name').value,
      email: document.getElementById('guest-email').value,
      phone: document.getElementById('guest-phone').value,
      checkIn: document.getElementById('check-in-display').value,
      checkOut: document.getElementById('check-out-display').value,
      accommodation: document.getElementById('accommodation').options[document.getElementById('accommodation').selectedIndex].text,
      guests: document.getElementById('guests-count').value,
      specialRequests: document.getElementById('special-requests').value,
      nights: document.getElementById('night-count').textContent,
      total: document.getElementById('summary-total').textContent
    };
    
    showConfirmation(formData);
  });

  function showConfirmation(data) {
    const confirmationNumber = 'SG' + Date.now().toString().slice(-8);
    
    document.getElementById('conf-name').textContent = data.name;
    document.getElementById('conf-email').textContent = data.email;
    document.getElementById('conf-phone').textContent = data.phone;
    document.getElementById('conf-number').textContent = confirmationNumber;
    document.getElementById('conf-checkin').textContent = data.checkIn;
    document.getElementById('conf-checkout').textContent = data.checkOut;
    document.getElementById('conf-accommodation').textContent = data.accommodation.split(' - ')[0];
    document.getElementById('conf-guests').textContent = data.guests;
    document.getElementById('conf-nights').textContent = data.nights;
    document.getElementById('conf-price-per-night').textContent = data.accommodation.split(' - ')[1];
    document.getElementById('conf-total-amount').textContent = data.total;
    
    document.getElementById('advanced-booking-modal').style.display = 'none';
    document.getElementById('confirmation-modal').style.display = 'block';
    
    document.getElementById('advanced-booking-form').reset();
    selectedDates = [];
    updateBookingSummary();
  }
});
