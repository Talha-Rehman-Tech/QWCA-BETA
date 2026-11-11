document.getElementById("year").textContent = new Date().getFullYear();

// Mobile Navigation Drawer Toggle
(function initMobileNav() {
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  if (!navToggle || !navLinks) return;

  function toggleMenu(forceOpen) {
    const shouldOpen = typeof forceOpen === 'boolean' ? forceOpen : !navLinks.classList.contains('active');
    navToggle.classList.toggle('active', shouldOpen);
    navLinks.classList.toggle('active', shouldOpen);
    navToggle.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');
  }

  navToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  // Close when clicking any link inside navLinks
  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      toggleMenu(false);
    });
  });

  // Close when clicking outside of navbar
  document.addEventListener('click', (e) => {
    if (navLinks.classList.contains('active') && !navLinks.contains(e.target) && !navToggle.contains(e.target)) {
      toggleMenu(false);
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('active')) {
      toggleMenu(false);
    }
  });

  // Reset menu if window resized to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 960 && navLinks.classList.contains('active')) {
      toggleMenu(false);
    }
  });
})();

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

/* ==========================================================================
   FBR Salary Tax Calculator (Tax Years 2026-27, 2025-26, 2024-25, 2023-24)
   ========================================================================== */
(function initSalaryTaxCalculator() {
  const salaryInput = document.getElementById('monthlySalary');
  const salaryPeriodSelect = document.getElementById('salaryPeriod');
  const salaryInputLabel = document.getElementById('salaryInputLabel');
  const taxYearSelect = document.getElementById('taxYear');
  const calculateBtn = document.getElementById('btnCalculateTax');
  const presetsRow = document.getElementById('presetsRow');
  const slabTabs = document.querySelectorAll('.slabs-tabs .tab-btn');

  // Category Switcher Elements
  const tabSalaried = document.getElementById('tabSalaried');
  const tabBusiness = document.getElementById('tabBusiness');
  const tabRental = document.getElementById('tabRental');
  const salariedCalcView = document.getElementById('salariedCalcView');
  const businessCalcView = document.getElementById('businessCalcView');
  const rentalCalcView = document.getElementById('rentalCalcView');
  const btnBackToSalaried = document.getElementById('btnBackToSalaried');

  const resMonthlyTakeHome = document.getElementById('resMonthlyTakeHome');
  const resMonthlyTax = document.getElementById('resMonthlyTax');
  const resAnnualSalary = document.getElementById('resAnnualSalary');
  const resAnnualTax = document.getElementById('resAnnualTax');
  const resAnnualTakeHome = document.getElementById('resAnnualTakeHome');
  const resEffectiveRate = document.getElementById('resEffectiveRate');
  const resYearBadge = document.getElementById('resYearBadge');
  const slabBannerTitle = document.getElementById('slabBannerTitle');
  const slabBannerDesc = document.getElementById('slabBannerDesc');

  const slabsTableTitle = document.getElementById('slabsTableTitle');
  const slabsTableDesc = document.getElementById('slabsTableDesc');
  const slabsTableBody = document.getElementById('slabsTableBody');

  if (!salaryInput || !taxYearSelect || !slabsTableBody) {
    return; // Tax calculator not present on this page
  }

  // Category Switcher Handler
  function switchTaxCategory(category) {
    if (tabSalaried) {
      tabSalaried.classList.remove('active');
      tabSalaried.setAttribute('aria-selected', 'false');
    }
    if (tabBusiness) {
      tabBusiness.classList.remove('active');
      tabBusiness.setAttribute('aria-selected', 'false');
    }
    if (tabRental) {
      tabRental.classList.remove('active');
      tabRental.setAttribute('aria-selected', 'false');
    }

    if (salariedCalcView) salariedCalcView.hidden = true;
    if (businessCalcView) businessCalcView.hidden = true;
    if (rentalCalcView) rentalCalcView.hidden = true;

    if (category === 'business') {
      if (tabBusiness) {
        tabBusiness.classList.add('active');
        tabBusiness.setAttribute('aria-selected', 'true');
      }
      if (businessCalcView) {
        businessCalcView.hidden = false;
        businessCalcView.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
      if (typeof window.updateBusinessCalculator === 'function') {
        window.updateBusinessCalculator();
      }
    } else if (category === 'rental') {
      if (tabRental) {
        tabRental.classList.add('active');
        tabRental.setAttribute('aria-selected', 'true');
      }
      if (rentalCalcView) {
        rentalCalcView.hidden = false;
        rentalCalcView.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
      if (typeof window.updateRentalCalculator === 'function') {
        window.updateRentalCalculator();
      }
    } else {
      if (tabSalaried) {
        tabSalaried.classList.add('active');
        tabSalaried.setAttribute('aria-selected', 'true');
      }
      if (salariedCalcView) {
        salariedCalcView.hidden = false;
      }
      updateCalculator();
    }
  }

  // Expose globally for header and footer navigation
  window.switchTaxCategory = switchTaxCategory;

  if (tabSalaried) {
    tabSalaried.addEventListener('click', () => switchTaxCategory('salaried'));
  }
  if (tabBusiness) {
    tabBusiness.addEventListener('click', () => switchTaxCategory('business'));
  }
  if (tabRental) {
    tabRental.addEventListener('click', () => switchTaxCategory('rental'));
  }
  if (btnBackToSalaried) {
    btnBackToSalaried.addEventListener('click', () => switchTaxCategory('salaried'));
  }

  const PRESETS_DATA = {
    monthly: [
      { label: '50k', amount: 50000 },
      { label: '100k', amount: 100000 },
      { label: '150k', amount: 150000 },
      { label: '250k', amount: 250000 },
      { label: '500k', amount: 500000 }
    ],
    annually: [
      { label: '600k', amount: 600000 },
      { label: '1.2M', amount: 1200000 },
      { label: '1.8M', amount: 1800000 },
      { label: '3.0M', amount: 3000000 },
      { label: '6.0M', amount: 6000000 }
    ]
  };

  function renderPresets(period) {
    if (!presetsRow) return;
    presetsRow.innerHTML = '';
    const presets = PRESETS_DATA[period] || PRESETS_DATA.monthly;
    const currentVal = parseSalary(salaryInput.value);

    presets.forEach((p) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'preset-pill' + (p.amount === currentVal ? ' active' : '');
      btn.setAttribute('data-amount', p.amount);
      btn.textContent = p.label;
      btn.addEventListener('click', () => {
        salaryInput.value = p.amount.toLocaleString('en-PK');
        syncPresetPillsActive(p.amount);
      });
      presetsRow.appendChild(btn);
    });
  }

  const TAX_DATA = {
    '2026-2027': {
      label: 'Tax Year 2026–2027',
      title: 'Tax Year 2026–2027',
      desc: 'Tax Year 2026–2027 retains the Rs 600,000 basic exemption while restructuring middle and upper bracket rates.',
      slabs: [
        {
          min: 0,
          max: 600000,
          rate: 0,
          baseTax: 0,
          rangeText: 'Up to Rs 600,000',
          rateText: '0%',
          payableText: 'Exempt',
          formulaDesc: 'Tax exempt (0% tax payable)'
        },
        {
          min: 600000,
          max: 1200000,
          rate: 0.01,
          baseTax: 0,
          rangeText: 'Rs 600,001 – Rs 1,200,000',
          rateText: '1%',
          payableText: 'of the amount above Rs 600,000',
          formulaDesc: '1% of the amount exceeding Rs 600,000'
        },
        {
          min: 1200000,
          max: 2200000,
          rate: 0.11,
          baseTax: 6000,
          rangeText: 'Rs 1,200,001 – Rs 2,200,000',
          rateText: '11%',
          payableText: '+ Rs 6,000',
          formulaDesc: 'Rs 6,000 + 11% of amount exceeding Rs 1,200,000'
        },
        {
          min: 2200000,
          max: 3200000,
          rate: 0.20,
          baseTax: 116000,
          rangeText: 'Rs 2,200,001 – Rs 3,200,000',
          rateText: '20%',
          payableText: '+ Rs 116,000',
          formulaDesc: 'Rs 116,000 + 20% of amount exceeding Rs 2,200,000'
        },
        {
          min: 3200000,
          max: 4100000,
          rate: 0.25,
          baseTax: 316000,
          rangeText: 'Rs 3,200,001 – Rs 4,100,000',
          rateText: '25%',
          payableText: '+ Rs 316,000',
          formulaDesc: 'Rs 316,000 + 25% of amount exceeding Rs 3,200,000'
        },
        {
          min: 4100000,
          max: 5600000,
          rate: 0.29,
          baseTax: 541000,
          rangeText: 'Rs 4,100,001 – Rs 5,600,000',
          rateText: '29%',
          payableText: '+ Rs 541,000',
          formulaDesc: 'Rs 541,000 + 29% of amount exceeding Rs 4,100,000'
        },
        {
          min: 5600000,
          max: 7000000,
          rate: 0.32,
          baseTax: 976000,
          rangeText: 'Rs 5,600,001 – Rs 7,000,000',
          rateText: '32%',
          payableText: '+ Rs 976,000',
          formulaDesc: 'Rs 976,000 + 32% of amount exceeding Rs 5,600,000'
        },
        {
          min: 7000000,
          max: Infinity,
          rate: 0.35,
          baseTax: 1424000,
          rangeText: 'Above Rs 7,000,000',
          rateText: '35%',
          payableText: '+ Rs 1,424,000',
          formulaDesc: 'Rs 1,424,000 + 35% of amount exceeding Rs 7,000,000'
        }
      ]
    },
    '2025-2026': {
      label: 'Tax Year 2025–2026',
      title: 'Tax Year 2025–2026',
      desc: 'Progressive salary tax slab rates applicable for Tax Year 2025–2026 under the FBR Income Tax Ordinance.',
      slabs: [
        {
          min: 0,
          max: 600000,
          rate: 0,
          baseTax: 0,
          rangeText: 'Up to Rs. 600,000',
          rateText: '0%',
          payableText: '0% (Tax-Free / Exempt)',
          formulaDesc: 'Tax exempt (0% tax payable)'
        },
        {
          min: 600000,
          max: 1200000,
          rate: 0.01,
          baseTax: 0,
          rangeText: 'Rs. 600,001 to Rs. 1,200,000',
          rateText: '1%',
          payableText: '1% of amount exceeding Rs. 600,000',
          formulaDesc: '1% of the amount exceeding Rs. 600,000'
        },
        {
          min: 1200000,
          max: 2200000,
          rate: 0.11,
          baseTax: 6000,
          rangeText: 'Rs. 1,200,001 to Rs. 2,200,000',
          rateText: '11%',
          payableText: 'Rs. 6,000 + 11% of amount exceeding Rs. 1,200,000',
          formulaDesc: 'Rs. 6,000 + 11% of amount exceeding Rs. 1,200,000'
        },
        {
          min: 2200000,
          max: 3200000,
          rate: 0.23,
          baseTax: 116000,
          rangeText: 'Rs. 2,200,001 to Rs. 3,200,000',
          rateText: '23%',
          payableText: 'Rs. 116,000 + 23% of amount exceeding Rs. 2,200,000',
          formulaDesc: 'Rs. 116,000 + 23% of amount exceeding Rs. 2,200,000'
        },
        {
          min: 3200000,
          max: 4100000,
          rate: 0.30,
          baseTax: 346000,
          rangeText: 'Rs. 3,200,001 to Rs. 4,100,000',
          rateText: '30%',
          payableText: 'Rs. 346,000 + 30% of amount exceeding Rs. 3,200,000',
          formulaDesc: 'Rs. 346,000 + 30% of amount exceeding Rs. 3,200,000'
        },
        {
          min: 4100000,
          max: Infinity,
          rate: 0.35,
          baseTax: 616000,
          rangeText: 'Above Rs. 4,100,000',
          rateText: '35%',
          payableText: 'Rs. 616,000 + 35% of amount exceeding Rs. 4,100,000',
          formulaDesc: 'Rs. 616,000 + 35% of amount exceeding Rs. 4,100,000'
        }
      ]
    },
    '2024-2025': {
      label: 'Tax Year 2024–2025',
      title: 'Tax Year 2024–2025',
      desc: 'Official FBR tax slab rates for salaried individuals for Tax Year 2024–2025.',
      slabs: [
        {
          min: 0,
          max: 600000,
          rate: 0,
          baseTax: 0,
          rangeText: 'Up to 600,000',
          rateText: '0%',
          payableText: '0 (Exempt)',
          formulaDesc: 'Tax exempt (0% tax payable)'
        },
        {
          min: 600000,
          max: 1200000,
          rate: 0.05,
          baseTax: 0,
          rangeText: '600,001 – 1,200,000',
          rateText: '5%',
          payableText: '5% of amount exceeding 600,000',
          formulaDesc: '5% of the amount exceeding Rs 600,000'
        },
        {
          min: 1200000,
          max: 2200000,
          rate: 0.15,
          baseTax: 30000,
          rangeText: '1,200,001 – 2,200,000',
          rateText: '15%',
          payableText: '30,000 + 15% exceeding 1,200,000',
          formulaDesc: 'Rs 30,000 + 15% of amount exceeding Rs 1,200,000'
        },
        {
          min: 2200000,
          max: 3200000,
          rate: 0.25,
          baseTax: 180000,
          rangeText: '2,200,001 – 3,200,000',
          rateText: '25%',
          payableText: '180,000 + 25% exceeding 2,200,000',
          formulaDesc: 'Rs 180,000 + 25% of amount exceeding Rs 2,200,000'
        },
        {
          min: 3200000,
          max: 4100000,
          rate: 0.30,
          baseTax: 430000,
          rangeText: '3,200,001 – 4,100,000',
          rateText: '30%',
          payableText: '430,000 + 30% exceeding 3,200,000',
          formulaDesc: 'Rs 430,000 + 30% of amount exceeding Rs 3,200,000'
        },
        {
          min: 4100000,
          max: Infinity,
          rate: 0.35,
          baseTax: 700000,
          rangeText: 'Above 4,100,000',
          rateText: '35%',
          payableText: '700,000 + 35% exceeding 4,100,000',
          formulaDesc: 'Rs 700,000 + 35% of amount exceeding Rs 4,100,000'
        }
      ]
    },
    '2023-2024': {
      label: 'Tax Year 2023–2024',
      title: 'Tax Year 2023–2024',
      desc: 'Official FBR tax slab rates for salaried individuals for Tax Year 2023–2024.',
      slabs: [
        {
          min: 0,
          max: 600000,
          rate: 0,
          baseTax: 0,
          rangeText: 'Up to 600,000',
          rateText: '0%',
          payableText: '0% (Tax Free)',
          formulaDesc: 'Tax exempt (0% tax payable)'
        },
        {
          min: 600000,
          max: 1200000,
          rate: 0.025,
          baseTax: 0,
          rangeText: '600,001 – 1,200,000',
          rateText: '2.5%',
          payableText: '2.5% of amount exceeding 600,000',
          formulaDesc: '2.5% of the amount exceeding Rs 600,000'
        },
        {
          min: 1200000,
          max: 2400000,
          rate: 0.125,
          baseTax: 15000,
          rangeText: '1,200,001 – 2,400,000',
          rateText: '12.5%',
          payableText: 'Rs. 15,000 + 12.5% exceeding 1,200,000',
          formulaDesc: 'Rs 15,000 + 12.5% of amount exceeding Rs 1,200,000'
        },
        {
          min: 2400000,
          max: 3600000,
          rate: 0.225,
          baseTax: 165000,
          rangeText: '2,400,001 – 3,600,000',
          rateText: '22.5%',
          payableText: 'Rs. 165,000 + 22.5% exceeding 2,400,000',
          formulaDesc: 'Rs 165,000 + 22.5% of amount exceeding Rs 2,400,000'
        },
        {
          min: 3600000,
          max: 6000000,
          rate: 0.275,
          baseTax: 435000,
          rangeText: '3,600,001 – 6,000,000',
          rateText: '27.5%',
          payableText: 'Rs. 435,000 + 27.5% exceeding 3,600,000',
          formulaDesc: 'Rs 435,000 + 27.5% of amount exceeding Rs 3,600,000'
        },
        {
          min: 6000000,
          max: Infinity,
          rate: 0.35,
          baseTax: 1095000,
          rangeText: 'Above 6,000,000',
          rateText: '35%',
          payableText: 'Rs. 1,095,000 + 35% exceeding 6,000,000',
          formulaDesc: 'Rs 1,095,000 + 35% of amount exceeding Rs 6,000,000'
        }
      ]
    }
  };

  function formatPKR(amount) {
    if (isNaN(amount) || amount === null || amount === undefined) return 'Rs 0';
    return 'Rs ' + Math.round(amount).toLocaleString('en-PK');
  }

  function parseSalary(val) {
    if (!val) return 0;
    const clean = String(val).replace(/[^0-9]/g, '');
    const num = parseInt(clean, 10);
    return isNaN(num) ? 0 : num;
  }

  function calculateTax(annualSalary, yearKey) {
    const config = TAX_DATA[yearKey] || TAX_DATA['2026-2027'];
    const slabs = config.slabs;

    if (annualSalary <= 0) {
      return {
        annualSalary: 0,
        monthlySalary: 0,
        annualTax: 0,
        monthlyTax: 0,
        monthlyTakeHome: 0,
        annualTakeHome: 0,
        effectiveRate: 0,
        matchedSlabIndex: 0,
        matchedSlab: slabs[0],
        config
      };
    }

    let matchedIndex = 0;
    for (let i = 0; i < slabs.length; i++) {
      if (annualSalary > slabs[i].min && annualSalary <= slabs[i].max) {
        matchedIndex = i;
        break;
      }
    }

    const slab = slabs[matchedIndex];
    let annualTax = 0;
    if (slab.rate > 0) {
      const taxablePortion = Math.max(0, annualSalary - slab.min);
      annualTax = slab.baseTax + (taxablePortion * slab.rate);
    }

    annualTax = Math.round(annualTax);
    const monthlySalary = Math.round(annualSalary / 12);
    const monthlyTax = Math.round(annualTax / 12);
    const monthlyTakeHome = Math.max(0, monthlySalary - monthlyTax);
    const annualTakeHome = Math.max(0, annualSalary - annualTax);
    const effectiveRate = annualSalary > 0 ? (annualTax / annualSalary) * 100 : 0;

    return {
      annualSalary,
      monthlySalary,
      annualTax,
      monthlyTax,
      monthlyTakeHome,
      annualTakeHome,
      effectiveRate,
      matchedSlabIndex: matchedIndex,
      matchedSlab: slab,
      config
    };
  }

  function renderSlabsTable(config, activeIndex) {
    if (slabsTableTitle) slabsTableTitle.textContent = config.title;
    if (slabsTableDesc) slabsTableDesc.textContent = config.desc;

    slabsTableBody.innerHTML = '';
    config.slabs.forEach((slab, idx) => {
      const tr = document.createElement('tr');
      const isActive = idx === activeIndex;
      if (isActive) {
        tr.className = 'active-slab-row';
      }

      const tdIncome = document.createElement('td');
      tdIncome.textContent = slab.rangeText;
      if (isActive) {
        const badge = document.createElement('span');
        badge.className = 'slab-active-tag';
        badge.textContent = 'Active Slab';
        tdIncome.appendChild(badge);
      }

      const tdRate = document.createElement('td');
      const rateStrong = document.createElement('strong');
      rateStrong.style.color = '#A31D24';
      rateStrong.textContent = slab.rateText;
      tdRate.appendChild(rateStrong);

      const tdPayable = document.createElement('td');
      tdPayable.textContent = slab.payableText;

      tr.appendChild(tdIncome);
      tr.appendChild(tdRate);
      tr.appendChild(tdPayable);
      slabsTableBody.appendChild(tr);
    });
  }

  function syncPresetPillsActive(currentVal) {
    if (!presetsRow) return;
    const pills = presetsRow.querySelectorAll('.preset-pill');
    pills.forEach((pill) => {
      const pillVal = parseInt(pill.getAttribute('data-amount'), 10);
      pill.classList.toggle('active', pillVal === currentVal);
    });
  }

  function handleSalaryPeriodChange() {
    const isAnnual = salaryPeriodSelect ? salaryPeriodSelect.value === 'annually' : false;
    const currentVal = parseSalary(salaryInput.value);

    if (isAnnual) {
      if (salaryInputLabel) salaryInputLabel.textContent = 'Annual Salary (PKR)';
      salaryInput.placeholder = 'e.g. 1,200,000';
      if (currentVal > 0) {
        const convertedAnnual = currentVal * 12;
        salaryInput.value = convertedAnnual.toLocaleString('en-PK');
      }
      renderPresets('annually');
    } else {
      if (salaryInputLabel) salaryInputLabel.textContent = 'Monthly Salary (PKR)';
      salaryInput.placeholder = 'e.g. 100,000';
      if (currentVal > 0) {
        const convertedMonthly = Math.round(currentVal / 12);
        salaryInput.value = convertedMonthly.toLocaleString('en-PK');
      }
      renderPresets('monthly');
    }
  }

  function updateCalculator() {
    const isAnnual = salaryPeriodSelect ? salaryPeriodSelect.value === 'annually' : false;
    const rawVal = parseSalary(salaryInput.value);
    const annualSalary = isAnnual ? rawVal : rawVal * 12;
    const yearKey = taxYearSelect.value || '2026-2027';

    const result = calculateTax(annualSalary, yearKey);

    // Update result metrics
    if (resMonthlyTakeHome) resMonthlyTakeHome.textContent = formatPKR(result.monthlyTakeHome);
    if (resMonthlyTax) resMonthlyTax.textContent = formatPKR(result.monthlyTax);
    if (resAnnualSalary) resAnnualSalary.textContent = formatPKR(result.annualSalary);
    if (resAnnualTax) resAnnualTax.textContent = formatPKR(result.annualTax);
    if (resAnnualTakeHome) resAnnualTakeHome.textContent = formatPKR(result.annualTakeHome);
    if (resEffectiveRate) resEffectiveRate.textContent = result.effectiveRate.toFixed(2) + '%';
    if (resYearBadge) resYearBadge.textContent = result.config.label;

    // Update active slab banner
    if (slabBannerTitle) {
      slabBannerTitle.textContent = `Active Slab: ${result.matchedSlab.rangeText} (${result.matchedSlab.rateText})`;
    }
    if (slabBannerDesc) {
      slabBannerDesc.textContent = result.matchedSlab.formulaDesc;
    }

    // Sync tabs
    slabTabs.forEach((tab) => {
      const isCurrentYear = tab.getAttribute('data-year') === yearKey;
      tab.classList.toggle('active', isCurrentYear);
      tab.setAttribute('aria-selected', isCurrentYear ? 'true' : 'false');
    });

    // Sync preset pills active state
    syncPresetPillsActive(rawVal);

    // Render table
    renderSlabsTable(result.config, result.matchedSlabIndex);
  }

  // Handle salary period toggle (Monthly vs Annually)
  if (salaryPeriodSelect) {
    salaryPeriodSelect.addEventListener('change', handleSalaryPeriodChange);
  }

  // Handle salary input with formatting
  salaryInput.addEventListener('input', () => {
    const cursorPos = salaryInput.selectionStart;
    const oldLength = salaryInput.value.length;
    const rawVal = parseSalary(salaryInput.value);

    if (rawVal === 0 && salaryInput.value.trim() === '') {
      salaryInput.value = '';
    } else {
      salaryInput.value = rawVal.toLocaleString('en-PK');
    }

    // Maintain cursor position nicely
    const newLength = salaryInput.value.length;
    const newCursor = Math.max(0, cursorPos + (newLength - oldLength));
    try {
      salaryInput.setSelectionRange(newCursor, newCursor);
    } catch (_) {
      // Input types that don't support setSelectionRange
    }

    syncPresetPillsActive(rawVal);
  });

  // Handle tax year dropdown change (updates slabs table view without auto-calculating)
  taxYearSelect.addEventListener('change', () => {
    const yearKey = taxYearSelect.value;
    slabTabs.forEach((tab) => {
      const isSelected = tab.getAttribute('data-year') === yearKey;
      tab.classList.toggle('active', isSelected);
      tab.setAttribute('aria-selected', isSelected ? 'true' : 'false');
    });
    if (TAX_DATA[yearKey]) {
      renderSlabsTable(TAX_DATA[yearKey], -1);
    }
  });

  // Calculate button click: performs calculation on explicit button click
  if (calculateBtn) {
    calculateBtn.addEventListener('click', () => {
      updateCalculator();
      const resultsEl = document.getElementById('calcResults');
      if (resultsEl) {
        resultsEl.classList.remove('calculating');
        void resultsEl.offsetWidth; // trigger reflow
        resultsEl.classList.add('calculating');
        setTimeout(() => resultsEl.classList.remove('calculating'), 500);

        if (window.innerWidth < 768) {
          resultsEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }
    });
  }

  // Handle form Enter submission
  const taxForm = document.getElementById('taxCalculatorForm');
  if (taxForm) {
    taxForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (calculateBtn) calculateBtn.click();
    });
  }

  // Slab table tabs (view specific year's slabs without auto-calculating)
  slabTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const chosenYear = tab.getAttribute('data-year');
      if (chosenYear && TAX_DATA[chosenYear]) {
        taxYearSelect.value = chosenYear;
        slabTabs.forEach((t) => {
          const isSelected = t.getAttribute('data-year') === chosenYear;
          t.classList.toggle('active', isSelected);
          t.setAttribute('aria-selected', isSelected ? 'true' : 'false');
        });
        renderSlabsTable(TAX_DATA[chosenYear], -1);
      }
    });
  });

  // Initial render of presets & calculation on load
  const initialPeriod = salaryPeriodSelect ? salaryPeriodSelect.value : 'monthly';
  renderPresets(initialPeriod);
  updateCalculator();
})();

