function loadReportsData() {
  setTimeout(() => {
    createMonthlyGrowthChart();
    createRegionImpactChart();
    loadProjectRanking();
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

function loadProjectRanking() {
  const container = document.getElementById('projectRankingTable');
  const sortedProjects = [...projects].sort((a, b) => b.raised - a.raised);

  container.innerHTML = sortedProjects.slice(0, 10).map((project, index) => {
    const progress = (project.raised / project.goal) * 100;
    return `
      <tr>
        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${index + 1}º</td>
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="flex items-center">
            <div class="text-2xl mr-3">${project.image}</div>
            <div class="text-sm font-medium text-gray-900">${project.name}</div>
          </div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${project.category}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">R$ ${project.raised.toLocaleString()}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">R$ ${project.goal.toLocaleString()}</td>
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="flex items-center">
            <div class="w-16 bg-gray-200 rounded-full h-2 mr-2">
              <div class="bg-green-600 h-2 rounded-full" style="width: ${Math.min(progress, 100)}%"></div>
            </div>
            <span class="text-sm text-gray-900">${progress.toFixed(1)}%</span>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}