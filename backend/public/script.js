document.addEventListener('DOMContentLoaded', () => {
  // ————————— HOME PAGE —————————
  const goBtn = document.getElementById('go-register');
  if (goBtn) {
    goBtn.addEventListener('click', () => {
      window.location.href = 'cadastro.html';
    });
    return; // não executa nada mais nesta página
  }

  // ————————— CADASTRO PAGE —————————
  const startBtn = document.getElementById('start-btn');
  if (startBtn) {
    // “Voltar” para a home
    document.getElementById('back-btn').addEventListener('click', () => {
      window.location.href = 'index.html';
    });

    const nameInput       = document.getElementById('name');
    const consentCheckbox = document.getElementById('consent');
    const phoneInput      = document.getElementById('phone');

    // Máscara do celular
    consentCheckbox.addEventListener('change', () => {
      phoneInput.disabled = !consentCheckbox.checked;
      if (!consentCheckbox.checked) phoneInput.value = '';
    });
    phoneInput.addEventListener('input', e => {
      let v = e.target.value.replace(/\D/g, '').slice(0,11);
      let out = '';
      if (v.length)       out += '(' + v.slice(0,2);
      if (v.length >= 3)  out += ') ' + v.slice(2,7);
      if (v.length >= 8)  out += '-' + v.slice(7,11);
      e.target.value = out;
    });

    startBtn.addEventListener('click', async () => {
      const name    = nameInput.value.trim();
      const roleEl  = document.querySelector('input[name="role"]:checked');
      const role    = roleEl ? roleEl.value : '';
      const consent = consentCheckbox.checked;
      const phone   = phoneInput.value.trim();

      if (!name) {
        return alert('Por favor, informe seu nome.');
      }

      // 1) sem consentimento → alerta na primeira vez e permanece na página
      if (!consent && !sessionStorage.getItem('skipConsentAlert')) {
        sessionStorage.setItem('skipConsentAlert', 'true');
        return alert(
          'Quer participar do nosso sorteio? Marque o termo de aceite e informe seu celular.'
        );
      }

      // 2) se consentiu mas número inválido → alerta, porém continua
      if (consent && phone.length < 14) {
        alert('Número de celular inválido. A avaliação seguirá sem sorteio.');
      }

      // 3) se consentiu e telefone válido → checa duplicação via API
      if (consent && phone.length >= 14) {
        try {
          const resp = await fetch(
            `/api/check-phone?phone=${encodeURIComponent(phone)}`
          );
          const { exists } = await resp.json();
          if (exists) {
            alert('Número de celular já participa do sorteio.');
          }
        } catch (err) {
          console.error(err);
        }
      }

      // Limpa flag de consentimento para próximas vezes
      sessionStorage.removeItem('skipConsentAlert');

      // Armazena no localStorage (sem telefone se inválido ou não consentiu)
      localStorage.setItem('csatName', name);
      localStorage.setItem('csatRole', role);
      localStorage.setItem('csatConsent', consent ? '1' : '0');
      localStorage.setItem(
        'csatPhone',
        consent && phone.length >= 14 ? phone : ''
      );

      // Navega para a survey
      window.location.href = 'survey.html';
    });

    return; // não processa o resto na página de cadastro
  }

  // ————————— SURVEY PAGE —————————
  const csatOptions = [
    { v:1, src:'assets/emojis/muito-insatisfeito.png', cls:'detractor' },
    { v:2, src:'assets/emojis/insatisfeito.png',       cls:'detractor' },
    { v:3, src:'assets/emojis/neutro.png',             cls:'neutral'   },
    { v:4, src:'assets/emojis/satisfeito.png',         cls:'promoter'  },
    { v:5, src:'assets/emojis/muito-satisfeito.png',   cls:'promoter'  },
  ];
  const ratingContainer = document.querySelector('.rating-container');
  csatOptions.forEach(o => {
    const img = document.createElement('img');
    img.src          = o.src;
    img.alt          = `Rating ${o.v}`;
    img.dataset.rating = o.v;
    img.className    = `rating-btn ${o.cls}`;
    ratingContainer.appendChild(img);
  });

  let selectedRating = null;
  const commentBox = document.querySelector('.comment-box');
  const submitBtn  = document.getElementById('submit-comment');
  const thankYou   = document.querySelector('.thank-you');

  // Clique no emoji
document.querySelectorAll('.rating-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    // 1) limpa seleção anterior
    document.querySelectorAll('.rating-btn').forEach(el => {
      el.classList.remove('selected');
    });
    // 2) marca o clicado
    btn.classList.add('selected');

    // 3) guarda a nota e exibe o comentário
    selectedRating = +btn.dataset.rating;
    commentBox.classList.remove('hidden');
  });
});

  // Clique no “Enviar” do comentário
  submitBtn.addEventListener('click', () => {
    const comment = document.getElementById('comment').value.trim();
    sendData({ rating: selectedRating, comment });
  });

  // Função genérica de envio
  function sendData({ rating, comment = null }) {
    const payload = {
      name:    localStorage.getItem('csatName'),
      role:    localStorage.getItem('csatRole'),
      consent: +localStorage.getItem('csatConsent'),
      phone:   localStorage.getItem('csatPhone'),
      rating,
      comment
    };

    fetch('/api/submit', {
      method:  'POST',
      headers: { 'Content-Type':'application/json' },
      body:    JSON.stringify(payload)
    })
    .then(() => {
      // mostra “Obrigado”
      ratingContainer.classList.add('hidden');
      commentBox.classList.add('hidden');
      thankYou.classList.remove('hidden');
      // após 5s volta à home com QR
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 5000);
    })
    .catch(err => {
      console.error(err);
      alert('Erro na submissão. Tente novamente mais tarde.');
    });
  }
});