/* ==========================================================================
   Business & Corporate Income Tax Calculator & Compliance Suite
   Pursuant to FBR Corporate Rates, Section 4C Super Tax, Section 113, 
   Section 113C, and Fourteenth Schedule (SMEs in Manufacturing)
   ========================================================================== */
(function initBusinessTaxCalculator() {
  const bizTaxYear = document.getElementById('bizTaxYear');
  const bizCategory = document.getElementById('bizCategory');
  const smeRegimeGroup = document.getElementById('smeRegimeGroup');
  const btnRegimeNTR = document.getElementById('btnRegimeNTR');
  const btnRegimeFTR = document.getElementById('btnRegimeFTR');
  const bizTaxableProfit = document.getElementById('bizTaxableProfit');
  const bizTurnover = document.getElementById('bizTurnover');
  const bizAccountingProfit = document.getElementById('bizAccountingProfit');
  const btnCalculateBizTax = document.getElementById('btnCalculateBizTax');
  const bizProfitPresetsRow = document.getElementById('bizProfitPresetsRow');

  // Result Elements
  const bizResYearBadge = document.getElementById('bizResYearBadge');
  const bizResCategoryTitle = document.getElementById('bizResCategoryTitle');
  const bizResCategoryTag = document.getElementById('bizResCategoryTag');
  const bizResTotalTax = document.getElementById('bizResTotalTax');
  const bizResTotalTaxSub = document.getElementById('bizResTotalTaxSub');
  const bizResEffectiveRate = document.getElementById('bizResEffectiveRate');
  const bizResRateSub = document.getElementById('bizResRateSub');
  const bizResBaseTax = document.getElementById('bizResBaseTax');
  const bizResBaseTaxSub = document.getElementById('bizResBaseTaxSub');
  const bizResSuperTax = document.getElementById('bizResSuperTax');
  const bizResSuperTaxSub = document.getElementById('bizResSuperTaxSub');
  const bizResPAT = document.getElementById('bizResPAT');
  const bizResACTStatus = document.getElementById('bizResACTStatus');
  const bizResACTSub = document.getElementById('bizResACTSub');

  // Compliance Banner Elements
  const bizComplianceTitle = document.getElementById('bizComplianceTitle');
  const bizComplianceCategoryTag = document.getElementById('bizComplianceCategoryTag');
  const bizComplianceCategorySub = document.getElementById('bizComplianceCategorySub');
  const bizComplianceList = document.getElementById('bizComplianceList');
  const superTaxGrid = document.getElementById('superTaxGrid');

  // Year Matrix Elements
  const bizMatrixTitle = document.getElementById('bizMatrixTitle');
  const bizMatrixDesc = document.getElementById('bizMatrixDesc');
  const bizMatrixTableBody = document.getElementById('bizMatrixTableBody');
  const bizYearTabs = document.querySelectorAll('#bizYearTabs .tab-btn');

  // Entity Classification & Non-Salaried Elements
  const btnEntityIndividual = document.getElementById('btnEntityIndividual');
  const btnEntityCorporate = document.getElementById('btnEntityCorporate');
  const bizIndividualRulesCallout = document.getElementById('bizIndividualRulesCallout');
  const bizIndividualSlabBanner = document.getElementById('bizIndividualSlabBanner');
  const bizResActiveSlabTitle = document.getElementById('bizResActiveSlabTitle');
  const bizResActiveSlabDesc = document.getElementById('bizResActiveSlabDesc');
  const bizResBaseTaxLabel = document.getElementById('bizResBaseTaxLabel');
  const bizResSuperTaxLabel = document.getElementById('bizResSuperTaxLabel');
  const bizResACTLabel = document.getElementById('bizResACTLabel');
  const bizMatrixTableHead = document.getElementById('bizMatrixTableHead');
  const nonSalariedRulesCard = document.getElementById('nonSalariedRulesCard');
  const nonSalariedRulesTitle = document.getElementById('nonSalariedRulesTitle');
  const nonSalariedRulesSub = document.getElementById('nonSalariedRulesSub');
  const nonSalariedRulesGrid = document.getElementById('nonSalariedRulesGrid');
  const superTaxScheduleCard = document.getElementById('superTaxScheduleCard');

  if (!bizTaxYear || !bizCategory || !bizTaxableProfit || !bizMatrixTableBody) {
    return; // Business calculator not present
  }

  let activeSmeRegime = 'ntr'; // 'ntr' | 'ftr'

  // Non-Salaried & AOP Slabs Data (Directly from User Images 1, 2, 3, 4)
  const NON_SALARIED_SLABS = {
    '2026-2027': [
      { min: 0, max: 600000, fixed: 0, rate: 0, rateText: '0%', desc: '0% (Tax-Free / Exempt)', rangeText: 'Up to Rs. 600,000' },
      { min: 600000, max: 1200000, fixed: 0, rate: 0.15, rateText: '15%', desc: '15% of the amount exceeding Rs. 600,000', rangeText: 'Rs. 600,001 to Rs. 1,200,000' },
      { min: 1200000, max: 1600000, fixed: 90000, rate: 0.20, rateText: '20%', desc: 'Rs. 90,000 + 20% of the amount exceeding Rs. 1,200,000', rangeText: 'Rs. 1,200,001 to Rs. 1,600,000' },
      { min: 1600000, max: 3200000, fixed: 170000, rate: 0.30, rateText: '30%', desc: 'Rs. 170,000 + 30% of the amount exceeding Rs. 1,600,000', rangeText: 'Rs. 1,600,001 to Rs. 3,200,000' },
      { min: 3200000, max: 5600000, fixed: 650000, rate: 0.40, rateText: '40%', desc: 'Rs. 650,000 + 40% of the amount exceeding Rs. 3,200,000 (Note: capped at 40% for qualifying professional firm AOPs)', rangeText: 'Rs. 3,200,001 to Rs. 5,600,000' },
      { min: 5600000, max: Infinity, fixed: 1610000, rate: 0.45, rateText: '45%', desc: 'Rs. 1,610,000 + 45% of the amount exceeding Rs. 5,600,000', rangeText: 'Exceeding Rs. 5,600,000' }
    ],
    '2025-2026': [
      { min: 0, max: 600000, fixed: 0, rate: 0, rateText: '0%', desc: '0% (Tax Free)', rangeText: 'Up to Rs. 600,000' },
      { min: 600000, max: 1200000, fixed: 0, rate: 0.15, rateText: '15%', desc: '15% of the amount exceeding PKR 600,000', rangeText: 'Rs. 600,001 to Rs. 1,200,000' },
      { min: 1200000, max: 1600000, fixed: 90000, rate: 0.20, rateText: '20%', desc: 'PKR 90,000 + 20% of the amount exceeding PKR 1,200,000', rangeText: 'Rs. 1,200,001 to Rs. 1,600,000' },
      { min: 1600000, max: 3200000, fixed: 170000, rate: 0.30, rateText: '30%', desc: 'PKR 170,000 + 30% of the amount exceeding PKR 1,600,000', rangeText: 'Rs. 1,600,001 to Rs. 3,200,000' },
      { min: 3200000, max: 5600000, fixed: 650000, rate: 0.40, rateText: '40%', desc: 'PKR 650,000 + 40% of the amount exceeding PKR 3,200,000', rangeText: 'Rs. 3,200,001 to Rs. 5,600,000' },
      { min: 5600000, max: Infinity, fixed: 1610000, rate: 0.45, rateText: '45%', desc: 'PKR 1,610,000 + 45% of the amount exceeding PKR 5,600,000', rangeText: 'Above Rs. 5,600,000' }
    ],
    '2024-2025': [
      { min: 0, max: 600000, fixed: 0, rate: 0, rateText: '0%', desc: '0% (Tax-Free)', rangeText: 'Up to Rs. 600,000' },
      { min: 600000, max: 1200000, fixed: 0, rate: 0.15, rateText: '15%', desc: '15% of the amount exceeding Rs. 600,000', rangeText: 'Rs. 600,001 to Rs. 1,200,000' },
      { min: 1200000, max: 1600000, fixed: 90000, rate: 0.20, rateText: '20%', desc: 'Rs. 90,000 + 20% of the amount exceeding Rs. 1,200,000', rangeText: 'Rs. 1,200,001 to Rs. 1,600,000' },
      { min: 1600000, max: 3200000, fixed: 170000, rate: 0.30, rateText: '30%', desc: 'Rs. 170,000 + 30% of the amount exceeding Rs. 1,600,000', rangeText: 'Rs. 1,600,001 to Rs. 3,200,000' },
      { min: 3200000, max: 5600000, fixed: 650000, rate: 0.40, rateText: '40%', desc: 'Rs. 650,000 + 40% of the amount exceeding Rs. 3,200,000', rangeText: 'Rs. 3,200,001 to Rs. 5,600,000' },
      { min: 5600000, max: Infinity, fixed: 1610000, rate: 0.45, rateText: '45%', desc: 'Rs. 1,610,000 + 45% of the amount exceeding Rs. 5,600,000', rangeText: 'Above Rs. 5,600,000' }
    ],
    '2023-2024': [
      { min: 0, max: 600000, fixed: 0, rate: 0, rateText: '0%', desc: '0% (Tax-free)', rangeText: 'Up to Rs. 600,000' },
      { min: 600000, max: 800000, fixed: 0, rate: 0.075, rateText: '7.5%', desc: '7.5% of the amount exceeding Rs. 600,000', rangeText: 'Rs. 600,001 – Rs. 800,000' },
      { min: 800000, max: 1200000, fixed: 15000, rate: 0.15, rateText: '15%', desc: 'Rs. 15,000 + 15% of the amount exceeding Rs. 800,000', rangeText: 'Rs. 800,001 – Rs. 1,200,000' },
      { min: 1200000, max: 2400000, fixed: 75000, rate: 0.20, rateText: '20%', desc: 'Rs. 75,000 + 20% of the amount exceeding Rs. 1,200,000', rangeText: 'Rs. 1,200,001 – Rs. 2,400,000' },
      { min: 2400000, max: 3000000, fixed: 315000, rate: 0.25, rateText: '25%', desc: 'Rs. 315,000 + 25% of the amount exceeding Rs. 2,400,000', rangeText: 'Rs. 2,400,001 – Rs. 3,000,000' },
      { min: 3000000, max: 4000000, fixed: 465000, rate: 0.30, rateText: '30%', desc: 'Rs. 465,000 + 30% of the amount exceeding Rs. 3,000,000', rangeText: 'Rs. 3,000,001 – Rs. 4,000,000' },
      { min: 4000000, max: Infinity, fixed: 765000, rate: 0.35, rateText: '35%', desc: 'Rs. 765,000 + 35% of the amount exceeding Rs. 4,000,000', rangeText: 'Above Rs. 4,000,000' }
    ]
  };

  // Non-Salaried & AOP Key Rules Data (from User Images 1, 2, 3, 4)
  const NON_SALARIED_RULES_DATA = {
    '2026-2027': {
      title: 'Key Rules & Surcharges for Non-Salaried Income (FY 2026–27)',
      sub: 'Official Finance Act provisions, surcharges, and statutory thresholds (Image 2)',
      rules: [
        {
          title: 'The 75% Rule',
          badge: 'ICMA / FBR',
          desc: 'You are classified under the non-salaried slab structure if <strong>less than 75%</strong> of your total taxable income comes from salary. If your business or side income pushes your salary share to 75% or less, the entire income shifts to the non-salaried table.'
        },
        {
          title: 'High-Income Surcharge (10%)',
          badge: 'Section 4AB',
          desc: 'An additional <strong>10% surcharge</strong> applies to the total tax liability for non-salaried individuals and AOPs whose annual taxable income exceeds <strong>Rs. 10,000,000 (1 Crore)</strong> (unlike salaried individuals where this surcharge was abolished).'
        },
        {
          title: 'Professional Firms (AOP) 40% Cap',
          badge: 'ICMA Intl',
          desc: 'Specified professional firm AOPs (such as legal, medical, or accountancy partnerships legally prohibited from incorporating) have a maximum capped rate of <strong>40%</strong>.'
        },
        {
          title: 'Active Taxpayer List (ATL) Penalties',
          badge: '10th Schedule',
          desc: 'Non-filers face a <strong>100% increase (double withholding rates)</strong> on commercial transactions and penal assessment under Tenth Schedule rules.'
        }
      ]
    },
    '2025-2026': {
      title: 'Key Provisions & Surcharges (Tax Year 2025–26)',
      sub: 'Statutory non-salaried rules from ICMA / PwC Tax Summary (Image 3)',
      rules: [
        {
          title: 'High-Income Surcharge (10%)',
          badge: 'PwC / FBR',
          desc: 'Non-salaried individuals and AOPs with taxable income exceeding <strong>PKR 10 Million</strong> in a year are subject to an additional <strong>10% surcharge</strong> on their calculated income tax.'
        },
        {
          title: 'Professional AOPs 40% Cap',
          badge: 'PwC Pakistan',
          desc: 'For a professional AOP prohibited from incorporating by law or regulatory body rules, a maximum capped tax rate of <strong>40%</strong> applies.'
        },
        {
          title: 'The 75% Salary Threshold',
          badge: 'FBR Rule',
          desc: 'If salary income is 75% or less of overall income, individual is assessed under the non-salaried progressive tax slabs.'
        },
        {
          title: 'Section 113 Minimum Turnover Tax',
          badge: 'Turnover > 100M',
          desc: 'Minimum turnover tax of <strong>1.25%</strong> applies only if individual commercial turnover exceeds <strong>Rs. 100 Million</strong>.'
        }
      ]
    },
    '2024-2025': {
      title: 'Key Provisions & Additional Rules (Tax Year 2024–25)',
      sub: 'FBR Circular & Finance Act 2024 statutory non-salaried rules (Image 4)',
      rules: [
        {
          title: 'Surcharge on High Incomes (Section 4AB)',
          badge: 'PwC + FBR',
          desc: 'Non-salaried individuals and AOPs with taxable income exceeding <strong>Rs. 10 Million (1 Crore)</strong> are subject to a <strong>10% surcharge</strong> on their calculated income tax.'
        },
        {
          title: 'Professional AOPs (40% Cap)',
          badge: 'PwC Pakistan',
          desc: 'For AOPs that are professional firms legally prohibited from incorporating, the maximum tax rate is strictly capped at <strong>40%</strong>.'
        },
        {
          title: 'FBR Wealth Statement & Form 114',
          badge: 'Section 116',
          desc: 'Mandatory annual income tax return (Form 114) and comprehensive wealth statement & wealth reconciliation by <strong>30th September</strong>.'
        },
        {
          title: 'Advance Tax (Section 147)',
          badge: 'Quarterly',
          desc: 'Advance tax payable in 4 quarterly installments based on estimated turnover and taxable profit.'
        }
      ]
    },
    '2023-2024': {
      title: 'Key Rules & Add-ons for TY 2023–24 (TY 2024)',
      sub: 'Non-Salaried & AOP statutory provisions from Karachi Tax Bar / PwC (Image 1)',
      rules: [
        {
          title: 'Surcharge (10% over Rs. 10M)',
          badge: 'PwC',
          desc: 'Non-salaried individuals and AOPs with taxable income exceeding <strong>Rs. 10 Million</strong> are subject to an additional surcharge of <strong>10% on the income tax payable</strong>.'
        },
        {
          title: 'Professional AOPs Cap',
          badge: 'PwC Pakistan',
          desc: 'For professional firms/AOPs legally prohibited from incorporating, a maximum cap of <strong>40%</strong> applies.'
        },
        {
          title: 'Active Taxpayer List (ATL)',
          badge: 'ICMA Intl',
          desc: 'Non-filers face significantly higher withholding and penal rates (often <strong>100% or more increase</strong> on standard withholding sections).'
        },
        {
          title: 'Wealth Statement Reconciliation',
          badge: 'FBR Statutory',
          desc: 'Filing of annual return by 30th September along with full wealth statement reconciliation under Section 116.'
        }
      ]
    }
  };

  const BUSINESS_TAX_DATA = {
    '2026-2027': {
      label: 'Tax Year 2026–2027',
      desc: 'For Tax Year 2026–27 in Pakistan, commercial businesses are taxed based on entity structure: Individual businesses & AOPs follow progressive slabs, while companies pay flat corporate rates. Super Tax (Section 4C) applies to high earners.',
      categories: [
        {
          id: 'individual',
          name: 'Commercial Business / Sole Proprietor',
          criteria: 'Sole Proprietorships & Commercial AOPs (0% – 45%)',
          rate: 0,
          rateText: 'Progressive Slabs (0% – 45%)',
          superTaxText: '10% Surcharge (>10M) + Section 4C (>150M)',
          actMinTaxText: 'ACT Exempt; 1.25% Min Tax (Turnover > 100M)',
          compliancePoints: [
            'FBR Annual Return (Form 114): Due 30th September (or notified FBR date)',
            'Wealth Statement (Section 116): Mandatory wealth statement & reconciliation',
            'Prescribed Books of Account: Income Tax Rules Rule 29 compliance',
            'Advance Tax (Section 147): 4 quarterly installments where applicable'
          ]
        },
        {
          id: 'prof_aop',
          name: 'Professional Firm AOP',
          criteria: 'Professional Partnerships legally prohibited from incorporating (Capped at 40%)',
          rate: 0,
          rateText: 'Progressive Slabs (0% – 40% Capped)',
          superTaxText: '10% Surcharge (>10M) + Section 4C (>150M)',
          actMinTaxText: 'ACT Exempt; 1.25% Min Tax (Turnover > 100M)',
          compliancePoints: [
            'FBR Annual Return (Form 114): Due 30th September',
            'Professional Firm Statutory Disclosures & Partner Accounts',
            'Wealth Statement (Section 116): Partner-level reconciliation'
          ]
        },
        {
          id: 'general',
          name: 'General Corporate Company',
          criteria: 'Public & Private Limited Companies (Standard)',
          rate: 0.29,
          rateText: '29%',
          superTaxText: '8% on income exceeding Rs. 500M (non-banking); 10% on banking/fertilizer',
          actMinTaxText: '17% ACT (Sec 113C) & 1.25% Min Tax (Sec 113)',
          compliancePoints: [
            'FBR Annual Return (Form 114): Due 31st December (Special Tax Year: 30th Sept)',
            'Advance Tax (Sec 147): 4 quarterly installments (25 Sep, 25 Dec, 25 Mar, 15 Jun)',
            'Sales Tax Return: Monthly return by 15th (annexures) & 18th (payment)',
            'SECP Statutory Filings: Annual Return (Form A/29) within 30 days of AGM + Audited Accounts',
            'Withholding Tax Statements: Monthly / Quarterly statements under Section 165'
          ]
        },
        {
          id: 'small',
          name: 'Small Company',
          criteria: 'Turnover ≤ Rs. 250M, Capital ≤ Rs. 50M, Employees ≤ 250',
          rate: 0.20,
          rateText: '20%',
          superTaxText: 'Progressive Sec 4C brackets (0% up to 10% on income > 150M)',
          actMinTaxText: '17% ACT (Sec 113C) & 1.25% Min Tax (Sec 113)',
          compliancePoints: [
            'FBR Annual Corporate Return: Due 31st December',
            'Advance Tax (Sec 147): 4 quarterly installments based on turnover/profit estimates',
            'SECP Compliance: Audited accounts with simplified financial statement disclosures',
            'Threshold Compliance: Turnover must not exceed Rs. 250M to retain 20% concessional status'
          ]
        },
        {
          id: 'banking',
          name: 'Banking Company',
          criteria: 'Scheduled Commercial Banks & Financial Institutions',
          rate: 0.39,
          rateText: '39%',
          superTaxText: '10% flat Super Tax (Section 4C) on banking sector',
          actMinTaxText: 'Subject to Seventh Schedule assessment rules',
          compliancePoints: [
            'Seventh Schedule Assessment: Computed on taxable banking income pursuant to special rules',
            'Advance Tax (Sec 147): Payable in 12 monthly installments by 15th of each month',
            'Regulatory Filings: State Bank of Pakistan (SBP) Prudential Regulation filings & quarterly disclosures',
            'Annual Return: Detailed statutory return by 31st December with audited financials'
          ]
        },
        {
          id: 'sme_cat1',
          name: 'SME Manufacturing — Category 1',
          criteria: 'Annual Turnover up to PKR 100 Million (Fourteenth Schedule)',
          rate: 0.075,
          rateText: '7.5% (NTR) / 0.25% (FTR)',
          superTaxText: 'Exempt / Below Section 4C threshold',
          actMinTaxText: 'Exempt from Section 113 Minimum Tax if FTR is opted',
          compliancePoints: [
            'SMEDA & FBR Registration: Mandatory registration under Fourteenth Schedule for manufacturing SMEs',
            'Regime Selection: Normal Tax Regime (7.5% profit) OR Final Tax Regime (0.25% turnover) elected at filing',
            'Simplified Return: Due 31st December via IRIS dedicated SME portal',
            'Final Tax Exemption: If FTR is opted, no detailed expense audit under Section 177 applies'
          ]
        },
        {
          id: 'sme_cat2',
          name: 'SME Manufacturing — Category 2',
          criteria: 'Annual Turnover between PKR 100 Million and PKR 250 Million',
          rate: 0.15,
          rateText: '15% (NTR)',
          superTaxText: 'Exempt / Below Section 4C threshold',
          actMinTaxText: '1.25% Minimum Turnover Tax applies under standard rules',
          compliancePoints: [
            'Fourteenth Schedule Books: Prescribed books of accounts to be maintained by manufacturer',
            'Tax Rate: 15% flat on net taxable profits under Normal Tax Regime',
            'Annual Return: Due 31st December along with sales reconciliation',
            'Withholding Obligations: Prescribed withholding agent responsibilities under Section 153'
          ]
        },
        {
          id: 'modaraba',
          name: 'Modaraba',
          criteria: 'Registered Modaraba floatations in Pakistan',
          rate: 0.25,
          rateText: '25%',
          superTaxText: 'Progressive Section 4C brackets (0% - 10%)',
          actMinTaxText: '17% ACT (Sec 113C) & 1.25% Min Tax (Sec 113)',
          compliancePoints: [
            'Modaraba Ordinance 1980: Compliance with Religious Board certification and statutory rules',
            'Distribution Compliance: 90% of profits distributed to certificate holders for statutory exemptions',
            'Annual Return: Due 31st December (or 30th Sept for calendar accounting period)',
            'Quarterly Advance Tax: Payable in 4 equal quarterly installments'
          ]
        }
      ]
    },
    '2025-2026': {
      label: 'Tax Year 2025–2026',
      desc: 'Tax Year 2025–2026 rates distinguish between Individual / Sole Proprietor businesses (progressive individual slabs) and Corporate entities (flat corporate rates + ACT / Minimum Tax + Super Tax Section 4C).',
      categories: [
        {
          id: 'individual',
          name: 'Commercial Business / Sole Proprietor',
          criteria: 'Commercial Sole Proprietorships & Non-Salaried Individuals (0% – 45%)',
          rate: 0,
          rateText: 'Progressive Slabs (0% – 45%)',
          superTaxText: '10% Surcharge (>10M) + Section 4C (>150M)',
          actMinTaxText: 'ACT Exempt; 1.25% Min Tax (Turnover > 100M)',
          compliancePoints: [
            'FBR Annual Return (Form 114): Due 30th September (or notified date)',
            'Wealth Statement (Section 116): Mandatory annual wealth reconciliation',
            'Books of Account: Rule 29 prescribed accounting records',
            'Advance Tax (Section 147): 4 quarterly installments where applicable'
          ]
        },
        {
          id: 'prof_aop',
          name: 'Professional Firm AOP',
          criteria: 'Professional Partnerships prohibited from incorporating (Capped at 40%)',
          rate: 0,
          rateText: 'Progressive Slabs (0% – 40% Capped)',
          superTaxText: '10% Surcharge (>10M) + Section 4C (>150M)',
          actMinTaxText: 'ACT Exempt; 1.25% Min Tax (Turnover > 100M)',
          compliancePoints: [
            'Annual Return by 30th September',
            'Professional Body & FBR statutory filings',
            'Section 116 Wealth Reconciliation'
          ]
        },
        {
          id: 'general',
          name: 'General Corporate Company',
          criteria: 'Public & Private Limited Corporate Entities',
          rate: 0.29,
          rateText: '29%',
          superTaxText: 'Progressive 0% to 10% Super Tax (Section 4C) exceeding Rs. 150M',
          actMinTaxText: '17% ACT (Sec 113C) & 1.25% Minimum Turnover Tax',
          compliancePoints: [
            'FBR Annual Return: Due 31st December (Special Year: 30th Sept)',
            'Advance Tax (Sec 147): 4 quarterly installments (25 Sep, 25 Dec, 25 Mar, 15 Jun)',
            'SECP Statutory Return within 30 days of AGM',
            'Monthly withholding and sales tax filings'
          ]
        },
        {
          id: 'banking',
          name: 'Banking Companies',
          criteria: 'Commercial Scheduled Banks (Seventh Schedule)',
          rate: 0.39,
          rateText: '39%',
          superTaxText: '10% Flat Super Tax (Section 4C)',
          actMinTaxText: 'Seventh Schedule assessment',
          compliancePoints: [
            'Seventh Schedule tax assessment',
            'Advance tax in 12 monthly installments',
            'SBP and SECP prudential reporting'
          ]
        },
        {
          id: 'small',
          name: 'Small Companies',
          criteria: 'Turnover ≤ Rs. 250M, Capital ≤ Rs. 50M, Employees ≤ 250',
          rate: 0.20,
          rateText: '20%',
          superTaxText: 'Progressive Section 4C (0% up to 10% on income > 150M)',
          actMinTaxText: '17% ACT & 1.25% Min Tax',
          compliancePoints: [
            'Annual Return by 31st December',
            'Quarterly Advance Tax under Section 147',
            'SECP simplified disclosure filing'
          ]
        },
        {
          id: 'sme_cat1',
          name: 'SMEs in Manufacturing — Category 1',
          criteria: 'Turnover up to PKR 100 Million (Fourteenth Schedule)',
          rate: 0.075,
          rateText: '7.5% (NTR) / 0.25% (FTR)',
          superTaxText: 'Exempt / Below Section 4C threshold',
          actMinTaxText: 'Exempt from Section 113 under FTR',
          compliancePoints: [
            'SMEDA & FBR registration',
            'Election between 7.5% NTR or 0.25% FTR on gross turnover',
            'Annual return by 31st December'
          ]
        },
        {
          id: 'sme_cat2',
          name: 'SMEs in Manufacturing — Category 2',
          criteria: 'Turnover between PKR 100 Million and PKR 250 Million',
          rate: 0.15,
          rateText: '15% (NTR)',
          superTaxText: 'Exempt / Below Section 4C threshold',
          actMinTaxText: '1.25% Minimum Turnover Tax applies',
          compliancePoints: [
            'Fourteenth Schedule books of account',
            '15% flat rate on taxable profit',
            'Annual corporate return by 31st December'
          ]
        },
        {
          id: 'modaraba',
          name: 'Modaraba',
          criteria: 'Modarabas registered under Modaraba Ordinance 1980',
          rate: 0.25,
          rateText: '25%',
          superTaxText: 'Progressive Section 4C (0% - 10%)',
          actMinTaxText: '17% ACT & 1.25% Min Tax',
          compliancePoints: [
            'Modaraba Ordinance 1980 statutory adherence',
            '90% dividend distribution rule for exemptions',
            'Annual Return by 31st December'
          ]
        }
      ]
    },
    '2024-2025': {
      label: 'Tax Year 2024–2025',
      desc: 'Tax Year 2024–2025 rates for Individual business owners / AOPs (progressive individual slabs) and Corporate entities (flat corporate rates + ACT / Minimum Tax + Super Tax Section 4C).',
      categories: [
        {
          id: 'individual',
          name: 'Commercial Business / Sole Proprietor',
          criteria: 'Commercial Businesses & Sole Proprietors (0% – 45%)',
          rate: 0,
          rateText: 'Progressive Slabs (0% – 45%)',
          superTaxText: '10% Surcharge (Sec 4AB > 10M) + Section 4C (>150M)',
          actMinTaxText: 'ACT Exempt; 1.25% Min Tax (Turnover > 100M)',
          compliancePoints: [
            'FBR Annual Return (Form 114): Due 30th September',
            'Wealth Statement (Section 116): Mandatory wealth statement filing',
            'Advance Tax: Quarterly installments under Section 147 where applicable'
          ]
        },
        {
          id: 'prof_aop',
          name: 'Professional Firm AOP',
          criteria: 'Professional Partnerships legally prohibited from incorporating (Capped at 40%)',
          rate: 0,
          rateText: 'Progressive Slabs (0% – 40% Capped)',
          superTaxText: '10% Surcharge (Sec 4AB > 10M) + Section 4C (>150M)',
          actMinTaxText: 'ACT Exempt; 1.25% Min Tax (Turnover > 100M)',
          compliancePoints: [
            'FBR Annual Return by 30th September',
            'Partner profit allocation & Section 116 reconciliation',
            'Advance Tax under Section 147'
          ]
        },
        {
          id: 'general',
          name: 'General Corporate Company',
          criteria: 'Public & Private Limited Entities',
          rate: 0.29,
          rateText: '29%',
          superTaxText: 'Progressive 0% to 10% Super Tax (Section 4C) exceeding Rs. 150M',
          actMinTaxText: '17% ACT & 1.25% Min Turnover Tax',
          compliancePoints: [
            'FBR Annual Return: Due 31st December (Special Year: 30th Sept)',
            'Advance Tax (Sec 147): 4 quarterly installments',
            'SECP Annual Return (Form A/29) within 30 days of AGM',
            'Monthly sales tax and withholding statements'
          ]
        },
        {
          id: 'small',
          name: 'Small Companies',
          criteria: 'Turnover ≤ Rs. 250M, Capital ≤ Rs. 50M, Employees ≤ 250',
          rate: 0.20,
          rateText: '20%',
          superTaxText: 'Progressive Section 4C (0% up to 10% > 150M)',
          actMinTaxText: '17% ACT & 1.25% Min Tax',
          compliancePoints: [
            'Annual Return by 31st December',
            'Quarterly Advance Tax under Section 147',
            'SECP simplified disclosure filing'
          ]
        },
        {
          id: 'banking',
          name: 'Banking Companies',
          criteria: 'Scheduled Banks',
          rate: 0.39,
          rateText: '39%',
          superTaxText: '10% flat Super Tax',
          actMinTaxText: 'Seventh Schedule Rules',
          compliancePoints: [
            'Seventh Schedule tax assessment',
            'Advance tax in 12 monthly installments',
            'SBP and SECP prudential reporting'
          ]
        },
        {
          id: 'sme_cat1',
          name: 'SMEs in Manufacturing — Category 1',
          criteria: 'Turnover up to PKR 100 Million (Fourteenth Schedule)',
          rate: 0.075,
          rateText: '7.5% (NTR) / 0.25% (FTR)',
          superTaxText: 'Exempt / Below threshold',
          actMinTaxText: 'Exempt from Section 113 under FTR',
          compliancePoints: [
            'SMEDA & FBR registration',
            'Election between 7.5% NTR or 0.25% FTR on gross turnover',
            'Annual return by 31st December'
          ]
        },
        {
          id: 'sme_cat2',
          name: 'SMEs in Manufacturing — Category 2',
          criteria: 'Turnover PKR 100M to PKR 250M',
          rate: 0.15,
          rateText: '15% (NTR)',
          superTaxText: 'Exempt / Below threshold',
          actMinTaxText: '1.25% Minimum Turnover Tax applies',
          compliancePoints: [
            'Fourteenth Schedule books of account',
            '15% flat rate on taxable profit',
            'Annual corporate return by 31st December'
          ]
        },
        {
          id: 'modaraba',
          name: 'Modaraba',
          criteria: 'Modarabas registered under Modaraba Ordinance 1980',
          rate: 0.25,
          rateText: '25%',
          superTaxText: 'Progressive Section 4C (0% - 10%)',
          actMinTaxText: '17% ACT & 1.25% Min Tax',
          compliancePoints: [
            'Modaraba Ordinance 1980 compliance',
            '90% profit distribution condition',
            'Annual Return by 31st December'
          ]
        }
      ]
    },
    '2023-2024': {
      label: 'Tax Year 2024 (TY 2023–2024)',
      desc: 'Tax Year 2024 (TY 2023–2024) rates for Individual business owners / AOPs (progressive individual slabs) and Corporate entities pursuant to Karachi Tax Bar / PwC / FBR Finance Act provisions.',
      categories: [
        {
          id: 'individual',
          name: 'Commercial Business / Sole Proprietor',
          criteria: 'Commercial Sole Proprietorships & Partnership Firms (0% – 35%)',
          rate: 0,
          rateText: 'Progressive Slabs (0% – 35%)',
          superTaxText: '10% Surcharge (>10M) + Section 4C (>150M)',
          actMinTaxText: 'ACT Exempt; 1.25% Min Tax (Turnover > 100M)',
          compliancePoints: [
            'FBR Annual Return (Form 114): Due 30th September',
            'Wealth Statement (Section 116): Wealth reconciliation filing',
            'Advance Tax: Quarterly installments under Section 147 where applicable'
          ]
        },
        {
          id: 'prof_aop',
          name: 'Professional Firm AOP',
          criteria: 'Professional Partnerships legally prohibited from incorporating (Capped at 40%)',
          rate: 0,
          rateText: 'Progressive Slabs (0% – 35%)',
          superTaxText: '10% Surcharge (>10M) + Section 4C (>150M)',
          actMinTaxText: 'ACT Exempt; 1.25% Min Tax (Turnover > 100M)',
          compliancePoints: [
            'FBR Annual Return by 30th September',
            'Wealth Statement reconciliation under Section 116'
          ]
        },
        {
          id: 'general',
          name: 'General Corporate Company',
          criteria: 'Standard Corporate Companies',
          rate: 0.29,
          rateText: '29%',
          superTaxText: 'Progressive Super Tax (Section 4C) ranging from 0% to 10% for income > 150M',
          actMinTaxText: '17% ACT (Sec 113C) & 1.25% Min Tax (Sec 113)',
          compliancePoints: [
            'FBR Annual Return: Due 31st December (Special Year: 30th Sept)',
            'Advance Tax (Sec 147): 4 quarterly installments',
            'SECP Annual Return (Form A/29) within 30 days of AGM',
            'Sales Tax and Withholding Tax reporting'
          ]
        },
        {
          id: 'banking',
          name: 'Banking Company',
          criteria: 'Scheduled Commercial Banks (Image 3)',
          rate: 0.39,
          rateText: '39%',
          superTaxText: '10% flat Super Tax (Section 4C)',
          actMinTaxText: 'Seventh Schedule Rules',
          compliancePoints: [
            'Seventh Schedule tax assessment',
            'Advance tax in 12 monthly installments',
            'SBP and SECP prudential reporting'
          ]
        },
        {
          id: 'small',
          name: 'Small Company',
          criteria: 'Turnover ≤ Rs. 250M, Capital ≤ Rs. 50M, Employees ≤ 250',
          rate: 0.20,
          rateText: '20%',
          superTaxText: 'Progressive Section 4C (0% to 10%)',
          actMinTaxText: '17% ACT & 1.25% Min Tax',
          compliancePoints: [
            'Annual Return by 31st December',
            'Quarterly Advance Tax under Section 147',
            'SECP simplified disclosure filing'
          ]
        },
        {
          id: 'modaraba',
          name: 'Modaraba',
          criteria: 'Modaraba Floatations (Image 3: 25%)',
          rate: 0.25,
          rateText: '25%',
          superTaxText: 'Progressive Section 4C (0% to 10%)',
          actMinTaxText: '17% ACT (Sec 113C)',
          compliancePoints: [
            'Modaraba Ordinance 1980 adherence',
            'Religious Board compliance certification',
            'Annual Return by 31st December / 30th Sept'
          ]
        },
        {
          id: 'sme_cat1',
          name: 'SMEs in Manufacturing — Category 1',
          criteria: 'Turnover up to Rs. 100 Million (Image 3)',
          rate: 0.075,
          rateText: '7.5% (NTR) / 0.25% (FTR)',
          superTaxText: 'Exempt / Below threshold',
          actMinTaxText: 'Exempt from Section 113 under FTR',
          compliancePoints: [
            'SMEDA & FBR portal enrollment',
            'Option to elect 7.5% on profit or 0.25% on gross turnover under Final Tax Regime',
            'Annual return by 31st December'
          ]
        },
        {
          id: 'sme_cat2',
          name: 'SMEs in Manufacturing — Category 2',
          criteria: 'Turnover between Rs. 100 Million and Rs. 250 Million (Image 3)',
          rate: 0.15,
          rateText: '15% (NTR)',
          superTaxText: 'Exempt / Below threshold',
          actMinTaxText: '1.25% Minimum Turnover Tax applies',
          compliancePoints: [
            'Fourteenth Schedule books of account',
            '15% flat rate on taxable profit',
            'Annual corporate return by 31st December'
          ]
        }
      ]
    }
  };

  function parseAmount(val) {
    if (!val) return 0;
    const clean = String(val).replace(/[^0-9]/g, '');
    const num = parseInt(clean, 10);
    return isNaN(num) ? 0 : num;
  }

  function formatPKR(amount) {
    if (isNaN(amount) || amount === null || amount === undefined) return 'Rs 0';
    return 'Rs ' + Math.round(amount).toLocaleString('en-PK');
  }

  function calculateSuperTax(taxableIncome, categoryId, yearKey) {
    if (categoryId === 'banking') {
      return {
        rate: 0.10,
        rateText: '10%',
        tax: Math.round(taxableIncome * 0.10),
        bracketText: 'Banking Company Flat 10% Super Tax',
        bracketIndex: 7
      };
    }

    if (taxableIncome <= 150000000) {
      return {
        rate: 0,
        rateText: '0%',
        tax: 0,
        bracketText: '0% (Taxable Profit ≤ 150M: Nil)',
        bracketIndex: 0
      };
    } else if (taxableIncome <= 200000000) {
      return {
        rate: 0.01,
        rateText: '1%',
        tax: Math.round(taxableIncome * 0.01),
        bracketText: 'PKR 150M – PKR 200M (1%)',
        bracketIndex: 1
      };
    } else if (taxableIncome <= 250000000) {
      return {
        rate: 0.02,
        rateText: '2%',
        tax: Math.round(taxableIncome * 0.02),
        bracketText: 'PKR 200M – PKR 250M (2%)',
        bracketIndex: 2
      };
    } else if (taxableIncome <= 300000000) {
      return {
        rate: 0.03,
        rateText: '3%',
        tax: Math.round(taxableIncome * 0.03),
        bracketText: 'PKR 250M – PKR 300M (3%)',
        bracketIndex: 3
      };
    } else if (taxableIncome <= 350000000) {
      return {
        rate: 0.04,
        rateText: '4%',
        tax: Math.round(taxableIncome * 0.04),
        bracketText: 'PKR 300M – PKR 350M (4%)',
        bracketIndex: 4
      };
    } else if (taxableIncome <= 400000000) {
      return {
        rate: 0.06,
        rateText: '6%',
        tax: Math.round(taxableIncome * 0.06),
        bracketText: 'PKR 350M – PKR 400M (6%)',
        bracketIndex: 5
      };
    } else if (taxableIncome <= 500000000) {
      return {
        rate: 0.08,
        rateText: '8%',
        tax: Math.round(taxableIncome * 0.08),
        bracketText: 'PKR 400M – PKR 500M (8%)',
        bracketIndex: 6
      };
    } else {
      const rate = (yearKey === '2026-2027') ? 0.08 : 0.10;
      const rateText = (yearKey === '2026-2027') ? '8%' : '10%';
      return {
        rate,
        rateText,
        tax: Math.round(taxableIncome * rate),
        bracketText: `Income > 500M (${rateText})`,
        bracketIndex: 7
      };
    }
  }

  // Non-Salaried & AOP Progressive Slab Calculator (Exact logic from User Images 1, 2, 3, 4)
  function calculateIndividualTax(profit, yearKey, isProfAop) {
    if (profit <= 0) {
      return {
        baseTax: 0,
        surchargeAmount: 0,
        totalTax: 0,
        rateText: '0%',
        formula: '0% (Tax-Free / Exempt up to Rs. 600,000)',
        rangeText: 'Up to Rs. 600,000',
        activeSlabIndex: 0,
        surchargeText: 'Profit ≤ 10M (No Surcharge)'
      };
    }

    let baseTax = 0;
    let rateText = '0%';
    let formula = '';
    let rangeText = '';
    let activeSlabIndex = 0;

    if (yearKey === '2023-2024') {
      // TY 2023-24 (TY 2024 from Image 1)
      if (profit <= 600000) {
        baseTax = 0;
        rateText = '0%';
        formula = '0% (Tax-free threshold up to Rs. 600,000)';
        rangeText = 'Up to Rs. 600,000';
        activeSlabIndex = 0;
      } else if (profit <= 800000) {
        const taxable = profit - 600000;
        baseTax = Math.round(taxable * 0.075);
        rateText = '7.5%';
        formula = `7.5% of amount exceeding Rs. 600,000 (${formatPKR(taxable)} × 7.5%)`;
        rangeText = 'Rs. 600,001 – Rs. 800,000';
        activeSlabIndex = 1;
      } else if (profit <= 1200000) {
        const taxable = profit - 800000;
        baseTax = 15000 + Math.round(taxable * 0.15);
        rateText = '15%';
        formula = `Rs. 15,000 + 15% of amount exceeding Rs. 800,000 (${formatPKR(taxable)})`;
        rangeText = 'Rs. 800,001 – Rs. 1,200,000';
        activeSlabIndex = 2;
      } else if (profit <= 2400000) {
        const taxable = profit - 1200000;
        baseTax = 75000 + Math.round(taxable * 0.20);
        rateText = '20%';
        formula = `Rs. 75,000 + 20% of amount exceeding Rs. 1,200,000 (${formatPKR(taxable)})`;
        rangeText = 'Rs. 1,200,001 – Rs. 2,400,000';
        activeSlabIndex = 3;
      } else if (profit <= 3000000) {
        const taxable = profit - 2400000;
        baseTax = 315000 + Math.round(taxable * 0.25);
        rateText = '25%';
        formula = `Rs. 315,000 + 25% of amount exceeding Rs. 2,400,000 (${formatPKR(taxable)})`;
        rangeText = 'Rs. 2,400,001 – Rs. 3,000,000';
        activeSlabIndex = 4;
      } else if (profit <= 4000000) {
        const taxable = profit - 3000000;
        baseTax = 465000 + Math.round(taxable * 0.30);
        rateText = '30%';
        formula = `Rs. 465,000 + 30% of amount exceeding Rs. 3,000,000 (${formatPKR(taxable)})`;
        rangeText = 'Rs. 3,000,001 – Rs. 4,000,000';
        activeSlabIndex = 5;
      } else {
        const taxable = profit - 4000000;
        baseTax = 765000 + Math.round(taxable * 0.35);
        rateText = '35%';
        formula = `Rs. 765,000 + 35% of amount exceeding Rs. 4,000,000 (${formatPKR(taxable)})`;
        rangeText = 'Above Rs. 4,000,000';
        activeSlabIndex = 6;
      }
    } else {
      // TY 2024-25, 2025-26, 2026-27 (Images 2, 3, 4)
      if (profit <= 600000) {
        baseTax = 0;
        rateText = '0%';
        formula = '0% (Tax-Free / Exempt up to Rs. 600,000)';
        rangeText = 'Up to Rs. 600,000';
        activeSlabIndex = 0;
      } else if (profit <= 1200000) {
        const taxable = profit - 600000;
        baseTax = Math.round(taxable * 0.15);
        rateText = '15%';
        formula = `15% of amount exceeding Rs. 600,000 (${formatPKR(taxable)} × 15%)`;
        rangeText = 'Rs. 600,001 to Rs. 1,200,000';
        activeSlabIndex = 1;
      } else if (profit <= 1600000) {
        const taxable = profit - 1200000;
        baseTax = 90000 + Math.round(taxable * 0.20);
        rateText = '20%';
        formula = `Rs. 90,000 + 20% of amount exceeding Rs. 1,200,000 (${formatPKR(taxable)})`;
        rangeText = 'Rs. 1,200,001 to Rs. 1,600,000';
        activeSlabIndex = 2;
      } else if (profit <= 3200000) {
        const taxable = profit - 1600000;
        baseTax = 170000 + Math.round(taxable * 0.30);
        rateText = '30%';
        formula = `Rs. 170,000 + 30% of amount exceeding Rs. 1,600,000 (${formatPKR(taxable)})`;
        rangeText = 'Rs. 1,600,001 to Rs. 3,200,000';
        activeSlabIndex = 3;
      } else if (profit <= 5600000) {
        const taxable = profit - 3200000;
        baseTax = 650000 + Math.round(taxable * 0.40);
        rateText = isProfAop ? '40% (Capped)' : '40%';
        formula = `Rs. 650,000 + 40% of amount exceeding Rs. 3,200,000 (${formatPKR(taxable)})`;
        rangeText = 'Rs. 3,200,001 to Rs. 5,600,000';
        activeSlabIndex = 4;
      } else {
        const taxable = profit - 5600000;
        if (isProfAop) {
          // Professional firm AOP legally prohibited from incorporating: capped at 40%
          baseTax = 1610000 + Math.round(taxable * 0.40);
          rateText = '40% (Capped)';
          formula = `Rs. 1,610,000 + 40% (Professional AOP Cap) of amount exceeding Rs. 5,600,000 (${formatPKR(taxable)})`;
          rangeText = 'Exceeding Rs. 5,600,000 (Capped at 40%)';
        } else {
          baseTax = 1610000 + Math.round(taxable * 0.45);
          rateText = '45%';
          formula = `Rs. 1,610,000 + 45% of amount exceeding Rs. 5,600,000 (${formatPKR(taxable)})`;
          rangeText = 'Exceeding Rs. 5,600,000';
        }
        activeSlabIndex = 5;
      }
    }

    // High-Income Surcharge (10% under Section 4AB for profit > Rs. 10 Million)
    let surchargeAmount = 0;
    let surchargeText = 'Profit ≤ 10M (No Surcharge)';
    if (profit > 10000000) {
      surchargeAmount = Math.round(baseTax * 0.10);
      surchargeText = `10% Surcharge on Calculated Tax under Section 4AB (${formatPKR(surchargeAmount)})`;
    }

    const totalTax = baseTax + surchargeAmount;

    return {
      baseTax,
      surchargeAmount,
      totalTax,
      rateText,
      formula,
      rangeText,
      activeSlabIndex,
      surchargeText
    };
  }

  function updateBusinessCalculator() {
    const yearKey = bizTaxYear.value || '2026-2027';
    const catId = bizCategory.value || 'individual';
    const profit = parseAmount(bizTaxableProfit.value);
    const turnover = parseAmount(bizTurnover.value);
    const acctProfitInput = parseAmount(bizAccountingProfit.value);
    const acctProfit = acctProfitInput > 0 ? acctProfitInput : profit;

    const isIndividual = (catId === 'individual' || catId === 'prof_aop');
    const isProfAop = (catId === 'prof_aop');

    // Sync Entity Classification radio pills
    if (btnEntityIndividual && btnEntityCorporate) {
      btnEntityIndividual.classList.toggle('active', isIndividual);
      btnEntityIndividual.setAttribute('aria-checked', isIndividual ? 'true' : 'false');
      btnEntityCorporate.classList.toggle('active', !isIndividual);
      btnEntityCorporate.setAttribute('aria-checked', !isIndividual ? 'true' : 'false');
    }

    // Show/hide Non-Salaried Key Rules Callout inside form
    if (bizIndividualRulesCallout) {
      bizIndividualRulesCallout.style.display = isIndividual ? 'block' : 'none';
    }

    const yearData = BUSINESS_TAX_DATA[yearKey] || BUSINESS_TAX_DATA['2026-2027'];
    const activeCat = yearData.categories.find(c => c.id === catId) || yearData.categories[0];

    // Show/hide SME regime switcher
    if (catId === 'sme_cat1') {
      smeRegimeGroup.style.display = 'block';
    } else {
      smeRegimeGroup.style.display = 'none';
    }

    // Base Tax & Surcharge Calculation
    let baseTax = 0;
    let surchargeAmount = 0;
    let baseTaxRateText = activeCat.rateText;
    let baseTaxSub = `${activeCat.rateText} Corporate Rate`;
    let indTaxInfo = null;

    if (isIndividual) {
      indTaxInfo = calculateIndividualTax(profit, yearKey, isProfAop);
      baseTax = indTaxInfo.baseTax;
      surchargeAmount = indTaxInfo.surchargeAmount;
      baseTaxRateText = indTaxInfo.rateText;
      baseTaxSub = isProfAop 
        ? 'Non-Salaried Progressive Slabs (40% Cap)'
        : 'Non-Salaried Progressive Slabs (0% – 45%)';

      if (bizIndividualSlabBanner) {
        bizIndividualSlabBanner.style.display = 'flex';
      }
      if (bizResActiveSlabTitle) {
        bizResActiveSlabTitle.textContent = `Active Non-Salaried Slab: ${indTaxInfo.rangeText} (${indTaxInfo.rateText})`;
      }
      if (bizResActiveSlabDesc) {
        bizResActiveSlabDesc.textContent = indTaxInfo.formula;
      }
      if (bizResBaseTaxLabel) {
        bizResBaseTaxLabel.textContent = 'Non-Salaried Slab Tax';
      }
      if (bizResSuperTaxLabel) {
        bizResSuperTaxLabel.textContent = '10% Surcharge (Sec 4AB)';
      }
      if (bizResACTLabel) {
        bizResACTLabel.textContent = 'Min Tax / ACT Status';
      }
    } else {
      if (bizIndividualSlabBanner) {
        bizIndividualSlabBanner.style.display = 'none';
      }
      if (bizResBaseTaxLabel) {
        bizResBaseTaxLabel.textContent = 'Base Corporate Tax';
      }
      if (bizResSuperTaxLabel) {
        bizResSuperTaxLabel.textContent = 'Super Tax (Section 4C)';
      }
      if (bizResACTLabel) {
        bizResACTLabel.textContent = 'ACT / Min Tax Status';
      }

      if (catId === 'sme_cat1') {
        if (activeSmeRegime === 'ftr') {
          baseTax = Math.round(turnover * 0.0025);
          baseTaxRateText = '0.25% (FTR)';
          baseTaxSub = '0.25% Final Tax Regime on Gross Turnover';
        } else {
          baseTax = Math.round(profit * 0.075);
          baseTaxRateText = '7.5% (NTR)';
          baseTaxSub = '7.5% Normal Tax Regime on Taxable Profit';
        }
      } else if (catId === 'sme_cat2') {
        baseTax = Math.round(profit * 0.15);
        baseTaxSub = '15% Normal Corporate Rate (SME Fourteenth Schedule)';
      } else if (catId === 'small') {
        baseTax = Math.round(profit * 0.20);
        baseTaxSub = turnover > 250000000 
          ? '20% Rate (Caution: Turnover > 250M may trigger 29% General Rate)'
          : '20% Concessional Small Company Rate';
      } else if (catId === 'banking') {
        baseTax = Math.round(profit * 0.39);
        baseTaxSub = '39% Banking Sector Flat Corporate Rate';
      } else if (catId === 'modaraba') {
        baseTax = Math.round(profit * 0.25);
        baseTaxSub = '25% Modaraba Ordinance Corporate Rate';
      } else {
        baseTax = Math.round(profit * 0.29);
        baseTaxSub = '29% Standard General Corporate Rate';
      }
    }

    // Super Tax (Section 4C) calculation (applies if profit > 150M)
    const superTaxRes = calculateSuperTax(profit, catId, yearKey);
    const superTaxAmount = (catId === 'sme_cat1' && activeSmeRegime === 'ftr') ? 0 : superTaxRes.tax;

    // Alternate Corporate Tax (ACT Sec 113C: 17%) & Minimum Tax (Sec 113: 1.25%)
    let actAmount = 0;
    let minTaxAmount = 0;
    let actStatus = 'Compliant';
    let actSub = 'Normal Tax Exceeds ACT & Min Tax';

    if (isIndividual) {
      actAmount = 0;
      // Minimum Turnover Tax for Individuals applies only if Annual Turnover > Rs 100 Million
      if (turnover >= 100000000) {
        minTaxAmount = Math.round(turnover * 0.0125);
        if (minTaxAmount > (baseTax + surchargeAmount)) {
          actStatus = 'Min Tax Applicable';
          actSub = `1.25% Turnover Tax (${formatPKR(minTaxAmount)}) exceeds slab liability (${formatPKR(baseTax + surchargeAmount)})`;
        } else {
          actStatus = 'Compliant';
          actSub = `Slab tax (${formatPKR(baseTax + surchargeAmount)}) exceeds 1.25% Min Tax (${formatPKR(minTaxAmount)})`;
        }
      } else {
        minTaxAmount = 0;
        actStatus = 'ACT Exempt';
        actSub = 'Turnover < 100M: Min Tax under Sec 113 Exempt (ACT applies to companies only)';
      }
    } else if (catId === 'sme_cat1' && activeSmeRegime === 'ftr') {
      actStatus = 'Exempt';
      actSub = 'FTR Exempt from Section 113 & 113C';
    } else if (catId !== 'banking') {
      actAmount = Math.round(acctProfit * 0.17);
      minTaxAmount = Math.round(turnover * 0.0125);

      if (actAmount > baseTax && actAmount >= minTaxAmount) {
        actStatus = 'ACT Applicable';
        actSub = `17% ACT (${formatPKR(actAmount)}) exceeds normal tax (${formatPKR(baseTax)})`;
      } else if (minTaxAmount > baseTax && minTaxAmount > actAmount) {
        actStatus = 'Min Tax Applicable';
        actSub = `1.25% Turnover Tax (${formatPKR(minTaxAmount)}) exceeds normal tax`;
      } else {
        actStatus = 'Compliant';
        actSub = `Normal tax (${formatPKR(baseTax)}) exceeds ACT & Min Tax`;
      }
    } else {
      actStatus = 'Special Regime';
      actSub = 'Governed by Seventh Schedule Rules';
    }

    // Total tax liability
    let effectiveBaseTax = baseTax;
    if (isIndividual) {
      effectiveBaseTax = Math.max(baseTax + surchargeAmount, minTaxAmount);
    } else if (catId !== 'banking' && !(catId === 'sme_cat1' && activeSmeRegime === 'ftr')) {
      effectiveBaseTax = Math.max(baseTax, actAmount, minTaxAmount);
    }
    const totalTaxLiability = effectiveBaseTax + superTaxAmount;
    const effectiveRate = profit > 0 ? (totalTaxLiability / profit) * 100 : 0;
    const pat = Math.max(0, profit - totalTaxLiability);

    // Update Result Card UI
    if (bizResYearBadge) bizResYearBadge.textContent = yearData.label;
    if (bizResCategoryTitle) {
      bizResCategoryTitle.textContent = isProfAop
        ? 'Professional AOP Tax Summary'
        : isIndividual 
          ? 'Non-Salaried & AOP Tax Summary' 
          : 'Corporate Tax Summary';
    }
    if (bizResCategoryTag) {
      bizResCategoryTag.textContent = isProfAop
        ? 'Professional Firm AOP · Capped at 40%'
        : isIndividual 
          ? `${activeCat.name} · Progressive Slabs`
          : `${activeCat.name} · ${activeCat.rateText}`;
    }

    // Hero metrics: PAT (Profit After Tax) and Total Tax Liability
    if (bizResPAT) bizResPAT.textContent = formatPKR(pat);
    if (bizResTotalTax) bizResTotalTax.textContent = formatPKR(totalTaxLiability);
    if (bizResTotalTaxSub) {
      if (isIndividual) {
        if (surchargeAmount > 0) {
          bizResTotalTaxSub.textContent = `Slab Tax (${formatPKR(baseTax)}) + 10% Surcharge (${formatPKR(surchargeAmount)})`;
        } else {
          bizResTotalTaxSub.textContent = 'Non-Salaried Progressive Slab Tax';
        }
      } else {
        bizResTotalTaxSub.textContent = superTaxAmount > 0 
          ? `Base Tax (${formatPKR(effectiveBaseTax)}) + Super Tax (${formatPKR(superTaxAmount)})` 
          : 'Flat Corporate Tax Liability';
      }
    }

    // 4-Metrics Grid
    if (bizResEffectiveRate) bizResEffectiveRate.textContent = `${effectiveRate.toFixed(2)}%`;
    if (bizResRateSub) bizResRateSub.textContent = `On Net Taxable Profit (${formatPKR(profit)})`;
    if (bizResBaseTax) bizResBaseTax.textContent = formatPKR(baseTax);
    if (bizResBaseTaxSub) bizResBaseTaxSub.textContent = baseTaxSub;

    if (bizResSuperTax) {
      if (isIndividual) {
        bizResSuperTax.textContent = formatPKR(surchargeAmount);
        if (bizResSuperTaxSub) bizResSuperTaxSub.textContent = indTaxInfo ? indTaxInfo.surchargeText : 'Profit ≤ 10M (No Surcharge)';
      } else {
        bizResSuperTax.textContent = formatPKR(superTaxAmount);
        if (bizResSuperTaxSub) bizResSuperTaxSub.textContent = superTaxRes.bracketText;
      }
    }
    
    // Status Badge for ACT / Min Tax
    if (bizResACTStatus) {
      bizResACTStatus.textContent = actStatus;
      let badgeClass = 'metric-badge-tag ';
      if (actStatus === 'Compliant') badgeClass += 'status-compliant';
      else if (actStatus === 'Exempt' || actStatus === 'ACT Exempt') badgeClass += 'status-special';
      else if (actStatus === 'Special Regime') badgeClass += 'status-special';
      else badgeClass += 'status-warning';
      bizResACTStatus.className = badgeClass;
    }
    if (bizResACTSub) bizResACTSub.textContent = actSub;

    // Update Category Compliance Banner (3 clean structured items)
    if (bizComplianceTitle) bizComplianceTitle.textContent = `Statutory Deadlines & Filing Schedule (${yearData.label})`;
    if (bizComplianceCategorySub) bizComplianceCategorySub.textContent = `${activeCat.name} — ${activeCat.criteria}`;
    if (bizComplianceList) {
      bizComplianceList.innerHTML = '';
      activeCat.compliancePoints.slice(0, 3).forEach(pt => {
        const item = document.createElement('div');
        item.className = 'biz-compliance-pill-item';
        
        const dot = document.createElement('span');
        dot.className = 'biz-compliance-pill-dot';
        
        const textSpan = document.createElement('span');
        const colonIdx = pt.indexOf(':');
        if (colonIdx > 0) {
          const strong = document.createElement('strong');
          strong.textContent = pt.substring(0, colonIdx + 1) + ' ';
          textSpan.appendChild(strong);
          textSpan.appendChild(document.createTextNode(pt.substring(colonIdx + 1)));
        } else {
          textSpan.textContent = pt;
        }

        item.appendChild(dot);
        item.appendChild(textSpan);
        bizComplianceList.appendChild(item);
      });
    }

    // Highlight active Super Tax bracket in the schedule grid (if visible)
    if (superTaxGrid) {
      const items = superTaxGrid.querySelectorAll('.super-tax-bracket-item');
      const activeIdx = (catId === 'sme_cat1' && activeSmeRegime === 'ftr') ? 0 : superTaxRes.bracketIndex;
      items.forEach((item, idx) => {
        const isActive = idx === activeIdx;
        item.classList.toggle('active-st-bracket', isActive);
        const existingPill = item.querySelector('.st-active-pill');
        if (existingPill) existingPill.remove();
        if (isActive) {
          const pill = document.createElement('span');
          pill.className = 'st-active-pill';
          pill.textContent = 'Active Bracket';
          item.appendChild(pill);
        }
      });
    }

    // Render Year-Wise Matrix / Slabs Table
    renderBusinessMatrixTable(yearKey, catId);
  }

  function renderBusinessMatrixTable(yearKey, activeCatId) {
    const isInd = (activeCatId === 'individual' || activeCatId === 'prof_aop');
    const isProfAop = (activeCatId === 'prof_aop');
    const profit = parseAmount(bizTaxableProfit.value);

    // Sync Year tabs
    bizYearTabs.forEach(tab => {
      const isCurrent = tab.getAttribute('data-bizyear') === yearKey;
      tab.classList.toggle('active', isCurrent);
      tab.setAttribute('aria-selected', isCurrent ? 'true' : 'false');
    });

    if (isInd) {
      // NON-SALARIED & AOP SLABS TABLE VIEW (DIRECTLY MATCHING USER IMAGES)
      const yearLabel = (yearKey === '2026-2027') ? 'FY 2026-27' :
                        (yearKey === '2025-2026') ? 'Tax Year 2025–26' :
                        (yearKey === '2024-2025') ? 'Tax Year 2024-25' : 'TY 2023–24';

      if (bizMatrixTitle) bizMatrixTitle.textContent = `Non-Salaried & AOP Income Tax Slabs (${yearLabel})`;
      if (bizMatrixDesc) {
        bizMatrixDesc.textContent = `Official progressive tax slabs and statutory surcharges for non-salaried individuals, sole proprietors, and AOPs under the First Schedule to Income Tax Ordinance, 2001.`;
      }

      // Update Table Head
      if (bizMatrixTableHead) {
        bizMatrixTableHead.innerHTML = `
          <tr>
            <th style="width: 28%;">Taxable Income Range (PKR)</th>
            <th style="width: 50%;">Tax Rate &amp; Fixed Amount (Calculation)</th>
            <th style="width: 22%;">Slab Status</th>
          </tr>
        `;
      }

      // Populate Slabs Body
      bizMatrixTableBody.innerHTML = '';
      const slabs = NON_SALARIED_SLABS[yearKey] || NON_SALARIED_SLABS['2026-2027'];
      const indCalc = calculateIndividualTax(profit, yearKey, isProfAop);

      slabs.forEach((slab, idx) => {
        const tr = document.createElement('tr');
        const isSelected = (idx === indCalc.activeSlabIndex);
        if (isSelected) {
          tr.className = 'active-slab-row';
        }

        // Col 1: Range
        const tdRange = document.createElement('td');
        const strong = document.createElement('strong');
        strong.textContent = slab.rangeText;
        tdRange.appendChild(strong);

        // Col 2: Rate & Formula
        const tdRate = document.createElement('td');
        let descText = slab.desc;
        if (isProfAop && idx === 5 && yearKey !== '2023-2024') {
          descText = 'Rs. 1,610,000 + 40% (Professional AOP Cap) of amount exceeding Rs. 5,600,000';
        }
        tdRate.innerHTML = `<span>${descText}</span>`;

        // Col 3: Status
        const tdStatus = document.createElement('td');
        if (isSelected) {
          const badge = document.createElement('span');
          badge.className = 'slab-active-tag';
          badge.textContent = 'Active Slab';
          tdStatus.appendChild(badge);
        } else {
          tdStatus.innerHTML = `<span style="font-size: 11.5px; color: var(--text-muted);">Tier ${idx + 1}</span>`;
        }

        tr.appendChild(tdRange);
        tr.appendChild(tdRate);
        tr.appendChild(tdStatus);
        bizMatrixTableBody.appendChild(tr);
      });

      // Show Non-Salaried Rules Card & populate from Image data
      if (nonSalariedRulesCard) {
        nonSalariedRulesCard.style.display = 'block';
        const rulesInfo = NON_SALARIED_RULES_DATA[yearKey] || NON_SALARIED_RULES_DATA['2026-2027'];
        if (nonSalariedRulesTitle) nonSalariedRulesTitle.textContent = rulesInfo.title;
        if (nonSalariedRulesSub) nonSalariedRulesSub.textContent = rulesInfo.sub;
        if (nonSalariedRulesGrid) {
          nonSalariedRulesGrid.innerHTML = '';
          rulesInfo.rules.forEach(rule => {
            const item = document.createElement('div');
            item.className = 'ns-rule-item';
            item.innerHTML = `
              <div class="ns-rule-item-header">
                <span class="ns-rule-title">${rule.title}</span>
                <span class="ns-source-pill">${rule.badge}</span>
              </div>
              <p class="ns-rule-desc">${rule.desc}</p>
            `;
            nonSalariedRulesGrid.appendChild(item);
          });
        }
      }

      if (superTaxScheduleCard) {
        superTaxScheduleCard.style.display = (profit > 150000000) ? 'block' : 'none';
      }

    } else {
      // CORPORATE MATRIX TABLE VIEW
      const yearData = BUSINESS_TAX_DATA[yearKey] || BUSINESS_TAX_DATA['2026-2027'];
      if (bizMatrixTitle) bizMatrixTitle.textContent = `${yearData.label} Corporate Tax & Statutory Compliance Matrix`;
      if (bizMatrixDesc) bizMatrixDesc.textContent = yearData.desc;

      if (bizMatrixTableHead) {
        bizMatrixTableHead.innerHTML = `
          <tr>
            <th>Entity Category &amp; Criteria</th>
            <th>Applicable Corporate Rate</th>
            <th>Super Tax (Sec 4C)</th>
            <th>ACT / Min Tax</th>
            <th>Statutory Compliance &amp; Due Dates</th>
          </tr>
        `;
      }

      bizMatrixTableBody.innerHTML = '';
      yearData.categories.forEach(cat => {
        const tr = document.createElement('tr');
        const isSelected = (cat.id === activeCatId);
        if (isSelected) {
          tr.className = 'active-slab-row';
        }

        const tdEntity = document.createElement('td');
        const strong = document.createElement('strong');
        strong.textContent = cat.name;
        tdEntity.appendChild(strong);
        const sub = document.createElement('div');
        sub.style.fontSize = '12px';
        sub.style.color = 'var(--text-muted)';
        sub.style.marginTop = '2px';
        sub.textContent = cat.criteria;
        tdEntity.appendChild(sub);
        if (isSelected) {
          const badge = document.createElement('span');
          badge.className = 'slab-active-tag';
          badge.textContent = 'Selected Entity';
          tdEntity.appendChild(badge);
        }

        const tdRate = document.createElement('td');
        const rateStrong = document.createElement('strong');
        rateStrong.style.color = '#A31D24';
        rateStrong.textContent = cat.rateText;
        tdRate.appendChild(rateStrong);

        const tdSuper = document.createElement('td');
        tdSuper.textContent = cat.superTaxText;

        const tdAct = document.createElement('td');
        tdAct.textContent = cat.actMinTaxText;

        const tdCompliance = document.createElement('td');
        const compList = document.createElement('ul');
        compList.style.margin = '0';
        compList.style.paddingLeft = '18px';
        compList.style.fontSize = '12.5px';
        compList.style.lineHeight = '1.45';
        cat.compliancePoints.forEach(p => {
          const li = document.createElement('li');
          li.textContent = p;
          compList.appendChild(li);
        });
        tdCompliance.appendChild(compList);

        tr.appendChild(tdEntity);
        tr.appendChild(tdRate);
        tr.appendChild(tdSuper);
        tr.appendChild(tdAct);
        tr.appendChild(tdCompliance);
        bizMatrixTableBody.appendChild(tr);
      });

      if (nonSalariedRulesCard) nonSalariedRulesCard.style.display = 'none';
      if (superTaxScheduleCard) superTaxScheduleCard.style.display = 'block';
    }
  }

  // Currency input live formatting helper (formats without auto-calculating)
  function setupCurrencyInput(inputEl) {
    if (!inputEl) return;
    inputEl.addEventListener('input', () => {
      const cursorPos = inputEl.selectionStart;
      const oldLength = inputEl.value.length;
      const rawVal = parseAmount(inputEl.value);

      if (rawVal === 0 && inputEl.value.trim() === '') {
        inputEl.value = '';
      } else {
        inputEl.value = rawVal.toLocaleString('en-PK');
      }

      const newLength = inputEl.value.length;
      const newCursor = Math.max(0, cursorPos + (newLength - oldLength));
      try {
        inputEl.setSelectionRange(newCursor, newCursor);
      } catch (_) {}
    });
  }

  setupCurrencyInput(bizTaxableProfit);
  setupCurrencyInput(bizTurnover);
  setupCurrencyInput(bizAccountingProfit);

  // Profit presets click (populates inputs without auto-calculating)
  if (bizProfitPresetsRow) {
    const pills = bizProfitPresetsRow.querySelectorAll('.preset-pill');
    pills.forEach(pill => {
      pill.addEventListener('click', () => {
        pills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        const amount = parseInt(pill.getAttribute('data-bizamount'), 10);
        if (amount > 0) {
          bizTaxableProfit.value = amount.toLocaleString('en-PK');
          // Proportionate turnover suggestion if turnover is lower than profit
          const currentTurnover = parseAmount(bizTurnover.value);
          if (currentTurnover < amount * 3) {
            bizTurnover.value = (amount * 5).toLocaleString('en-PK');
          }
        }
      });
    });
  }

  // Entity Classification switcher (Individual vs Corporate)
  if (btnEntityIndividual && btnEntityCorporate) {
    btnEntityIndividual.addEventListener('click', () => {
      btnEntityIndividual.classList.add('active');
      btnEntityIndividual.setAttribute('aria-checked', 'true');
      btnEntityCorporate.classList.remove('active');
      btnEntityCorporate.setAttribute('aria-checked', 'false');
      if (bizCategory.value !== 'individual' && bizCategory.value !== 'prof_aop') {
        bizCategory.value = 'individual';
      }
      smeRegimeGroup.style.display = 'none';
      if (bizIndividualRulesCallout) bizIndividualRulesCallout.style.display = 'block';
      renderBusinessMatrixTable(bizTaxYear.value, bizCategory.value);
    });

    btnEntityCorporate.addEventListener('click', () => {
      btnEntityCorporate.classList.add('active');
      btnEntityCorporate.setAttribute('aria-checked', 'true');
      btnEntityIndividual.classList.remove('active');
      btnEntityIndividual.setAttribute('aria-checked', 'false');
      if (bizCategory.value === 'individual' || bizCategory.value === 'prof_aop') {
        bizCategory.value = 'general';
      }
      if (bizCategory.value === 'sme_cat1') {
        smeRegimeGroup.style.display = 'block';
      } else {
        smeRegimeGroup.style.display = 'none';
      }
      if (bizIndividualRulesCallout) bizIndividualRulesCallout.style.display = 'none';
      renderBusinessMatrixTable(bizTaxYear.value, bizCategory.value);
    });
  }

  // Tax year change (updates matrix table view without auto-calculating)
  bizTaxYear.addEventListener('change', () => {
    renderBusinessMatrixTable(bizTaxYear.value, bizCategory.value);
  });

  // Category change (syncs entity buttons and SME regime pills without auto-calculating)
  bizCategory.addEventListener('change', () => {
    const catId = bizCategory.value;
    const isInd = (catId === 'individual' || catId === 'prof_aop');
    if (btnEntityIndividual && btnEntityCorporate) {
      btnEntityIndividual.classList.toggle('active', isInd);
      btnEntityIndividual.setAttribute('aria-checked', isInd ? 'true' : 'false');
      btnEntityCorporate.classList.toggle('active', !isInd);
      btnEntityCorporate.setAttribute('aria-checked', !isInd ? 'true' : 'false');
    }
    if (bizIndividualRulesCallout) {
      bizIndividualRulesCallout.style.display = isInd ? 'block' : 'none';
    }
    if (catId === 'sme_cat1') {
      smeRegimeGroup.style.display = 'block';
    } else {
      smeRegimeGroup.style.display = 'none';
    }
    renderBusinessMatrixTable(bizTaxYear.value, catId);
  });

  // SME Regime pills click (updates regime state without auto-calculating)
  if (btnRegimeNTR && btnRegimeFTR) {
    btnRegimeNTR.addEventListener('click', () => {
      activeSmeRegime = 'ntr';
      btnRegimeNTR.classList.add('active');
      btnRegimeNTR.setAttribute('aria-checked', 'true');
      btnRegimeFTR.classList.remove('active');
      btnRegimeFTR.setAttribute('aria-checked', 'false');
    });

    btnRegimeFTR.addEventListener('click', () => {
      activeSmeRegime = 'ftr';
      btnRegimeFTR.classList.add('active');
      btnRegimeFTR.setAttribute('aria-checked', 'true');
      btnRegimeNTR.classList.remove('active');
      btnRegimeNTR.setAttribute('aria-checked', 'false');
    });
  }

  // Calculate button: performs calculation only on explicit button click
  if (btnCalculateBizTax) {
    btnCalculateBizTax.addEventListener('click', () => {
      updateBusinessCalculator();
      const resultsEl = document.getElementById('bizCalcResults');
      if (resultsEl) {
        resultsEl.classList.remove('calculating');
        void resultsEl.offsetWidth; // trigger reflow
        resultsEl.classList.add('calculating');
        setTimeout(() => resultsEl.classList.remove('calculating'), 500);

        if (window.innerWidth < 768) {
          resultsEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }
    });
  }

  // Handle business form Enter key submission
  const bizForm = document.getElementById('bizTaxCalculatorForm');
  if (bizForm) {
    bizForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (btnCalculateBizTax) btnCalculateBizTax.click();
    });
  }

  // Year Matrix tabs click (view specific year in matrix without auto-calculating)
  bizYearTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const year = tab.getAttribute('data-bizyear');
      if (year && BUSINESS_TAX_DATA[year]) {
        bizTaxYear.value = year;
        renderBusinessMatrixTable(year, bizCategory.value);
      }
    });
  });

  // Expose globally so switchTaxCategory can invoke it
  window.updateBusinessCalculator = updateBusinessCalculator;

  // Initial render on load
  updateBusinessCalculator();
})();

