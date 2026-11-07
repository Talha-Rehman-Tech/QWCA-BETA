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
        updateCalculator();
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
    updateCalculator();
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

    updateCalculator();
  });

  // Handle tax year dropdown change
  taxYearSelect.addEventListener('change', () => {
    updateCalculator();
  });

  // Calculate button click
  if (calculateBtn) {
    calculateBtn.addEventListener('click', () => {
      updateCalculator();
      const resultsEl = document.getElementById('calcResults');
      if (resultsEl && window.innerWidth < 768) {
        resultsEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  }

  // Slab table tabs
  slabTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const chosenYear = tab.getAttribute('data-year');
      if (chosenYear && TAX_DATA[chosenYear]) {
        taxYearSelect.value = chosenYear;
        updateCalculator();
      }
    });
  });

  // Initial render of presets & calculation on load
  const initialPeriod = salaryPeriodSelect ? salaryPeriodSelect.value : 'monthly';
  renderPresets(initialPeriod);
  updateCalculator();
})();
