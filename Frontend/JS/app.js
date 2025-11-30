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
  checkLoginStatus(); // Check if user is already logged in
  showPage('home');
  updateStats();

  // Auto-select donor type by default
  selectUserType('donor');

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

// Check if user is logged in (from localStorage)
function checkLoginStatus() {
  const token = localStorage.getItem('token');
  const userData = localStorage.getItem('user');
  
  if (token && userData) {
    try {
      currentUser = JSON.parse(userData);
      updateNavigation();
    } catch (error) {
      console.error('Error parsing user data:', error);
      logout();
    }
  }
}

// Update navigation based on login status
function updateNavigation() {
  const loginButton = document.querySelector('button[onclick="showPage(\'login\')"]');
  const mobileLoginButton = document.querySelector('#mobile-menu button[onclick*="login"]');
  
  if (currentUser) {
    // User is logged in - show user menu
    if (loginButton) {
      loginButton.innerHTML = `
        <div class="flex items-center space-x-2">
          <span>👤 ${currentUser.nome}</span>
          <span class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">${currentUser.tipo}</span>
        </div>
      `;
      loginButton.setAttribute('onclick', 'showUserMenu()');
    }
    
    if (mobileLoginButton) {
      mobileLoginButton.innerHTML = `
        <div class="flex items-center justify-between w-full">
          <div class="flex items-center space-x-2">
            <span>👤 ${currentUser.nome}</span>
            <span class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">${currentUser.tipo}</span>
          </div>
        </div>
      `;
      mobileLoginButton.setAttribute('onclick', 'showUserMenu()');
    }
  } else {
    // User is not logged in - show login button
    if (loginButton) {
      loginButton.innerHTML = 'Entrar';
      loginButton.setAttribute('onclick', 'showPage(\'login\')');
    }
    
    if (mobileLoginButton) {
      mobileLoginButton.innerHTML = 'Entrar';
      mobileLoginButton.setAttribute('onclick', 'showPage(\'login\')');
    }
  }
}

// Show user menu (dropdown for logged-in users)
function showUserMenu() {
  // Create or show user dropdown menu
  const existingMenu = document.getElementById('userDropdownMenu');
  if (existingMenu) {
    existingMenu.remove();
    return;
  }

  const loginButton = document.querySelector('button[onclick="showUserMenu()"]');
  if (!loginButton) {
    console.error('❌ Login button not found');
    return;
  }

  const rect = loginButton.getBoundingClientRect();
  
  // Calculate total donated amount
  const totalDonated = donations.reduce((sum, donation) => sum + donation.valor, 0);
  
  const dropdownMenu = document.createElement('div');
  dropdownMenu.id = 'userDropdownMenu';
  dropdownMenu.className = 'absolute right-4 mt-2 w-64 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200';
  dropdownMenu.style.top = `${rect.bottom + window.scrollY}px`;
  dropdownMenu.style.left = `${rect.right - 256 + window.scrollX}px`;
  
  dropdownMenu.innerHTML = `
    <div class="px-4 py-3 border-b border-gray-100">
      <div class="flex items-center space-x-3 mb-2">
        <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
          <span class="text-green-600 font-semibold">${currentUser.nome.charAt(0).toUpperCase()}</span>
        </div>
        <div>
          <p class="text-sm font-medium text-gray-900">${currentUser.nome}</p>
          <p class="text-xs text-gray-500">${currentUser.email}</p>
        </div>
      </div>
      <div class="grid grid-cols-2 gap-2 text-xs">
        <div class="text-center bg-green-50 rounded p-1">
          <div class="font-semibold text-green-700">${donations.length}</div>
          <div class="text-green-600">Doações</div>
        </div>
        <div class="text-center bg-blue-50 rounded p-1">
          <div class="font-semibold text-blue-700">R$ ${totalDonated.toLocaleString()}</div>
          <div class="text-blue-600">Total Doado</div>
        </div>
      </div>
    </div>
    
    <button onclick="showPage('projects')" class="flex items-center w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-100">
      <span class="mr-3">📋</span>
      <div>
        <div class="font-medium">Todos os Projetos</div>
        <div class="text-xs text-gray-500">Explore projetos ambientais</div>
      </div>
    </button>
    
    <button onclick="showMyDonations()" class="flex items-center w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-100">
      <span class="mr-3">💰</span>
      <div>
        <div class="font-medium">Minhas Doações</div>
        <div class="text-xs text-gray-500">Histórico de contribuições</div>
      </div>
    </button>
    
    ${currentUser.tipo === 'organizacao' ? `
      <button onclick="showProjectForm()" class="flex items-center w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-100">
        <span class="mr-3">🚀</span>
        <div>
          <div class="font-medium">Criar Projeto</div>
          <div class="text-xs text-gray-500">Cadastrar novo projeto</div>
        </div>
      </button>
    ` : ''}
    
    <button onclick="showPage('transparency')" class="flex items-center w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100">
      <span class="mr-3">📊</span>
      <div>
        <div class="font-medium">Transparência</div>
        <div class="text-xs text-gray-500">Relatórios e métricas</div>
      </div>
    </button>
    
    <div class="border-t border-gray-100">
      <button onclick="logout()" class="flex items-center w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50">
        <span class="mr-3">🚪</span>
        <div>
          <div class="font-medium">Sair</div>
          <div class="text-xs text-red-500">Encerrar sessão</div>
        </div>
      </button>
    </div>
  `;
  
  document.body.appendChild(dropdownMenu);
  
  // Close menu when clicking outside
  const closeMenu = (e) => {
    if (!dropdownMenu.contains(e.target) && e.target !== loginButton) {
      dropdownMenu.remove();
      document.removeEventListener('click', closeMenu);
    }
  };
  
  setTimeout(() => {
    document.addEventListener('click', closeMenu);
  }, 100);
}