/* ==========================================================================
   FBR Rental Income Tax Calculator (Section 15, 15A, 155 & Tenth Schedule)
   ========================================================================== */
(function initRentalCalculator() {
  const rentalTaxYear = document.getElementById('rentalTaxYear');
  const rentalOwnerType = document.getElementById('rentalOwnerType');
  const btnRentalFiler = document.getElementById('btnRentalFiler');
  const btnRentalNonFiler = document.getElementById('btnRentalNonFiler');
  const rentalRentPeriod = document.getElementById('rentalRentPeriod');
  const rentalGrossRent = document.getElementById('rentalGrossRent');
  const rentalRentLabel = document.getElementById('rentalRentLabel');
  const rentalPresetsRow = document.getElementById('rentalPresetsRow');
  const rentalDeductionsGroup = document.getElementById('rentalDeductionsGroup');
  const rentalClaimRepairs = document.getElementById('rentalClaimRepairs');
  const btnToggleOtherDeductions = document.getElementById('btnToggleOtherDeductions');
  const extraDeductionsText = document.getElementById('extraDeductionsText');
  const rentalExtraFields = document.getElementById('rentalExtraFields');
  const rentalPropertyTax = document.getElementById('rentalPropertyTax');
  const rentalLoanInterest = document.getElementById('rentalLoanInterest');
  const rentalInsurance = document.getElementById('rentalInsurance');
  const rentalAdminCharges = document.getElementById('rentalAdminCharges');
  const btnCalculateRentalTax = document.getElementById('btnCalculateRentalTax');
  const rentalForm = document.getElementById('rentalTaxCalculatorForm');

  // Result Elements
  const rentalCalcResults = document.getElementById('rentalCalcResults');
  const rentalResYearBadge = document.getElementById('rentalResYearBadge');
  const rentalResCategoryTag = document.getElementById('rentalResCategoryTag');
  const rentalResNetTakeHome = document.getElementById('rentalResNetTakeHome');
  const rentalResNetTakeHomeSub = document.getElementById('rentalResNetTakeHomeSub');
  const rentalResTotalTax = document.getElementById('rentalResTotalTax');
  const rentalResTotalTaxSub = document.getElementById('rentalResTotalTaxSub');
  const rentalResEffectiveRate = document.getElementById('rentalResEffectiveRate');
  const rentalResMonthlyTax = document.getElementById('rentalResMonthlyTax');
  const rentalResTotalDeductions = document.getElementById('rentalResTotalDeductions');
  const rentalResDeductionsSub = document.getElementById('rentalResDeductionsSub');
  const rentalResNetTaxableRent = document.getElementById('rentalResNetTaxableRent');
  const rentalResActiveSlab = document.getElementById('rentalResActiveSlab');
  const rentalResActiveSlabDesc = document.getElementById('rentalResActiveSlabDesc');
  const rentalFilerAlertBox = document.getElementById('rentalFilerAlertBox');
  const rentalFilerAlertText = document.getElementById('rentalFilerAlertText');
  const rentalMatrixTableBody = document.getElementById('rentalMatrixTableBody');
  const rentalYearTabs = document.querySelectorAll('#rentalYearTabs .tab-btn');

  if (!rentalGrossRent || !rentalOwnerType || !rentalMatrixTableBody) {
    return;
  }

  // Presets Data
  const RENTAL_PRESETS = {
    monthly: [
      { label: '30k', amount: 30000 },
      { label: '60k', amount: 60000 },
      { label: '100k', amount: 100000 },
      { label: '200k', amount: 200000 },
      { label: '500k', amount: 500000 }
    ],
    annually: [
      { label: '360k', amount: 360000 },
      { label: '720k', amount: 720000 },
      { label: '1.2M', amount: 1200000 },
      { label: '2.4M', amount: 2400000 },
      { label: '6.0M', amount: 6000000 }
    ]
  };

  function parseAmount(val) {
    if (!val) return 0;
    const clean = String(val).replace(/[^0-9.]/g, '');
    const num = parseFloat(clean);
    return isNaN(num) ? 0 : Math.round(num);
  }

  function formatPKR(amount) {
    if (isNaN(amount) || amount === null || amount === undefined) return 'Rs 0';
    return 'Rs ' + Math.round(amount).toLocaleString('en-PK');
  }

  function setupCurrencyInput(inputEl) {
    if (!inputEl) return;
    inputEl.addEventListener('input', () => {
      const cursorPos = inputEl.selectionStart;
      const oldLength = inputEl.value.length;
      const rawVal = parseAmount(inputEl.value);

      if (rawVal === 0 && inputEl.value.trim() === '') {
        inputEl.value = '';
      } else {
        inputEl.value = rawVal.toLocaleString('en-PK');
      }

      const newLength = inputEl.value.length;
      const newCursor = Math.max(0, cursorPos + (newLength - oldLength));
      try {
        inputEl.setSelectionRange(newCursor, newCursor);
      } catch (_) {}
    });
  }

  setupCurrencyInput(rentalGrossRent);
  setupCurrencyInput(rentalPropertyTax);
  setupCurrencyInput(rentalLoanInterest);
  setupCurrencyInput(rentalInsurance);
  setupCurrencyInput(rentalAdminCharges);

  // Render Presets
  function renderRentalPresets(period) {
    if (!rentalPresetsRow) return;
    rentalPresetsRow.innerHTML = '';
    const presets = RENTAL_PRESETS[period] || RENTAL_PRESETS.monthly;
    const currentVal = parseAmount(rentalGrossRent.value);

    presets.forEach(p => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'preset-pill' + (currentVal === p.amount ? ' active' : '');
      btn.setAttribute('data-rentamount', p.amount);
      btn.textContent = p.label;
      btn.addEventListener('click', () => {
        rentalGrossRent.value = p.amount.toLocaleString('en-PK');
        rentalPresetsRow.querySelectorAll('.preset-pill').forEach(el => el.classList.remove('active'));
        btn.classList.add('active');
        updateRentalCalculator();
      });
      rentalPresetsRow.appendChild(btn);
    });
  }

  renderRentalPresets('monthly');

  // Rental Period Change
  if (rentalRentPeriod) {
    rentalRentPeriod.addEventListener('change', () => {
      const isMonthly = rentalRentPeriod.value === 'monthly';
      if (rentalRentLabel) {
        rentalRentLabel.textContent = isMonthly ? 'Monthly Gross Rent (PKR)' : 'Annual Gross Rent (PKR)';
      }
      renderRentalPresets(rentalRentPeriod.value);
    });
  }

  // Active Taxpayer Status (Filer / Non-Filer) Toggles
  let isFiler = true;
  if (btnRentalFiler && btnRentalNonFiler) {
    btnRentalFiler.addEventListener('click', () => {
      if (!isFiler) {
        isFiler = true;
        btnRentalFiler.classList.add('active');
        btnRentalFiler.setAttribute('aria-checked', 'true');
        btnRentalNonFiler.classList.remove('active');
        btnRentalNonFiler.setAttribute('aria-checked', 'false');
        updateRentalCalculator();
      }
    });

    btnRentalNonFiler.addEventListener('click', () => {
      if (isFiler) {
        isFiler = false;
        btnRentalNonFiler.classList.add('active');
        btnRentalNonFiler.setAttribute('aria-checked', 'true');
        btnRentalFiler.classList.remove('active');
        btnRentalFiler.setAttribute('aria-checked', 'false');
        updateRentalCalculator();
      }
    });
  }

  // Property Ownership Type change
  if (rentalOwnerType) {
    rentalOwnerType.addEventListener('change', () => {
      const isCompany = rentalOwnerType.value === 'company';
      if (rentalDeductionsGroup) {
        rentalDeductionsGroup.hidden = isCompany;
      }
      updateRentalCalculator();
    });
  }

  // Toggle Other Deductions Accordion
  if (btnToggleOtherDeductions && rentalExtraFields) {
    btnToggleOtherDeductions.addEventListener('click', () => {
      const isHidden = rentalExtraFields.hidden;
      rentalExtraFields.hidden = !isHidden;
      btnToggleOtherDeductions.setAttribute('aria-expanded', String(isHidden));
      if (extraDeductionsText) {
        extraDeductionsText.textContent = isHidden
          ? '− Hide Additional Allowable Expenses'
          : '+ Add Other Allowable Expenses (Taxes, Markup, Insurance)';
      }
    });
  }

  // Year Selection Change
  if (rentalTaxYear) {
    rentalTaxYear.addEventListener('change', () => {
      const year = rentalTaxYear.value;
      rentalYearTabs.forEach(t => {
        const matches = t.getAttribute('data-rentyear') === year;
        t.classList.toggle('active', matches);
        t.setAttribute('aria-selected', String(matches));
      });
      updateRentalCalculator();
    });
  }

  // Year Matrix Tabs click
  rentalYearTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const year = tab.getAttribute('data-rentyear');
      if (year && rentalTaxYear) {
        rentalTaxYear.value = year;
        rentalYearTabs.forEach(t => {
          t.classList.toggle('active', t === tab);
          t.setAttribute('aria-selected', String(t === tab));
        });
        updateRentalCalculator();
      }
    });
  });

  // Calculate Function
  function updateRentalCalculator() {
    const isCompany = rentalOwnerType.value === 'company';
    const isMonthly = rentalRentPeriod ? rentalRentPeriod.value === 'monthly' : true;
    const rawRent = parseAmount(rentalGrossRent.value);
    const annualGrossRent = isMonthly ? rawRent * 12 : rawRent;
    const yearKey = rentalTaxYear.value || '2026-2027';

    // Year Badge
    if (rentalResYearBadge) {
      const yearLabel = rentalTaxYear.options[rentalTaxYear.selectedIndex]?.text || `Tax Year ${yearKey}`;
      rentalResYearBadge.textContent = yearLabel.split('(')[0].trim();
    }

    // Category Tag
    if (rentalResCategoryTag) {
      const ownerLabel = isCompany ? 'Corporate Company' : 'Individual / AOP';
      const filerLabel = isFiler ? 'Active Taxpayer (Filer)' : 'Non-Filer (Doubled Rates)';
      rentalResCategoryTag.textContent = `${ownerLabel} · ${filerLabel}`;
    }

    let repairDeduction = 0;
    let otherDeductions = 0;
    let totalDeductions = 0;
    let netTaxableRent = annualGrossRent;
    let totalTax = 0;
    let slabIndex = 0;
    let activeSlabText = '';
    let activeSlabDescText = '';
    let filerTax = 0;
    let nonFilerTax = 0;

    if (isCompany) {
      // Corporate property withholding: flat 15% for filers, 30% for non-filers
      const rate = isFiler ? 0.15 : 0.30;
      totalTax = Math.round(annualGrossRent * rate);
      filerTax = Math.round(annualGrossRent * 0.15);
      nonFilerTax = Math.round(annualGrossRent * 0.30);
      slabIndex = 'company';
      netTaxableRent = annualGrossRent;
      totalDeductions = 0;

      activeSlabText = isFiler
        ? 'Corporate Flat Rate: 15% on Gross Rent'
        : 'Corporate Non-Filer: 30% Flat Rate (Doubled)';
      activeSlabDescText = isFiler
        ? 'Section 155 requires 15% withholding on gross rent paid to corporate landlords from rupee one.'
        : 'Under Tenth Schedule, non-filer companies pay 30% flat withholding on gross rent.';
    } else {
      // Individual / AOP Deductions under Section 15A
      const claimRepairs = rentalClaimRepairs ? rentalClaimRepairs.checked : true;
      repairDeduction = claimRepairs ? Math.round(annualGrossRent * 0.20) : 0;

      const propTax = parseAmount(rentalPropertyTax?.value);
      const loanInterest = parseAmount(rentalLoanInterest?.value);
      const insurance = parseAmount(rentalInsurance?.value);
      const adminCharges = parseAmount(rentalAdminCharges?.value);
      const maxAdmin = Math.round(annualGrossRent * 0.04);
      const allowedAdmin = Math.min(adminCharges, maxAdmin);

      otherDeductions = propTax + loanInterest + insurance + allowedAdmin;
      totalDeductions = repairDeduction + otherDeductions;
      netTaxableRent = Math.max(0, annualGrossRent - totalDeductions);

      // Section 155 Withholding Slabs (on gross rent)
      function getIndividualTax(amount, filer) {
        if (amount <= 300000) {
          return { tax: 0, index: 0, desc: 'Tax-free exemption limit up to Rs. 300,000 (0% tax).' };
        }
        if (amount <= 600000) {
          const rate = filer ? 0.05 : 0.10;
          const tax = Math.round((amount - 300000) * rate);
          return {
            tax,
            index: 1,
            desc: filer 
              ? '5% of the gross rental amount exceeding Rs. 300,000.'
              : '10% of the gross rental amount exceeding Rs. 300,000 (100% non-filer surcharge).'
          };
        }
        if (amount <= 2000000) {
          const base = filer ? 15000 : 30000;
          const rate = filer ? 0.10 : 0.20;
          const tax = Math.round(base + (amount - 600000) * rate);
          return {
            tax,
            index: 2,
            desc: filer
              ? 'Rs. 15,000 + 10% of the gross rental amount exceeding Rs. 600,000.'
              : 'Rs. 30,000 + 20% of the gross rental amount exceeding Rs. 600,000 (Doubled).'
          };
        }
        const base = filer ? 155000 : 310000;
        const rate = filer ? 0.25 : 0.50;
        const tax = Math.round(base + (amount - 2000000) * rate);
        return {
          tax,
          index: 3,
          desc: filer
            ? 'Rs. 155,000 + 25% of the gross rental amount exceeding Rs. 2,000,000.'
            : 'Rs. 310,000 + 50% of the gross rental amount exceeding Rs. 2,000,000 (Doubled).'
        };
      }

      const calcRes = getIndividualTax(annualGrossRent, isFiler);
      totalTax = calcRes.tax;
      slabIndex = calcRes.index;
      activeSlabDescText = calcRes.desc;

      const filerRes = getIndividualTax(annualGrossRent, true);
      const nonFilerRes = getIndividualTax(annualGrossRent, false);
      filerTax = filerRes.tax;
      nonFilerTax = nonFilerRes.tax;

      const slabNames = [
        'Up to Rs. 300,000 (0% Exempt)',
        `Rs. 300,001 to Rs. 600,000 (${isFiler ? '5%' : '10%'})`,
        `Rs. 600,001 to Rs. 2,000,000 (${isFiler ? '10%' : '20%'})`,
        `Above Rs. 2,000,000 (${isFiler ? '25%' : '50%'})`
      ];
      activeSlabText = `Active Bracket: ${slabNames[slabIndex]}`;
    }

    const monthlyTax = Math.round(totalTax / 12);
    const netTakeHome = Math.max(0, annualGrossRent - totalTax);
    const monthlyTakeHome = Math.round(netTakeHome / 12);
    const effectiveRate = annualGrossRent > 0 ? (totalTax / annualGrossRent) * 100 : 0;
    const penaltyDifference = Math.max(0, nonFilerTax - filerTax);

    // Primary Hero Metrics
    if (rentalResNetTakeHome) rentalResNetTakeHome.textContent = formatPKR(netTakeHome);
    if (rentalResNetTakeHomeSub) rentalResNetTakeHomeSub.textContent = `${formatPKR(monthlyTakeHome)} / month take-home`;
    if (rentalResTotalTax) rentalResTotalTax.textContent = formatPKR(totalTax);
    if (rentalResTotalTaxSub) {
      rentalResTotalTaxSub.textContent = isCompany
        ? `${formatPKR(monthlyTax)} / month (${isFiler ? '15%' : '30%'} flat withholding)`
        : `${formatPKR(monthlyTax)} / month withholding (WHT)`;
    }

    // Secondary 4-Metric Grid
    if (rentalResEffectiveRate) rentalResEffectiveRate.textContent = `${effectiveRate.toFixed(2)}%`;
    if (rentalResMonthlyTax) rentalResMonthlyTax.textContent = formatPKR(monthlyTax);
    if (rentalResTotalDeductions) {
      rentalResTotalDeductions.textContent = isCompany ? 'N/A' : formatPKR(totalDeductions);
    }
    if (rentalResDeductionsSub) {
      if (isCompany) {
        rentalResDeductionsSub.textContent = 'Flat 15%/30% on gross rent';
      } else if (otherDeductions > 0 && repairDeduction > 0) {
        rentalResDeductionsSub.textContent = '20% Repair + Sec 15A Expenses';
      } else if (repairDeduction > 0) {
        rentalResDeductionsSub.textContent = 'Statutory 20% Repair Allowance';
      } else if (otherDeductions > 0) {
        rentalResDeductionsSub.textContent = 'Itemized Sec 15A Expenses';
      } else {
        rentalResDeductionsSub.textContent = 'No Deductions Claimed';
      }
    }
    if (rentalResNetTaxableRent) {
      rentalResNetTaxableRent.textContent = formatPKR(netTaxableRent);
    }

    // Active Slab Banner
    if (rentalResActiveSlab) rentalResActiveSlab.textContent = activeSlabText;
    if (rentalResActiveSlabDesc) rentalResActiveSlabDesc.textContent = activeSlabDescText;

    // Filer / Non-Filer Warning Box
    if (rentalFilerAlertBox && rentalFilerAlertText) {
      if (isFiler) {
        rentalFilerAlertBox.classList.remove('penalty-alert');
        rentalFilerAlertText.innerHTML = `As an Active Taxpayer on the FBR ATL, you pay standard progressive withholding rates and save <strong>${formatPKR(penaltyDifference)}</strong> compared to non-filers.`;
      } else {
        rentalFilerAlertBox.classList.add('penalty-alert');
        rentalFilerAlertText.innerHTML = `Under Rule 1 of the Tenth Schedule, withholding tax rates are doubled (100% surcharge). You are paying <strong>${formatPKR(penaltyDifference)}</strong> in additional penalty taxes. Become an active filer to save!`;
      }
    }

    // Highlight row in Rental Matrix Table
    if (rentalMatrixTableBody) {
      const rows = rentalMatrixTableBody.querySelectorAll('tr[data-rent-slab]');
      rows.forEach(row => {
        const slabAttr = row.getAttribute('data-rent-slab');
        const isActive = isCompany 
          ? slabAttr === 'company' 
          : slabAttr === String(slabIndex);
        row.classList.toggle('active-slab-row', isActive);
      });
    }
  }

  // Calculate Button Click
  if (btnCalculateRentalTax) {
    btnCalculateRentalTax.addEventListener('click', () => {
      updateRentalCalculator();

      if (rentalCalcResults) {
        rentalCalcResults.classList.remove('calculating');
        void rentalCalcResults.offsetWidth; // trigger reflow
        rentalCalcResults.classList.add('calculating');
        setTimeout(() => rentalCalcResults.classList.remove('calculating'), 500);

        if (window.innerWidth < 768) {
          rentalCalcResults.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }
    });
  }

  // Handle Form Enter Submission
  if (rentalForm) {
    rentalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (btnCalculateRentalTax) btnCalculateRentalTax.click();
    });
  }

  // Expose globally so switchTaxCategory can invoke it
  window.updateRentalCalculator = updateRentalCalculator;

  // Initial render on load
  updateRentalCalculator();
})();

