(function() {
  const nav = document.querySelector('.nav');
  const modal = document.getElementById('contact-modal');
  const modalForm = document.getElementById('contact-form');
  const contactTriggers = document.querySelectorAll('.contact-trigger');
  const modalClose = document.querySelector('.modal-close');
  const messageEdit = document.querySelector('.message-edit');
  const messageTextarea = document.getElementById('contact-message');

  function handleScroll() {
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  function setupFadeIn() {
    const elements = document.querySelectorAll('.fade-in');
    
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.2
      });
      
      elements.forEach(function(el) {
        observer.observe(el);
      });
    } else {
      elements.forEach(function(el) {
        el.classList.add('visible');
      });
    }
  }

  setupFadeIn();

  function openModal() {
    modal.hidden = false;
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    var emailInput = document.getElementById('contact-email');
    if (emailInput) {
      emailInput.focus();
    }
  }

  function closeModal() {
    modal.hidden = true;
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  contactTriggers.forEach(function(trigger) {
    trigger.addEventListener('click', openModal);
  });

  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && !modal.hidden) {
      closeModal();
    }
  });

  if (messageEdit && messageTextarea) {
    messageEdit.addEventListener('click', function() {
      messageTextarea.focus();
      messageTextarea.select();
    });
  }

  if (modalForm) {
    modalForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      var formData = new FormData(modalForm);
      var data = {
        email: formData.get('email'),
        message: formData.get('message')
      };
      
      console.log('Form submission:', data);
      
      modalForm.reset();
      messageTextarea.value = 'Hey Ricardo, I read your profile, and I\'d like to chat. Please reach out to me.';
      
      closeModal();
      
      alert('Message sent! (This is a placeholder - connect to your backend)');
    });
  }
})();
