// Elementos
const formValidation = document.getElementById('form-validation');
const formCreatePassword = document.getElementById('form-create-password');
const formLogin = document.getElementById('form-login');

const btnCreatePassword = document.getElementById('btn-create-password');
const btnLogin = document.getElementById('btn-login');

const linkLogin = document.getElementById('link-login');
const linkBack = document.getElementById('link-back');

document.addEventListener('DOMContentLoaded', () => {
  // Função para mostrar um formulário e esconder o outro
  function toggleForms(hideForm, showForm) {
      hideForm.classList.remove('visible');
      showForm.classList.add('visible');
      hideForm.style.opacity = 0;
      showForm.style.opacity = 1;
  }

  // Exibir o primeiro formulário com animação
  formValidation.classList.add('visible');

  // Ação ao clicar em "Já tenho uma conta!"
  linkLogin.addEventListener('click', (event) => {
      event.preventDefault();
      toggleForms(formValidation, formLogin);
  });

  // Ação ao clicar em "Ainda não tenho uma conta"
  linkBack.addEventListener('click', (event) => {
      event.preventDefault();
      toggleForms(formLogin, formValidation);
  });
});

document.getElementById('btn-create-password').addEventListener('click', () => {
  event.preventDefault();
  const email = document.getElementById('email-validation').value;
  const chave = document.getElementById('key-validation').value;

  const sanitizedEmail = validateInput(email);
  if (sanitizedEmail !== email){
    return showAlert("Input contém caracteres inválidos ou maliciosos.", "error", "❌", 1600);
  }

  if (email === '' || chave === '') {
    return showAlert("Preencha todos os campos", "error", "❌", 2000);
  }

  return showAlert("Essa opção está bloqueada ainda", "error", "❌", 2000);

  // chaveOuEmailExiste(email, chave);
});

const submitCreatePassword = document.getElementById('submit-criar-senha');

// Fazer login
btnLogin.addEventListener('click', () => {
  event.preventDefault();

  const email = document.getElementById('email-login').value;
  const password = document.getElementById('senha-login').value;

  const sanitizedEmail = validateInput(email);
  const sanitizedPassword = validateInput(password);

  if (sanitizedEmail !== email || sanitizedPassword !== password) {
    return showAlert("Input contém caracteres inválidos ou maliciosos.", "error", "❌", 1600);
  }
  
  if(email === '' || password === ''){
    return showAlert("Preencha todos os campos!", "error", "❌", 1000);
  }

  if(email === 'admin@gmail.com' && password === 'Senha123@'){
    localStorage.setItem('contaValida', 'true');
    return window.location.href = 'app.html';
  } else {
    return showAlert("Email ou senha incorretos!", "error", "❌", 1000);
  }

  // const dados = {
  //   email: email,
  //   password: password
  // }

  // fetch('https://localhost:3000/api/login', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json'
  //   },
  //   body: JSON.stringify(dados)
  // })
  // .then(res => res.json())
  // .then(data => {
  //   if (data.error) {
  //     return alert(data.error);
  //   }

  //   alert('Login efetuado com sucesso!');
  // })
  // .catch(error => console.error('Error: ', error))
})

// Ação ao submeter o formulário de criação de senha
submitCreatePassword.addEventListener('click', (event) => {
  event.preventDefault(); // Impede o envio do formulário

  const password = document.getElementById('password').value;
  const repeatPassword = document.getElementById('repeat-password').value;

  // Sanitiza as senhas antes de validá-las
  const sanitizedPassword = validateInput(password);
  const sanitizedRepeatPassword = validateInput(repeatPassword);

  if (sanitizedPassword !== password || sanitizedRepeatPassword !== repeatPassword) {
    return alert('Input contém caracteres inválidos ou maliciosos.');
  }

  // Verifica se as senhas são iguais
  if (!senhasIguais(password, repeatPassword)) {
    return alert('As senhas não coincidem. Tente novamente!');
  } 

  let verificarForcaSenha = senhaForte(password);
  if (verificarForcaSenha !== true) {
    return alert(verificarForcaSenha);
  }

  formCreatePassword.submit();
})


function senhasIguais(senha, senhaRedigitada){
  return senha === senhaRedigitada ? true : false;
}

function senhaForte(senha) {
  // Verifica se a senha tem pelo menos 6 caracteres
  if (senha.length < 6) {
    return 'A senha deve ter pelo menos 6 caracteres.';
  }

  // Verifica se a senha contém pelo menos uma letra maiúscula
  if (!/[A-Z]/.test(senha)) {
    return 'A senha deve conter pelo menos uma letra maiúscula.';
  }

  // Verifica se a senha contém pelo menos uma letra minúscula
  if (!/[a-z]/.test(senha)) {
    return 'A senha deve conter pelo menos uma letra minúscula.';
  }

  // Verifica se a senha contém pelo menos um número
  if (!/[0-9]/.test(senha)) {
    return 'A senha deve conter pelo menos um número.';
  }

  // Verifica se a senha contém pelo menos um caractere especial
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(senha)) {
    return 'A senha deve conter pelo menos um caractere especial.';
  }

  // Se todas as condições forem atendidas, a senha é forte
  return true;
}

function sanitizeInput(input) {
  // Cria um elemento temporário para usar o método .textContent que não interpreta HTML.
  const tempDiv = document.createElement('div');
  tempDiv.textContent = input;

  // Retorna o conteúdo "limpo" que foi escapado
  return tempDiv.innerHTML;
}

function validateInput(input) { 
  const sanitizedInput = sanitizeInput(input);

  const forbiddenTagsOrEvents = /<script.*?>.*?<\/script>|on\w+\s*=/gi;

  if (forbiddenTagsOrEvents.test(sanitizedInput)) {
    return 'Input contém conteúdo malicioso.';
  }

  // Se tudo estiver ok, retornamos o input sanitizado.
  return sanitizedInput;
}


async function chaveOuEmailExiste(email, chave) {
  try {
    const dados = {
      email: email,
      key: chave
    }

    fetch('https://localhost:3000/api/verificar-existencia-chave-e-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dados)
    })
    .then(res => res.json())
    // .then(data => console.log('Usuario'))
    .catch(error => console.error('Error: ', error))

  } catch (error) {
    console.log(error);
  }
}