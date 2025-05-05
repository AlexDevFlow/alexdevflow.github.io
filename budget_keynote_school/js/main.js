
document.addEventListener('DOMContentLoaded', () => {
  initializeMobileMenu();
  initializeExpenseCategories();
});


function initializeMobileMenu() {
  const mobileToggle = document.getElementById('mobileToggle');
  const mainNav = document.getElementById('mainNav');

  mobileToggle.addEventListener('click', () => {
    mobileToggle.classList.toggle('active');
    mainNav.classList.toggle('active');
  });
}


function initializeExpenseCategories() {
  const categories = document.querySelectorAll('.expense-category');

  categories.forEach(category => {
    const header = category.querySelector('.category-header');

    header.addEventListener('click', () => {
      category.classList.toggle('active');
    });
  });
}