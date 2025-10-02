// Transparencia.js - JavaScript
function loadTransparencyData() {
  // Para dar tempo de renderizar a página antes de criar os gráficos
  setTimeout(() => {
    createFundsChart();
    createCategoryChart();
    loadTimeline();
    loadActiveProjectsTable();
  }, 100);
}

function createFundsChart() {
  const ctx = document.getElementById('fundsChart').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
      datasets: [{
        label: 'Arrecadado',
        data: [120000, 190000, 300000, 250000, 420000, 380000],
        backgroundColor: 'rgba(16, 185, 129, 0.8)'
      }, {
        label: 'Utilizado',
        data: [100000, 170000, 280000, 230000, 390000, 350000],
        backgroundColor: 'rgba(59, 130, 246, 0.8)'
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

function createCategoryChart() {
  const ctx = document.getElementById('categoryChart').getContext('2d');
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Reflorestamento', 'Conservação Marinha', 'Biodiversidade', 'Energia Renovável'],
      datasets: [{
        data: [35, 25, 20, 20],
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(139, 92, 246, 0.8)'
        ]
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  });
}

function loadTimeline() {
  const container = document.getElementById('timelineContainer');
  const timelineItems = [
    {
      date: '2024-01-15',
      project: 'Reflorestamento Amazônia',
      update: 'Plantadas 1.000 mudas nativas na região de Manaus',
      type: 'success'
    },
    {
      date: '2024-01-10',
      project: 'Conservação Marinha RJ',
      update: 'Limpeza de 5km de praia e coleta de 2 toneladas de lixo',
      type: 'success'
    },
    {
      date: '2024-01-05',
      project: 'Proteção Cerrado',
      update: 'Instalação de 50 câmeras de monitoramento da fauna',
      type: 'info'
    }
  ];

  container.innerHTML = timelineItems.map(item => `
    <div class="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
      <div class="flex-shrink-0 w-3 h-3 rounded-full ${item.type === 'success' ? 'bg-green-500' : 'bg-blue-500'} mt-2"></div>
      <div class="flex-1">
        <div class="flex justify-between items-start">
          <h4 class="font-semibold text-gray-900">${item.project}</h4>
          <span class="text-sm text-gray-500">${new Date(item.date).toLocaleDateString('pt-BR')}</span>
        </div>
        <p class="text-gray-600 mt-1">${item.update}</p>
      </div>
    </div>
  `).join('');
}

function loadActiveProjectsTable() {
  const container = document.getElementById('activeProjectsTable');
  const activeProjects = projects.slice(0, 5); // Mostrar os 5 primeiros projetos

  container.innerHTML = `
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Projeto</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Meta</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Arrecadado</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilizado</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        ${activeProjects.map(project => {
    const utilized = Math.floor(project.raised * 0.85); // 85% utilizado
    const progress = (project.raised / project.goal) * 100;
    return `
            <tr>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="text-2xl mr-3">${project.image}</div>
                  <div>
                    <div class="text-sm font-medium text-gray-900">${project.name}</div>
                    <div class="text-sm text-gray-500">${project.location}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">R$ ${project.goal.toLocaleString()}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">R$ ${project.raised.toLocaleString()}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">R$ ${utilized.toLocaleString()}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${progress >= 100 ? 'bg-green-100 text-green-800' : progress >= 50 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}">
                  ${progress >= 100 ? 'Concluído' : progress >= 50 ? 'Em andamento' : 'Iniciando'}
                </span>
              </td>
            </tr>
          `;
  }).join('')}
      </tbody>
    </table>
  `;
}
