document.addEventListener('DOMContentLoaded', () => {
  initializeInteractiveAnimations();
  initializeSvgDefs();
});

function initializeSvgDefs() {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "0");
  svg.setAttribute("height", "0");
  svg.style.position = "absolute";
  svg.style.visibility = "hidden";
  
  const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
  
  const gradient = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
  gradient.setAttribute("id", "gradient");
  gradient.setAttribute("x1", "0%");
  gradient.setAttribute("y1", "0%");
  gradient.setAttribute("x2", "100%");
  gradient.setAttribute("y2", "0%");
  
  const stop1 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
  stop1.setAttribute("offset", "0%");
  stop1.setAttribute("stop-color", "#00aab9");
  
  const stop2 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
  stop2.setAttribute("offset", "100%");
  stop2.setAttribute("stop-color", "#9900ff");
  
  gradient.appendChild(stop1);
  gradient.appendChild(stop2);
  
  defs.appendChild(gradient);
  svg.appendChild(defs);
  document.body.appendChild(svg);
}

function initializeInteractiveAnimations() {
  animateCountUp();
  addCardHoverEffects();
  addExpenseItemAnimations();
  addInsightCardAnimations();
}

function animateCountUp() {
  const amountElements = document.querySelectorAll('.amount');
  const options = {
    threshold: 0.5,
    rootMargin: "0px 0px -100px 0px"
  };
  
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const value = el.textContent.replace(/[^\d]/g, '');
        
        if (el.dataset.animated) return;
        
        el.dataset.animated = true;
        
        el.textContent = "€0";
        
        let startValue = 0;
        const endValue = parseInt(value);
        const duration = 1500;
        const step = endValue / (duration / 16); // 60fps
        
        const animateValue = () => {
          startValue += step;
          if (startValue > endValue) startValue = endValue;
          el.textContent = "€" + Math.floor(startValue).toLocaleString();
          if (startValue < endValue) requestAnimationFrame(animateValue);
        };
        
        requestAnimationFrame(animateValue);
        
        observer.unobserve(el);
      }
    });
  }, options);
  
  amountElements.forEach(el => {
    observer.observe(el);
  });
}

function addCardHoverEffects() {
  const cards = document.querySelectorAll('.card');
  
  cards.forEach(card => {
    card.classList.add('card-hover-lift');
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left; // x position within the card
      const y = e.clientY - rect.top;  // y position within the card
      
      const xPercent = Math.floor((x / rect.width) * 100);
      const yPercent = Math.floor((y / rect.height) * 100);
      
      card.style.background = `radial-gradient(circle at ${xPercent}% ${yPercent}%, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 50%), white`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.background = 'white';
    });
  });
}

function addExpenseItemAnimations() {
  const expenseItems = document.querySelectorAll('.expense-item');
  
  expenseItems.forEach((item, index) => {
    item.classList.add('stagger-item');
    item.style.transitionDelay = `${index * 100}ms`;
    
    item.addEventListener('mouseenter', () => {
      item.style.transform = 'translateX(10px)';
      item.style.boxShadow = 'var(--shadow-md)';
      
      const icon = item.querySelector('.expense-icon');
      
      if (icon) {
        icon.style.transform = 'scale(1.1)';
        icon.style.transition = 'transform 0.3s ease';
      }
    });
    
    item.addEventListener('mouseleave', () => {
      item.style.transform = '';
      item.style.boxShadow = 'var(--shadow-sm)';
      
      const icon = item.querySelector('.expense-icon');
      if (icon) {
        icon.style.transform = '';
      }
    });
  });
  
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };
  
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('stagger-visible');
        }, 300); 
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  expenseItems.forEach(item => {
    observer.observe(item);
  });
}

function addInsightCardAnimations() {
  const insightCards = document.querySelectorAll('.insight-card');
  
  insightCards.forEach((card, index) => {
    card.classList.add('stagger-item');
    card.style.transitionDelay = `${index * 200}ms`;
    
    card.addEventListener('mouseenter', () => {
      card.classList.add('float');
      
      const icon = card.querySelector('.insight-header i');
      if (icon) {
        icon.style.color = 'var(--accent-500)';
        icon.style.transition = 'color 0.3s ease';
      }
      
      card.style.boxShadow = '0 10px 25px -5px rgba(153, 0, 255, 0.1), 0 8px 10px -6px rgba(0, 170, 185, 0.1)';
    });
    
    card.addEventListener('mouseleave', () => {
      card.classList.remove('float');
      
      const icon = card.querySelector('.insight-header i');
      if (icon) {
        icon.style.color = 'var(--primary-500)';
      }
      
      card.style.boxShadow = 'var(--shadow-md)';
    });
  });
  
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };
  
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('stagger-visible');
        }, 300);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  insightCards.forEach(card => {
    observer.observe(card);
  });
}