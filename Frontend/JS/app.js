let currentUser = null;
let projects = [];
let donations = [];
let currentDonationProject = null;

// Chart instances (declare once here)
let fundsChart = null;
let categoryChart = null;
let monthlyGrowthChart = null;
let regionImpactChart = null;

// Inicia a aplicação
document.addEventListener('DOMContentLoaded', function () {
  loadSampleData();
  showPage('home');
  updateStats();
  
  // Add mobile menu event listener
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  if (mobileMenuButton) {
    mobileMenuButton.addEventListener('click', toggleMobileMenu);
  }
  
  // Close mobile menu when clicking outside
  document.addEventListener('click', function(event) {
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    
    if (mobileMenu && !mobileMenu.contains(event.target) && !mobileMenuButton.contains(event.target)) {
      closeMobileMenu();
    }
  });
});

// Mobile menu functionality
function toggleMobileMenu() {
  const mobileMenu = document.getElementById('mobile-menu');
  mobileMenu.classList.toggle('hidden');
}

function closeMobileMenu() {
  const mobileMenu = document.getElementById('mobile-menu');
  mobileMenu.classList.add('hidden');
}

// Navegação entre páginas
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(page => {
    page.classList.add('hidden');
  });
  document.getElementById(pageId).classList.remove('hidden');
  document.getElementById(pageId).classList.add('fade-in');

  // Close mobile menu when navigating
  closeMobileMenu();

  if (pageId === 'projects') {
    loadProjects();
  } else if (pageId === 'transparency') {
    loadTransparencyData();
  } else if (pageId === 'reports') {
    loadReportsData();
  }
}

function showRegister() {
  showPage('register');
}

// Add this missing function
function updateStats() {
  // Update home page stats
  document.getElementById('totalDonors').textContent = '1,247';
  document.getElementById('totalProjects').textContent = projects.length.toString();
  document.getElementById('totalRaised').textContent = 'R$ 2.8M';
  document.getElementById('treesPlanted').textContent = '45,892';
  
  // Update reports page stats
  document.getElementById('reportTotalDonors').textContent = '1,247';
  document.getElementById('reportTotalRaised').textContent = 'R$ 2.8M';
  document.getElementById('reportTreesPlanted').textContent = '45,892';
  document.getElementById('reportAreasRestored').textContent = '1,234';
}

// Add loadSampleData function to app.js
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