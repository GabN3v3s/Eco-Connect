// Reports
function loadReportsData() {
  setTimeout(() => {
    createMonthlyGrowthChart();
    createRegionImpactChart();
    loadProjectRanking();
  }, 100);
}

function createMonthlyGrowthChart() {
  const ctx = document.getElementById('monthlyGrowthChart').getContext('2d');
  new Chart(ctx, {
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
  const ctx = document.getElementById('regionImpactChart').getContext('2d');
  new Chart(ctx, {
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

// Dados de exemplo
function loadSampleData() {
  // Sample projects
  projects = [
    {
      id: 1,
      name: 'Reflorestamento da Mata Atlântica',
      description: 'Projeto para restaurar 500 hectares de Mata Atlântica degradada com espécies nativas.',
      location: 'São Paulo, SP',
      goal: 250000,
      raised: 187500,
      donors: 156,
      category: 'reflorestamento',
      organization: 'Instituto Verde Vida',
      image: '🌳'
    },
    {
      id: 2,
      name: 'Conservação Marinha Litoral Norte',
      description: 'Proteção de recifes de coral e limpeza de praias no litoral norte.',
      location: 'Ubatuba, SP',
      goal: 180000,
      raised: 142000,
      donors: 89,
      category: 'conservacao-marinha',
      organization: 'ONG Mar Azul',
      image: '🌊'
    },
    {
      id: 3,
      name: 'Proteção da Biodiversidade do Cerrado',
      description: 'Monitoramento e proteção de espécies ameaçadas no Cerrado brasileiro.',
      location: 'Brasília, DF',
      goal: 320000,
      raised: 98000,
      donors: 67,
      category: 'biodiversidade',
      organization: 'Fundação Cerrado Vivo',
      image: '🦋'
    },
    {
      id: 4,
      name: 'Energia Solar Comunitária',
      description: 'Instalação de painéis solares em comunidades rurais da Amazônia.',
      location: 'Manaus, AM',
      goal: 450000,
      raised: 276000,
      donors: 203,
      category: 'energia-renovavel',
      organization: 'Amazônia Sustentável',
      image: '⚡'
    },
    {
      id: 5,
      name: 'Educação Ambiental nas Escolas',
      description: 'Programa de educação ambiental para 50 escolas públicas.',
      location: 'Rio de Janeiro, RJ',
      goal: 120000,
      raised: 95000,
      donors: 134,
      category: 'educacao-ambiental',
      organization: 'EcoEducar',
      image: '📚'
    },
    {
      id: 6,
      name: 'Recuperação de Nascentes',
      description: 'Projeto para recuperar e proteger nascentes em áreas rurais.',
      location: 'Minas Gerais, MG',
      goal: 200000,
      raised: 156000,
      donors: 98,
      category: 'reflorestamento',
      organization: 'Águas do Futuro',
      image: '💧'
    }
  ];

  // Sample donations
  donations = [
    { id: 1, projectId: 1, projectName: 'Reflorestamento da Mata Atlântica', amount: 500, donorName: 'Maria Silva', donorEmail: 'maria@email.com', date: '2024-01-15', status: 'completed' },
    { id: 2, projectId: 2, projectName: 'Conservação Marinha Litoral Norte', amount: 250, donorName: 'João Santos', donorEmail: 'joao@email.com', date: '2024-01-14', status: 'completed' },
    { id: 3, projectId: 1, projectName: 'Reflorestamento da Mata Atlântica', amount: 1000, donorName: 'Ana Costa', donorEmail: 'ana@email.com', date: '2024-01-13', status: 'completed' }
  ];
}
