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
  const salariedCalcView = document.getElementById('salariedCalcView');
  const businessCalcView = document.getElementById('businessCalcView');
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
    if (category === 'business') {
      if (tabSalaried) {
        tabSalaried.classList.remove('active');
        tabSalaried.setAttribute('aria-selected', 'false');
      }
      if (tabBusiness) {
        tabBusiness.classList.add('active');
        tabBusiness.setAttribute('aria-selected', 'true');
      }
      if (salariedCalcView) salariedCalcView.hidden = true;
      if (businessCalcView) {
        businessCalcView.hidden = false;
        businessCalcView.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
      if (typeof window.updateBusinessCalculator === 'function') {
        window.updateBusinessCalculator();
      }
    } else {
      if (tabBusiness) {
        tabBusiness.classList.remove('active');
        tabBusiness.setAttribute('aria-selected', 'false');
      }
      if (tabSalaried) {
        tabSalaried.classList.add('active');
        tabSalaried.setAttribute('aria-selected', 'true');
      }
      if (businessCalcView) businessCalcView.hidden = true;
      if (salariedCalcView) salariedCalcView.hidden = false;
      updateCalculator();
    }
  }

  if (tabSalaried) {
    tabSalaried.addEventListener('click', () => switchTaxCategory('salaried'));
  }
  if (tabBusiness) {
    tabBusiness.addEventListener('click', () => switchTaxCategory('business'));
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

  if (!bizTaxYear || !bizCategory || !bizTaxableProfit || !bizMatrixTableBody) {
    return; // Business calculator not present
  }

  let activeSmeRegime = 'ntr'; // 'ntr' | 'ftr'

  const BUSINESS_TAX_DATA = {
    '2026-2027': {
      label: 'Tax Year 2026–2027',
      desc: 'For Tax Year 2026–27 in Pakistan, companies are taxed at flat corporate rates rather than progressive individual slabs (ICMA / FBR Finance Act). High earners are subject to Super Tax under Section 4C.',
      categories: [
        {
          id: 'general',
          name: 'All Other Companies (General Corporate)',
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
      desc: 'Corporate income tax rates in Pakistan for Tax Year 2025–2026 are determined by company type and structure rather than progressive individual brackets. Alternate Corporate Tax (17%) and Minimum Turnover Tax (1.25%) apply.',
      categories: [
        {
          id: 'general',
          name: 'General Companies',
          criteria: 'Public & Private Limited Corporate Entities',
          rate: 0.29,
          rateText: '29%',
          superTaxText: 'Progressive 0% to 10% Super Tax (Section 4C) exceeding Rs. 150M',
          actMinTaxText: '17% ACT (Sec 113C) & 1.25% Minimum Turnover Tax',
          compliancePoints: [
            'FBR Annual Return: Due 31st December (Special Year: 30th Sept)',
            'Advance Tax (Sec 147): 4 quarterly installments (25 Sep, 25 Dec, 25 Mar, 15 Jun)',
            'SECP Annual Return (Form A/29) & audited financial statements within 30 days of AGM',
            'Monthly Sales Tax & Withholding Tax reporting'
          ]
        },
        {
          id: 'small',
          name: 'Small Companies',
          criteria: 'Turnover ≤ Rs. 250M, Capital ≤ Rs. 50M, Employees ≤ 250',
          rate: 0.20,
          rateText: '20%',
          superTaxText: 'Progressive Section 4C (0% up to 10% on income > 150M)',
          actMinTaxText: '17% ACT (Sec 113C) & 1.25% Min Tax (Sec 113)',
          compliancePoints: [
            'Annual Corporate Return by 31st December',
            'Quarterly Advance Tax under Section 147',
            'SECP statutory filing with small company disclosures'
          ]
        },
        {
          id: 'banking',
          name: 'Banking Companies',
          criteria: 'Scheduled Commercial Banks',
          rate: 0.39,
          rateText: '39%',
          superTaxText: '10% flat Super Tax (Section 4C)',
          actMinTaxText: 'Seventh Schedule Rules',
          compliancePoints: [
            'Seventh Schedule tax assessment',
            'Advance tax in 12 monthly installments',
            'Regulatory SBP and SECP prudential reporting'
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
            'SMEDA & FBR portal enrollment',
            'Option to elect 7.5% NTR on profit or 0.25% FTR on gross turnover',
            'Annual SME tax return by 31st December'
          ]
        },
        {
          id: 'sme_cat2',
          name: 'SMEs in Manufacturing — Category 2',
          criteria: 'Turnover between PKR 100 Million and PKR 250 Million',
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
          criteria: 'Registered Modarabas',
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
      desc: 'Corporate tax rates and statutory compliance for Tax Year 2024–2025 under the Income Tax Ordinance, 2001. Super Tax under Section 4C applies to high earners.',
      categories: [
        {
          id: 'general',
          name: 'General Companies',
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
      desc: 'The income tax rates for companies in Pakistan for Tax Year 2024 (TY 2023–2024) pursuant to Karachi Tax Bar / PwC / FBR Finance Act provisions.',
      categories: [
        {
          id: 'general',
          name: 'Public / Private / Other Companies (General)',
          criteria: 'Standard Corporate Companies (Image 3)',
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

  function updateBusinessCalculator() {
    const yearKey = bizTaxYear.value || '2026-2027';
    const catId = bizCategory.value || 'general';
    const profit = parseAmount(bizTaxableProfit.value);
    const turnover = parseAmount(bizTurnover.value);
    const acctProfitInput = parseAmount(bizAccountingProfit.value);
    const acctProfit = acctProfitInput > 0 ? acctProfitInput : profit;

    const yearData = BUSINESS_TAX_DATA[yearKey] || BUSINESS_TAX_DATA['2026-2027'];
    const activeCat = yearData.categories.find(c => c.id === catId) || yearData.categories[0];

    // Show/hide SME regime switcher
    if (catId === 'sme_cat1') {
      smeRegimeGroup.style.display = 'block';
    } else {
      smeRegimeGroup.style.display = 'none';
    }

    // Base Corporate Tax calculation
    let baseTax = 0;
    let baseTaxRateText = activeCat.rateText;
    let baseTaxSub = `${activeCat.rateText} Corporate Rate`;

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

    // Super Tax (Section 4C) calculation
    const superTaxRes = calculateSuperTax(profit, catId, yearKey);
    const superTaxAmount = (catId === 'sme_cat1' && activeSmeRegime === 'ftr') ? 0 : superTaxRes.tax;

    // Alternate Corporate Tax (ACT Sec 113C: 17%) & Minimum Tax (Sec 113: 1.25%)
    let actAmount = 0;
    let minTaxAmount = 0;
    let actStatus = 'Compliant';
    let actSub = 'Normal Tax Exceeds ACT & Min Tax';

    if (catId === 'sme_cat1' && activeSmeRegime === 'ftr') {
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
    if (catId !== 'banking' && !(catId === 'sme_cat1' && activeSmeRegime === 'ftr')) {
      effectiveBaseTax = Math.max(baseTax, actAmount, minTaxAmount);
    }
    const totalTaxLiability = effectiveBaseTax + superTaxAmount;
    const effectiveRate = profit > 0 ? (totalTaxLiability / profit) * 100 : 0;
    const pat = Math.max(0, profit - totalTaxLiability);

    // Update Result Card UI
    if (bizResYearBadge) bizResYearBadge.textContent = yearData.label;
    if (bizResCategoryTitle) bizResCategoryTitle.textContent = 'Corporate Tax Summary';
    if (bizResCategoryTag) bizResCategoryTag.textContent = `${activeCat.name} (${activeCat.rateText})`;

    // Hero metrics: PAT (Profit After Tax) and Total Tax Liability
    if (bizResPAT) bizResPAT.textContent = formatPKR(pat);
    if (bizResTotalTax) bizResTotalTax.textContent = formatPKR(totalTaxLiability);
    if (bizResTotalTaxSub) {
      bizResTotalTaxSub.textContent = superTaxAmount > 0 
        ? `Base Tax (${formatPKR(effectiveBaseTax)}) + Super Tax (${formatPKR(superTaxAmount)})` 
        : 'Flat Corporate Tax Liability';
    }

    // 4-Metrics Grid
    if (bizResEffectiveRate) bizResEffectiveRate.textContent = `${effectiveRate.toFixed(2)}%`;
    if (bizResRateSub) bizResRateSub.textContent = `On Net Taxable Profit (${formatPKR(profit)})`;
    if (bizResBaseTax) bizResBaseTax.textContent = formatPKR(effectiveBaseTax);
    if (bizResBaseTaxSub) bizResBaseTaxSub.textContent = baseTaxSub;
    if (bizResSuperTax) bizResSuperTax.textContent = formatPKR(superTaxAmount);
    if (bizResSuperTaxSub) bizResSuperTaxSub.textContent = superTaxRes.bracketText;
    
    // Status Badge for ACT / Min Tax
    if (bizResACTStatus) {
      bizResACTStatus.textContent = actStatus;
      let badgeClass = 'metric-badge-tag ';
      if (actStatus === 'Compliant') badgeClass += 'status-compliant';
      else if (actStatus === 'Exempt') badgeClass += 'status-special';
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

    // Highlight active Super Tax bracket in the schedule grid
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

    // Render Year-Wise Matrix Table
    renderBusinessMatrixTable(yearKey, catId);
  }

  function renderBusinessMatrixTable(yearKey, activeCatId) {
    const yearData = BUSINESS_TAX_DATA[yearKey] || BUSINESS_TAX_DATA['2026-2027'];
    if (bizMatrixTitle) bizMatrixTitle.textContent = `${yearData.label} Corporate Tax & Statutory Compliance Matrix`;
    if (bizMatrixDesc) bizMatrixDesc.textContent = yearData.desc;

    // Sync Year tabs
    bizYearTabs.forEach(tab => {
      const isCurrent = tab.getAttribute('data-bizyear') === yearKey;
      tab.classList.toggle('active', isCurrent);
      tab.setAttribute('aria-selected', isCurrent ? 'true' : 'false');
    });

    bizMatrixTableBody.innerHTML = '';
    yearData.categories.forEach(cat => {
      const tr = document.createElement('tr');
      const isSelected = cat.id === activeCatId;
      if (isSelected) {
        tr.className = 'active-slab-row';
      }

      // 1. Entity & Criteria
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

      // 2. Corporate Rate
      const tdRate = document.createElement('td');
      const rateStrong = document.createElement('strong');
      rateStrong.style.color = '#A31D24';
      rateStrong.textContent = cat.rateText;
      tdRate.appendChild(rateStrong);

      // 3. Super Tax
      const tdSuper = document.createElement('td');
      tdSuper.textContent = cat.superTaxText;

      // 4. ACT / Min Tax
      const tdAct = document.createElement('td');
      tdAct.textContent = cat.actMinTaxText;

      // 5. Compliance
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

  // Tax year change (updates matrix table view without auto-calculating)
  bizTaxYear.addEventListener('change', () => {
    renderBusinessMatrixTable(bizTaxYear.value, bizCategory.value);
  });

  // Category change (toggles SME regime pills without auto-calculating)
  bizCategory.addEventListener('change', () => {
    const catId = bizCategory.value;
    if (catId === 'sme_cat1') {
      smeRegimeGroup.style.display = 'block';
    } else {
      smeRegimeGroup.style.display = 'none';
    }
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