// Logout function
function logout() {
  currentUser = null;
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  updateNavigation();
  showPage('home');
  
  // Remove any existing dropdown menu
  const existingMenu = document.getElementById('userDropdownMenu');
  if (existingMenu) {
    existingMenu.remove();
  }
  
  alert('Logout realizado com sucesso!');
}

// API Functions
async function loadProjectsFromAPI() {
  try {
    console.log("🔄 Loading projects from API...");
    
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      console.log("🔐 Using token for API request");
    }

    const response = await fetch(`${API_BASE_URL}/projects`, {
      headers: headers
    });
    
    console.log("📡 API Response status:", response.status);
    
    if (response.status === 401) {
      // Token expired or invalid
      console.log("❌ Token invalid, logging out");
      logout();
      return;
    }
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const projectsData = await response.json();
    console.log("✅ Projects loaded:", projectsData.length);
    
    projects = projectsData;
    projectsLoaded = true;
    loadProjects(); // Update the UI
    updateStats(); // Update stats with new data
  } catch (error) {
    console.error('❌ Erro ao carregar projetos:', error);
    alert('Erro ao carregar projetos. Usando dados locais.');
    loadSampleData(); // Fallback to local data
  }
}

async function createProjectAPI(projectData) {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Você precisa estar logado para criar um projeto');
    }

    const response = await fetch(`${API_BASE_URL}/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(projectData)
    });

    const result = await response.json();
    if (response.ok) {
      projectsLoaded = false;
      await loadProjectsFromAPI();
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
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Você precisa estar logado para fazer uma doação');
    }

    const response = await fetch(`${API_BASE_URL}/donations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(donationData)
    });

    // First check if response is ok
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erro ao processar doação');
    }

    // Then parse the successful response
    const result = await response.json();
    
    console.log("✅ createDonationAPI success:", result);
    return result;

  } catch (error) {
    console.error('Erro ao processar doação:', error);
    throw error;
  }
}

// Load donation statistics
async function loadDonationStats() {
  try {
    const token = localStorage.getItem('token');
    if (!token) return;

    const response = await fetch(`${API_BASE_URL}/donations/stats`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.ok) {
      const stats = await response.json();
      console.log("💰 Donation stats:", stats);
      return stats;
    }
  } catch (error) {
    console.error('Erro ao carregar estatísticas de doações:', error);
  }
}

