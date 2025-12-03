function loadReportsData() {
  setTimeout(() => {
    createMonthlyGrowthChart();
    createRegionImpactChart();
  }, 100);
}

function createMonthlyGrowthChart() {
  const ctx = document.getElementById('monthlyGrowthChart');
  
  if (monthlyGrowthChart) {
    monthlyGrowthChart.destroy();
  }
  
  monthlyGrowthChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
      datasets: [{
        label: 'Doações (R$)',
        data: [120000, 190000, 300000, 250000, 420000, 380000],
        borderColor: 'rgba(16, 185, 129, 1)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        fill: true
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function (value) {
              return 'R$ ' + (value / 1000) + 'k';
            }
          }
        }
      }
    }
  });
}

function createRegionImpactChart() {
  const ctx = document.getElementById('regionImpactChart');
  
  if (regionImpactChart) {
    regionImpactChart.destroy();
  }
  
  regionImpactChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Norte', 'Nordeste', 'Centro-Oeste', 'Sudeste', 'Sul'],
      datasets: [{
        label: 'Hectares Restaurados',
        data: [450, 320, 280, 380, 200],
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(236, 72, 153, 0.8)'
        ]
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}