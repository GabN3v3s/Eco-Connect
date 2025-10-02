// Sistema de Doações - JavaScript
function openDonationModal(projectId) {
  const project = projects.find(p => p.id === projectId);
  if (!project) return;

  currentDonationProject = project;
  const projectInfo = document.getElementById('donationProjectInfo');
  projectInfo.innerHTML = `
    <div class="text-center">
      <div class="text-4xl mb-2">${project.image}</div>
      <h4 class="text-lg font-semibold">${project.name}</h4>
      <p class="text-gray-600">${project.location}</p>
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

function handleDonation(event) {
  event.preventDefault();
  if (!currentDonationProject) return;

  const formData = new FormData(event.target);
  const amount = parseInt(formData.get('amount'));
  const donorName = formData.get('name');
  const donorEmail = formData.get('email');

  currentDonationProject.raised += amount;
  currentDonationProject.donors += 1;

  donations.push({
    id: Date.now(),
    projectId: currentDonationProject.id,
    projectName: currentDonationProject.name,
    amount,
    donorName,
    donorEmail,
    date: new Date().toISOString(),
    status: 'completed'
  });

  closeDonationModal();
  loadProjects();
  updateStats();

  alert(`Doação de R$ ${amount.toLocaleString()} realizada com sucesso!\nObrigado por apoiar o projeto "${currentDonationProject.name}".`);
}
