let currentUser = null;
let projects = [];
let donations = [];
let currentDonationProject = null;

// Chart instances (declare once here)
let fundsChart = null;
let categoryChart = null;
let monthlyGrowthChart = null;
let regionImpactChart = null;

// API Base URL
const API_BASE_URL = 'http://localhost:5000/api';

// Track if projects are already loaded
let projectsLoaded = false;

// Inicia a aplicação
document.addEventListener('DOMContentLoaded', function () {
  showPage('home');
  updateStats();

  // Add mobile menu event listener
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  if (mobileMenuButton) {
    mobileMenuButton.addEventListener('click', toggleMobileMenu);
  }

  // Close mobile menu when clicking outside
  document.addEventListener('click', function (event) {
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuButton = document.getElementById('mobile-menu-button');

    if (mobileMenu && !mobileMenu.contains(event.target) && !mobileMenuButton.contains(event.target)) {
      closeMobileMenu();
    }
  });
});

// API Functions
async function loadProjectsFromAPI() {
  try {
    const response = await fetch(`${API_BASE_URL}/projects`);
    projects = await response.json();
    projectsLoaded = true;
    loadProjects(); // Update the UI
  } catch (error) {
    console.error('Erro ao carregar projetos:', error);
    alert('Erro ao carregar projetos. Usando dados locais.');
    loadSampleData(); // Fallback to local data
  }
}

async function createProjectAPI(projectData) {
  try {
    const response = await fetch(`${API_BASE_URL}/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(projectData)
    });

    const result = await response.json();
    if (response.ok) {
      projectsLoaded = false; // Reset flag to reload projects
      await loadProjectsFromAPI(); // Reload projects from API
      return result;
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    console.error('Erro ao criar projeto:', error);
    throw error;
  }
}

async function createDonationAPI(donationData) {
  try {
    const response = await fetch(`${API_BASE_URL}/donations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(donationData)
    });

    const result = await response.json();
    if (response.ok) {
      projectsLoaded = false; // Reset flag to reload projects
      await loadProjectsFromAPI(); // Reload projects to update raised amounts
      return result;
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    console.error('Erro ao processar doação:', error);
    throw error;
  }
}

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
    if (!projectsLoaded) {
      loadProjectsFromAPI(); // Load projects only if not already loaded
    } else {
      loadProjects(); // Just render the already loaded projects
    }
  } else if (pageId === 'transparency') {
    loadTransparencyData();
  } else if (pageId === 'reports') {
    loadReportsData();
  }
}

function showRegister() {
  showPage('register');
}

// Update stats function
function updateStats() {
  const totalDonors = 1247;
  const totalRaised = projects.reduce((sum, project) => sum + (project.arrecadado || 0), 0);
  const treesPlanted = 45892;

  // Update home page stats
  document.getElementById('totalDonors').textContent = totalDonors.toLocaleString();
  document.getElementById('totalProjects').textContent = projects.length.toString();
  document.getElementById('totalRaised').textContent = `R$ ${totalRaised.toLocaleString()}`;
  document.getElementById('treesPlanted').textContent = treesPlanted.toLocaleString();

  // Update reports page stats
  document.getElementById('reportTotalDonors').textContent = totalDonors.toLocaleString();
  document.getElementById('reportTotalRaised').textContent = `R$ ${totalRaised.toLocaleString()}`;
  document.getElementById('reportTreesPlanted').textContent = treesPlanted.toLocaleString();
  document.getElementById('reportAreasRestored').textContent = '1,234';
}

// Fallback sample data (keep as backup)
function loadSampleData() {
  projects = [
    {
      id: 1,
      nome: 'Reflorestamento da Mata Atlântica',
      descricao: 'Projeto para restaurar 500 hectares de Mata Atlântica degradada com espécies nativas.',
      localizacao: 'São Paulo, SP',
      meta: 250000,
      arrecadado: 187500,
      categoria: 'reflorestamento'
    },
    {
      id: 2,
      nome: 'Conservação Marinha Litoral Norte',
      descricao: 'Proteção de recifes de coral e limpeza de praias no litoral norte.',
      localizacao: 'Ubatuba, SP',
      meta: 180000,
      arrecadado: 142000,
      categoria: 'conservacao-marinha'
    }
  ];
  projectsLoaded = true;
  loadProjects();
}