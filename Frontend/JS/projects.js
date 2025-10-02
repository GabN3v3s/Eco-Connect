// Projetos - JavaScript
function showProjectForm() {
  document.getElementById('projectModal').classList.remove('hidden');
  document.getElementById('projectModal').classList.add('flex');
}

function closeProjectForm() {
  document.getElementById('projectModal').classList.add('hidden');
  document.getElementById('projectModal').classList.remove('flex');
}

function handleProjectSubmit(event) {
  event.preventDefault();
  const formData = new FormData(event.target);

  const newProject = {
    id: Date.now(),
    name: formData.get('name') || event.target.querySelector('input[type="text"]').value,
    description: formData.get('description') || event.target.querySelector('textarea').value,
    location: formData.get('location') || event.target.querySelectorAll('input[type="text"]')[1].value,
    goal: parseInt(formData.get('goal')) || parseInt(event.target.querySelector('input[type="number"]').value),
    category: formData.get('category') || event.target.querySelector('select').value,
    raised: 0,
    donors: 0,
    organization: 'Nova Organização',
    image: getProjectImage(formData.get('category') || event.target.querySelector('select').value)
  };

  projects.push(newProject);
  closeProjectForm();
  loadProjects();
  alert('Projeto cadastrado com sucesso!');
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

function loadProjects() {
  const container = document.getElementById('projectsList');
  container.innerHTML = '';

  projects.forEach(project => {
    const progressPercentage = Math.min((project.raised / project.goal) * 100, 100);
    const projectCard = document.createElement('div');
    projectCard.className = 'bg-white rounded-lg shadow-lg overflow-hidden card-hover';
    projectCard.innerHTML = `
      <div class="p-6">
        <div class="text-4xl mb-4 text-center">${project.image}</div>
        <h3 class="text-xl font-semibold mb-2">${project.name}</h3>
        <p class="text-gray-600 mb-4">${project.description}</p>
        <div class="mb-4">
          <div class="flex justify-between text-sm text-gray-600 mb-1">
            <span>Arrecadado: R$ ${project.raised.toLocaleString()}</span>
            <span>Meta: R$ ${project.goal.toLocaleString()}</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div class="bg-green-600 h-2 rounded-full progress-bar" style="width: ${progressPercentage}%"></div>
          </div>
          <div class="text-sm text-gray-600 mt-1">${progressPercentage.toFixed(1)}% da meta atingida</div>
        </div>
        <div class="flex justify-between items-center mb-4">
          <span class="text-sm text-gray-600">📍 ${project.location}</span>
          <span class="text-sm text-gray-600">👥 ${project.donors} doadores</span>
        </div>
        <button onclick="openDonationModal(${project.id})" class="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors">
          Doar Agora
        </button>
      </div>
    `;
    container.appendChild(projectCard);
  });
}
