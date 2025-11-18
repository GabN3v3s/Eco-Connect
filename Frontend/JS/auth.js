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
      throw new Error(result.error || result.message || 'Erro no cadastro');
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
    console.log("🔐 Attempting login...");
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData)
    });
    
    const result = await response.json();
    if (response.ok) {
      console.log("✅ Login successful:", result);
      
      // Store user data and token
      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));
      
      currentUser = result.user;
      updateNavigation();
      
      alert('Login realizado com sucesso!');
      
      // Load projects immediately after login
      console.log("🔄 Loading projects after login...");
      projectsLoaded = false; // Force reload
      await loadProjectsFromAPI();
      
      showPage('projects');
    } else {
      throw new Error(result.error || result.message || 'Erro no login');
    }
  } catch (error) {
    console.error("❌ Login error:", error);
    alert('Erro no login: ' + error.message);
  }
}