function openDonationModal(projectId) {
  const project = projects.find(p => p.id === projectId);
  if (!project) return;

  currentDonationProject = project;
  const projectInfo = document.getElementById('donationProjectInfo');
  projectInfo.innerHTML = `
    <div class="text-center">
      <div class="text-4xl mb-2">${getProjectImage(project.categoria)}</div>
      <h4 class="text-lg font-semibold">${project.nome}</h4>
      <p class="text-gray-600">${project.localizacao}</p>
    </div>
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

  const formData = new FormData(event.target);
  const amount = parseInt(formData.get('amount'));
  const donorName = formData.get('name');
  const donorEmail = formData.get('email');

  const donationData = {
    projeto_id: currentDonationProject.id,
    nome: donorName,
    email: donorEmail,
    valor: amount
  };

  try {
    await createDonationAPI(donationData);
    closeDonationModal();
    alert(`Doação de R$ ${amount.toLocaleString()} realizada com sucesso!\nObrigado por apoiar o projeto "${currentDonationProject.nome}".`);
  } catch (error) {
    alert('Erro ao processar doação: ' + error.message);
  }
}