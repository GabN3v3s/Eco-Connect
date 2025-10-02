
let currentUser = null;
let projects = [];
let donations = [];
let currentDonationProject = null;

// Inicia a aplicação
document.addEventListener('DOMContentLoaded', function () {
  loadSampleData();
  showPage('home');
  updateStats();
});

// Navegação entre páginas
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(page => {
    page.classList.add('hidden');
  });
  document.getElementById(pageId).classList.remove('hidden');
  document.getElementById(pageId).classList.add('fade-in');

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
