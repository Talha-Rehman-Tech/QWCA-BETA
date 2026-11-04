document.getElementById("year").textContent = new Date().getFullYear();

const contactForm = document.querySelector('form[action="mailto:info@qwca.pk"]');
const contactFormStatus = document.getElementById("contact-form-status");

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(contactForm);
  const service = formData.get("Service");
  const subject = `Website inquiry - ${service}`;
  const body = [
    `Name: ${formData.get("Name")}`,
    `Email: ${formData.get("Email")}`,
    `Service: ${service}`,
    "",
    "Message:",
    formData.get("Message")
  ].join("\n");
  const composeUrl = new URL("https://mail.google.com/mail/");
  composeUrl.search = new URLSearchParams({
    view: "cm",
    fs: "1",
    to: "info@qwca.pk",
    su: subject,
    body
  });

  contactFormStatus.hidden = false;
  contactFormStatus.replaceChildren();

  const composeWindow = window.open(composeUrl.toString(), "_blank");
  if (composeWindow) {
    composeWindow.opener = null;
    contactFormStatus.textContent = "Your message is ready in Gmail. Review it and select Send.";
    return;
  }

  contactFormStatus.append(
    document.createTextNode("Your browser blocked the compose window. "),
    Object.assign(document.createElement("a"), {
      href: composeUrl.toString(),
      target: "_blank",
      rel: "noopener noreferrer",
      textContent: "Open your message in Gmail"
    }),
    document.createTextNode(".")
  );
});

    // Fullscreen Image Lightbox Preview
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImg');
    const modalCaption = document.getElementById('modalCaption');
    const closeBtn = document.querySelector('.image-modal-close');

    function openModal(img) {
      modalImg.src = img.src;
      modalImg.alt = img.alt || 'Full screen preview';
      modalCaption.textContent = img.alt || '';
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      setTimeout(() => {
        if (!modal.classList.contains('active')) {
          modalImg.src = '';
        }
      }, 250);
    }

    // Attach click listener to all page images (excluding modal image itself)
    document.querySelectorAll('img:not(.image-modal-img)').forEach((img) => {
      img.addEventListener('click', () => openModal(img));
    });

    closeBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target.classList.contains('image-modal-content')) {
        closeModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
      }
    });
