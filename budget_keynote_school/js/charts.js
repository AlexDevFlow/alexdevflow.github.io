
document.addEventListener('DOMContentLoaded', () => {
  createExpensesChart();
  createAnalysisChart();
});

function createExpensesChart() {
  const ctx = document.getElementById('expensesChart').getContext('2d');
  
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Alloggio', 'Alimentazione', 'Trasporti', 'Svago', 'Abbigliamento', 'Salute', 'Varie'],
      datasets: [{
        data: [600, 300, 39, 100, 50, 50, 50],
        backgroundColor: [
          '#ef4444',
          '#f97316',
          '#eab308',
          '#10b981',
          '#3b82f6',
          '#a855f7',
          '#6b7280'
        ]
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'right'
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const label = context.label || '';
              const value = context.raw;
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = Math.round((value / total) * 100);
              return `${label}: €${value} (${percentage}%)`;
            }
          }
        }
      },
      cutout: '60%'
    }
  });
}

function createAnalysisChart() {
  const ctx = document.getElementById('analysisChart').getContext('2d');
  
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Alloggio', 'Alimentazione', 'Trasporti', 'Svago', 'Abbigliamento', 'Salute', 'Varie'],
      datasets: [{
        label: 'Spese Mensili (€)',
        data: [600, 300, 39, 100, 50, 50, 50],
        backgroundColor: [
          '#ef4444',
          '#f97316',
          '#eab308',
          '#10b981',
          '#3b82f6',
          '#a855f7',
          '#6b7280'
        ]
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: value => '€' + value
          }
        }
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: function(context) {
              const value = context.raw;
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = Math.round((value / total) * 100);
              return `€${value} (${percentage}% del totale)`;
            }
          }
        }
      }
    }
  });
}