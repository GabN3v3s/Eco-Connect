function openDonationModal(projectId) {
  if (!currentUser) {
    alert('Você precisa estar logado para fazer uma doação. Por favor, faça login ou cadastre-se.');
    showPage('login');
    return;
  }

  const project = projects.find(p => p.id === projectId);
  if (!project) return;

  currentDonationProject = project;
  const projectInfo = document.getElementById('donationProjectInfo');
  projectInfo.innerHTML = `
    <div class="text-center">
      <div class="text-4xl mb-2">${getProjectImage(project.categoria)}</div>
      <h4 class="text-lg font-semibold">${project.nome}</h4>
      <p class="text-gray-600">${project.localizacao}</p>
      <div class="mt-4 p-3 bg-gray-50 rounded-lg">
        <div class="flex justify-between text-sm text-gray-600 mb-1">
          <span>Arrecadado: R$ ${(project.arrecadado || 0).toLocaleString()}</span>
          <span>Meta: R$ ${project.meta.toLocaleString()}</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div class="bg-green-600 h-2 rounded-full" style="width: ${Math.min(((project.arrecadado || 0) / project.meta) * 100, 100)}%"></div>
        </div>
        <div class="text-sm text-gray-600 mt-1 text-center">
          ${Math.min(((project.arrecadado || 0) / project.meta) * 100, 100).toFixed(1)}% da meta atingida
        </div>
      </div>
    </div>
  `;

  // Update donation form for real donations
  const donationForm = document.querySelector('#donationModal form');
  donationForm.innerHTML = `
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">Valor da Doação (R$)</label>
      <input type="number" name="amount" min="1" required
        class="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-lg font-semibold"
        placeholder="Digite o valor"
        step="1">
    </div>
    
    <div class="bg-green-50 p-4 rounded-lg border border-green-200">
      <div class="flex items-start">
        <div class="flex-shrink-0">
          <span class="text-green-600 text-lg">👤</span>
        </div>
        <div class="ml-3">
          <p class="text-sm font-medium text-green-800">Olá, ${currentUser.nome}!</p>
          <p class="text-sm text-green-700 mt-1">Sua doação será registrada automaticamente em seu nome.</p>
        </div>
      </div>
    </div>
    
    <div class="bg-blue-50 p-4 rounded-lg border border-blue-200">
      <div class="flex items-start">
        <div class="flex-shrink-0">
          <span class="text-blue-600 text-lg">💚</span>
        </div>
        <div class="ml-3">
          <p class="text-sm font-medium text-blue-800">Doação Real</p>
          <p class="text-sm text-blue-700 mt-1">Sua contribuição ajudará diretamente este projeto ambiental.</p>
        </div>
      </div>
    </div>
    
    <button type="submit"
      class="w-full bg-green-600 text-white py-4 rounded-lg hover:bg-green-700 transition-colors font-semibold text-lg shadow-lg">
      💰 Confirmar Doação
    </button>
  `;

  document.getElementById('donationModal').classList.remove('hidden');
  document.getElementById('donationModal').classList.add('flex');
}

function closeDonationModal() {
  document.getElementById('donationModal').classList.add('hidden');
  document.getElementById('donationModal').classList.remove('flex');
  currentDonationProject = null;
}

async function handleDonation(event) {
  event.preventDefault();
  if (!currentDonationProject) return;

  if (!currentUser) {
    alert('Você precisa estar logado para fazer uma doação.');
    showPage('login');
    return;
  }

  const formData = new FormData(event.target);
  const amount = parseInt(formData.get('amount'));
  
  if (amount <= 0) {
    alert('Por favor, insira um valor válido para a doação.');
    return;
  }

  if (isNaN(amount)) {
    alert('Por favor, insira um valor numérico válido.');
    return;
  }

  // Show confirmation dialog
  const confirmed = confirm(`CONFIRMAR DOAÇÃO\n\nVocê está prestes a doar:\n💰 R$ ${amount.toLocaleString()}\n\nPara o projeto:\n🌱 ${currentDonationProject.nome}\n\nDeseja confirmar esta doação?`);
  
  if (!confirmed) {
    return;
  }

  const donationData = {
    projeto_id: currentDonationProject.id,
    valor: amount
  };

  try {
    console.log("🔍 Making donation request to:", `${API_BASE_URL}/donations`);
    
    const response = await fetch(`${API_BASE_URL}/donations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(donationData)
    });

    console.log("🔍 Response status:", response.status);
    console.log("🔍 Response ok:", response.ok);

    // Check if response is OK first
    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch (e) {
        // If we can't parse JSON, use the status text
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    // Parse the successful response
    const result = await response.json();
    
    console.log("✅ Donation API response:", result);

    // Store project name before closing modal
    const projectName = currentDonationProject.nome;
    
    // Close modal first
    closeDonationModal();
    
    // Show success message - FIX: Use the stored projectName instead of currentUser.nome
    alert(`✅ DOAÇÃO REALIZADA COM SUCESSO!\n\n💚 Obrigado por sua contribuição!\n\n💰 Valor: R$ ${amount.toLocaleString()}\n🌱 Projeto: ${projectName}\n\nSua doação faz a diferença para o meio ambiente!`);
    
    // Reload data
    projectsLoaded = false;
    await loadUserDonations();
    await loadProjectsFromAPI();
    
  } catch (error) {
    console.error('Donation error details:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      alert('❌ Erro de conexão: Não foi possível conectar ao servidor. Verifique se o servidor está rodando.');
    } else {
      alert('❌ Erro ao processar doação: ' + error.message);
    }
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