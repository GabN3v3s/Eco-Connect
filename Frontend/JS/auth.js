// Registro e Login
function selectUserType(type) {
  const donorBtn = document.getElementById('donorBtn');
  const orgBtn = document.getElementById('orgBtn');
  const orgFields = document.getElementById('organizationFields');
  const documentField = document.getElementById('documentField');

  donorBtn.classList.remove('border-green-500', 'bg-green-50');
  orgBtn.classList.remove('border-green-500', 'bg-green-50');

  if (type === 'donor') {
    donorBtn.classList.add('border-green-500', 'bg-green-50');
    orgFields.classList.add('hidden');
    documentField.querySelector('label').textContent = 'CPF';
  } else {
    orgBtn.classList.add('border-green-500', 'bg-green-50');
    orgFields.classList.remove('hidden');
    documentField.querySelector('label').textContent = 'CPF do Responsável';
  }
}

function handleRegister(event) {
  event.preventDefault();
  alert('Cadastro realizado com sucesso! Você pode agora fazer login.');
  showPage('login');
}

function handleLogin(event) {
  event.preventDefault();
  currentUser = {
    name: 'Usuário Demo',
    email: 'demo@ecoconnect.com',
    type: 'donor'
  };
  alert('Login realizado com sucesso!');
  showPage('projects');
}
