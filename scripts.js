// scripts.js
document.addEventListener('DOMContentLoaded', () => {
  // Theme Management
  const themeToggle = document.getElementById('theme-toggle');
  const htmlElement = document.documentElement;
  const savedTheme = localStorage.getItem('theme') || 'light';

  const setTheme = (theme) => {
    htmlElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    themeToggle.innerHTML = theme === 'dark' 
      ? '<i class="fas fa-sun"></i> Theme' 
      : '<i class="fas fa-moon"></i> Theme';
  };

  setTheme(savedTheme);
  
  themeToggle.addEventListener('click', () => {
    const newTheme = htmlElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  });

  // Navigation System
  const sections = {
    search: document.getElementById('search'),
    recipeForm: document.getElementById('recipe-form'),
    profile: document.getElementById('profile'),
    auth: document.getElementById('auth-section')
  };

  const navLinks = document.querySelectorAll('.nav-link');
  
  const showSection = (sectionId) => {
    Object.values(sections).forEach(section => section.classList.add('hidden'));
    document.getElementById(sectionId)?.classList.remove('hidden');
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${sectionId}`);
    });
  };

  document.querySelectorAll('[data-tab]').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      document.querySelectorAll('.auth-form').forEach(form => form.classList.remove('active'));
      document.getElementById(`${tab.dataset.tab}-form`).classList.add('active');
    });
  });

  // Auth System
  const authForms = {
    login: document.getElementById('login-form'),
    register: document.getElementById('register-form')
  };

  const handleAuth = async (form, endpoint) => {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    try {
      // Replace with actual API call
      console.log('Submitting to', endpoint, data);
      showSection('search');
    } catch (error) {
      console.error('Auth error:', error);
    }
  };

  authForms.login.addEventListener('submit', (e) => {
    e.preventDefault();
    handleAuth(e.target, '/api/login');
  });

  authForms.register.addEventListener('submit', (e) => {
    e.preventDefault();
    handleAuth(e.target, '/api/register');
  });

  // Recipe Management
  const recipeForm = document.getElementById('submit-recipe');
  const closeRecipeForm = document.querySelector('.close-btn');

  recipeForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(recipeForm);
    const data = Object.fromEntries(formData.entries());
    
    try {
      // Replace with actual API call
      console.log('Submitting recipe:', data);
      showSection('search');
    } catch (error) {
      console.error('Recipe submission error:', error);
    }
  });

  closeRecipeForm.addEventListener('click', () => showSection('search'));

  // Search Functionality
  const searchInput = document.querySelector('sl-input[placeholder="Search recipes..."]');
  const recipeGrid = document.getElementById('recipe-list');

  const debounce = (fn, delay) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn.apply(this, args), delay);
    };
  };

  const searchRecipes = debounce(async (query) => {
    try {
      // Replace with actual API call
      const mockData = Array.from({ length: 6 }, (_, i) => ({
        id: i,
        title: `Recipe ${i + 1}`,
        difficulty: ['easy', 'medium', 'hard'][i % 3],
        time: `${30 + i * 5} mins`
      }));
      
      renderRecipes(mockData.filter(recipe => 
        recipe.title.toLowerCase().includes(query.toLowerCase())
      ));
    } catch (error) {
      console.error('Search error:', error);
    }
  }, 300);

  searchInput.addEventListener('sl-input', (e) => searchRecipes(e.target.value));

  const renderRecipes = (recipes) => {
    recipeGrid.innerHTML = recipes.map(recipe => `
      <sl-card class="recipe-card">
        <h3 slot="header">${recipe.title}</h3>
        <div class="recipe-meta">
          <sl-tag variant="${getDifficultyVariant(recipe.difficulty)}">
            ${recipe.difficulty.toUpperCase()}
          </sl-tag>
          <sl-tag><i class="fas fa-clock"></i> ${recipe.time}</sl-tag>
        </div>
        <sl-button variant="primary" class="view-recipe">
          View Recipe <i class="fas fa-arrow-right"></i>
        </sl-button>
      </sl-card>
    `).join('');
  };

  const getDifficultyVariant = (difficulty) => {
    const variants = { easy: 'success', medium: 'warning', hard: 'danger' };
    return variants[difficulty];
  };

  // User Session Management
  const logoutButton = document.getElementById('logout');
  logoutButton.addEventListener('click', () => {
    localStorage.removeItem('token');
    showSection('auth');
  });

  // Modal System
  const recipeModal = document.getElementById('recipe-modal');
  document.addEventListener('click', (e) => {
    if (e.target.closest('.view-recipe')) {
      recipeModal.show();
    }
  });

  // Initialization
  showSection('search');
  renderRecipes(Array.from({ length: 6 }, (_, i) => ({
    id: i,
    title: `Traditional Recipe ${i + 1}`,
    difficulty: ['easy', 'medium', 'hard'][i % 3],
    time: `${30 + i * 5} mins`
  })));
});
