      // Recupera o nome do usuário do localStorage
      const userName = localStorage.getItem('userName');

      // Verifica se o nome existe e atualiza o texto do botão
      if (userName) {
          const loginBtn = document.getElementById('loginBtn');
          loginBtn.textContent = `Bem-vindo, ${userName}`;
          loginBtn.disabled = true;
          loginBtn.classList.add('cursor-default');
      }