/* ==========================================================================
   Footer Actions & Legal Modals (Privacy Policy & Terms of Use)
   ========================================================================== */
(function initLegalModalsAndFooter() {
  const privacyModal = document.getElementById('privacyModal');
  const termsModal = document.getElementById('termsModal');

  function openModal(modalEl) {
    if (!modalEl) return;
    modalEl.classList.add('active');
    modalEl.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    const closeBtn = modalEl.querySelector('.policy-modal-close');
    if (closeBtn) closeBtn.focus();
  }

  function closeModal(modalEl) {
    if (!modalEl) return;
    modalEl.classList.remove('active');
    modalEl.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function closeAllModals() {
    closeModal(privacyModal);
    closeModal(termsModal);
  }

  // Privacy triggers
  const privacyTriggers = [
    'footerPrivacyTrigger',
    'btnDisclaimerPrivacy',
    'footerNavPrivacy'
  ];
  privacyTriggers.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        openModal(privacyModal);
      });
    }
  });

  // Terms triggers
  const termsTriggers = [
    'footerTermsTrigger',
    'footerNavTerms'
  ];
  termsTriggers.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        openModal(termsModal);
      });
    }
  });

  // Close buttons inside modals
  document.querySelectorAll('.policy-modal-close, .policy-modal-dismiss').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      closeAllModals();
    });
  });

  // Backdrop click closes
  [privacyModal, termsModal].forEach(modal => {
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          closeModal(modal);
        }
      });
    }
  });

  // ESC key closes
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllModals();
    }
  });

  // Print Privacy Policy
  const btnPrint = document.getElementById('btnPrintPrivacyPolicy');
  if (btnPrint) {
    btnPrint.addEventListener('click', () => {
      window.print();
    });
  }

  // Footer tax calculator quick switcher links
  document.querySelectorAll('[data-switch-calc]').forEach(link => {
    link.addEventListener('click', () => {
      const targetCalc = link.getAttribute('data-switch-calc');
      if (typeof window.switchTaxCategory === 'function' && targetCalc) {
        window.switchTaxCategory(targetCalc);
      }
    });
  });
})();
