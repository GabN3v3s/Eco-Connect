function showProjectForm() {
  document.getElementById('projectModal').classList.remove('hidden');
  document.getElementById('projectModal').classList.add('flex');
}

function closeProjectForm() {
  document.getElementById('projectModal').classList.add('hidden');
  document.getElementById('projectModal').classList.remove('flex');
}

async function handleProjectSubmit(event) {
  event.preventDefault();
  const formData = new FormData(event.target);

  const projectData = {
    nome: formData.get('name') || event.target.querySelector('input[type="text"]').value,
    descricao: formData.get('description') || event.target.querySelector('textarea').value,
    localizacao: formData.get('location') || event.target.querySelectorAll('input[type="text"]')[1].value,
    meta: parseInt(formData.get('goal')) || parseInt(event.target.querySelector('input[type="number"]').value),
    categoria: formData.get('category') || event.target.querySelector('select').value
  };

  try {
    await createProjectAPI(projectData);
    closeProjectForm();
    event.target.reset(); // Clear the form
    alert('Projeto cadastrado com sucesso!');
  } catch (error) {
    alert('Erro ao cadastrar projeto: ' + error.message);
  }
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

  // Clear container completely before adding new content
  container.innerHTML = '';

  console.log(`Loading ${projects.length} projects`); // Debug log

  projects.forEach(project => {
    const progressPercentage = Math.min(((project.arrecadado || 0) / project.meta) * 100, 100);
    const projectCard = document.createElement('div');
    projectCard.className = 'bg-white rounded-lg shadow-lg overflow-hidden card-hover';
    projectCard.innerHTML = `
      <div class="p-6">
        <div class="text-4xl mb-4 text-center">${getProjectImage(project.categoria)}</div>
        <h3 class="text-xl font-semibold mb-2">${project.nome}</h3>
        <p class="text-gray-600 mb-4">${project.descricao}</p>
        <div class="mb-4">
          <div class="flex justify-between text-sm text-gray-600 mb-1">
            <span>Arrecadado: R$ ${(project.arrecadado || 0).toLocaleString()}</span>
            <span>Meta: R$ ${project.meta.toLocaleString()}</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div class="bg-green-600 h-2 rounded-full progress-bar" style="width: ${progressPercentage}%"></div>
          </div>
          <div class="text-sm text-gray-600 mt-1">${progressPercentage.toFixed(1)}% da meta atingida</div>
        </div>
        <div class="flex justify-between items-center mb-4">
          <span class="text-sm text-gray-600">📍 ${project.localizacao}</span>
          <span class="text-sm text-gray-600">👥 ${project.doadores || 0} doadores</span>
        </div>
        <button onclick="openDonationModal(${project.id})" class="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors">
          Doar Agora
        </button>
      </div>
    `;
    container.appendChild(projectCard);
  });
}