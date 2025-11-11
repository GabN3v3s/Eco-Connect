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

async function handleRegister(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  
  const userData = {
    nome: formData.get('name'),
    email: formData.get('email'),
    senha: formData.get('password'),
    tipo: document.getElementById('donorBtn').classList.contains('border-green-500') ? 'doador' : 'organizacao'
  };

  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData)
    });
    
    const result = await response.json();
    if (response.ok) {
      alert('Cadastro realizado com sucesso! Você pode agora fazer login.');
      showPage('login');
    } else {
      throw new Error(result.message || 'Erro no cadastro');
    }
  } catch (error) {
    alert('Erro no cadastro: ' + error.message);
  }
}

async function handleLogin(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  
  const loginData = {
    email: formData.get('email'),
    senha: formData.get('password')
  };

  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData)
    });
    
    const result = await response.json();
    if (response.ok) {
      currentUser = {
        name: 'Usuário Demo', // You might want to get this from the API response
        email: loginData.email,
        type: 'donor',
        token: result.token
      };
      localStorage.setItem('token', result.token); // Store token for future requests
      alert('Login realizado com sucesso!');
      showPage('projects');
    } else {
      throw new Error(result.message || 'Erro no login');
    }
  } catch (error) {
    alert('Erro no login: ' + error.message);
  }
}