// Show user's donations
async function showMyDonations() {
  if (!currentUser) {
    alert('Você precisa estar logado para ver suas doações.');
    showPage('login');
    return;
  }
  
  showPage('projects');

  try {
    console.log("📋 Loading user donations...");
    
    // Load user donations first
    await loadUserDonations();
    
    const donationsContainer = document.getElementById('projectsList');
    
    if (donations.length === 0) {
      donationsContainer.innerHTML = `
        <div class="col-span-full">
          <div class="bg-white rounded-lg shadow-lg p-6 text-center">
            <div class="text-6xl mb-4">💰</div>
            <h3 class="text-2xl font-bold mb-4">Minhas Doações</h3>
            <p class="text-gray-600 mb-6">Você ainda não fez nenhuma doação.</p>
            <button onclick="showPage('projects')" class="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
              Explorar Projetos
            </button>
          </div>
        </div>
      `;
    } else {
      donationsContainer.innerHTML = `
        <div class="col-span-full">
          <div class="bg-white rounded-lg shadow-lg p-6">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-2xl font-bold">💰 Minhas Doações</h3>
              <span class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                ${donations.length} doação${donations.length !== 1 ? 'es' : ''}
              </span>
            </div>
            
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Projeto</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Localização</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoria</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  ${donations.map(donation => `
                    <tr class="hover:bg-gray-50">
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex items-center">
                          <div class="text-2xl mr-3">${getProjectImage(donation.projeto_categoria)}</div>
                          <div>
                            <div class="text-sm font-medium text-gray-900">${donation.projeto_nome}</div>
                          </div>
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${donation.projeto_localizacao}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                        ${donation.projeto_categoria?.replace('-', ' ') || 'Geral'}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                        R$ ${donation.valor.toLocaleString()}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${new Date(donation.data_doacao).toLocaleDateString('pt-BR')}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Confirmada
                        </span>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
            
            <div class="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
              <div class="flex justify-between items-center">
                <div>
                  <p class="text-sm font-medium text-green-800">Total doado</p>
                  <p class="text-lg font-bold text-green-900">
                    R$ ${donations.reduce((sum, d) => sum + d.valor, 0).toLocaleString()}
                  </p>
                </div>
                <button onclick="showPage('projects')" class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                  ← Voltar para Projetos
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
    }
    
  } catch (error) {
    console.error('❌ Erro ao carregar doações:', error);
    const donationsContainer = document.getElementById('projectsList');
    donationsContainer.innerHTML = `
      <div class="col-span-full">
        <div class="bg-white rounded-lg shadow-lg p-6 text-center">
          <div class="text-6xl mb-4">❌</div>
          <h3 class="text-2xl font-bold mb-4">Erro ao carregar doações</h3>
          <p class="text-gray-600 mb-6">Não foi possível carregar seu histórico de doações.</p>
          <button onclick="showPage('projects')" class="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
            Voltar para Projetos
          </button>
        </div>
      </div>
    `;
    showPage('projects');
  }
}

async function loadUserDonations() {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      donations = [];
      return;
    }

    console.log("🔄 Loading user donations from API...");
    
    const response = await fetch(`${API_BASE_URL}/donations/my-donations`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log("📡 User donations response status:", response.status);
    
    if (response.ok) {
      donations = await response.json();
      console.log(`✅ Loaded ${donations.length} user donations`);
    } else if (response.status === 401) {
      console.log("❌ Token invalid for donations, logging out");
      logout();
    } else {
      console.error("❌ Error loading donations:", response.status);
      donations = [];
    }
  } catch (error) {
    console.error('❌ Erro ao carregar doações:', error);
    donations = [];
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
  
  // Close user dropdown menu
  const existingMenu = document.getElementById('userDropdownMenu');
  if (existingMenu) {
    existingMenu.remove();
  }

  if (pageId === 'projects') {
    console.log("📋 Loading projects page...");
    console.log(" - projectsLoaded:", projectsLoaded);
    console.log(" - currentUser:", currentUser);
    
    if (!projectsLoaded) {
      console.log("🔄 Projects not loaded, fetching from API...");
      loadProjectsFromAPI(); // Load projects only if not already loaded
    } else {
      console.log("✅ Projects already loaded, rendering...");
      loadProjects(); // Just render the already loaded projects
    }
  } else if (pageId === 'transparency') {
    loadTransparencyData();
  } else if (pageId === 'reports') {
    loadReportsData();
    loadUserDonations(); // Load user donations when viewing reports
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
function getProjectImage(category) {
  const images = {
    'reflorestamento': '🌳',
    'conservacao-marinha': '🌊',
    'biodiversidade': '🦋',
    'energia-renovavel': '⚡',
    'educacao-ambiental': '📚'
  };
  return images[category] || '🌱';
}