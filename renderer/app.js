if (performance.navigation.type === 1) {
  sessionStorage.removeItem('excuseLog');
}

/*=============== SHOW SIDEBAR ===============*/
const showSidebar = (toggleId, sidebarId, headerId, mainId) => {
  const toggle = document.getElementById(toggleId),
    sidebar = document.getElementById(sidebarId),
    header = document.getElementById(headerId),
    main = document.getElementById(mainId);

  if (toggle && sidebar && header && main) {
    toggle.addEventListener('click', () => {
      sidebar.classList.toggle('show-sidebar');
      header.classList.toggle('left-pd');
      main.classList.toggle('left-pd');
    });
  }
};
showSidebar('header-toggle', 'sidebar', 'header', 'main');

/*=============== LINK ACTIVE ===============*/
const sidebarLink = document.querySelectorAll('.sidebar__list a');

function linkColor() {
  sidebarLink.forEach((l) => l.classList.remove('active-link'));
  this.classList.add('active-link');
}

sidebarLink.forEach((l) => l.addEventListener('click', linkColor));

/*=============== WACK SLIDER ===============*/
const slider = document.getElementById('wack-slider');
const wackValue = document.getElementById('wack-value');

function updateWackLabel(value) {
  wackValue.textContent = value;

  if (value <= 3) {
    wackValue.style.color = '#4caf50'; // green
  } else if (value <= 7) {
    wackValue.style.color = '#ff9800'; // orange
  } else {
    wackValue.style.color = '#f44336'; // red
  }
}

updateWackLabel(slider.value);

slider.addEventListener('input', () => {
  updateWackLabel(slider.value);
});

/*=============== EXCUSE GENERATION ===============*/

const generateBtn = document.getElementById('generate-btn');
const excuseText = document.getElementById('excuse-text');
const wifiIcon = document.getElementById('believability-icon');

let excusesDB = [];
let currentExcuse = null;

fetch('../excuses.json')
  .then((response) => response.json())
  .then((data) => {
    excusesDB = data;
  })
  .catch((err) => {
    console.error('Error loading excuses.json:', err);
  });

function getBelievabilityIcon(value) {
  if (value >= 75) return 'ph-wifi-high';
  if (value >= 50) return 'ph-wifi-medium';
  if (value >= 25) return 'ph-wifi-low';
  return 'ph-wifi-none';
}

generateBtn.addEventListener('click', () => {
  const wackLevel = parseInt(slider.value);

  const filteredExcuses = excusesDB.filter(
    (e) => e.wackometer === wackLevel
  );

  if (filteredExcuses.length === 0) {
    excuseText.textContent = 'No excuse found for this wackiness level.';
    wifiIcon.innerHTML = `<i class="ph-bold ph-wifi-x"></i>`;
    return;
  }

  const randomExcuse =
    filteredExcuses[Math.floor(Math.random() * filteredExcuses.length)];

  excuseText.textContent = `"${randomExcuse.excuse}"`;

  const iconClass = getBelievabilityIcon(randomExcuse.believability);
  wifiIcon.innerHTML = `<i class="ph-bold ${iconClass}"></i>`;

  currentExcuse = randomExcuse;
  // localStorage.setItem('lastExcuse', JSON.stringify(currentExcuse));
  localStorage.setItem('lastExcuse', JSON.stringify({ excuse: randomExcuse, sliderValue: wackLevel, }));


  const logContainer = document.getElementById('log-container');
  const now = new Date();
  const timestamp = `[${now.toLocaleTimeString('en-US', { hour12: false })}]`;


  const logEntry = document.createElement('p');
  logEntry.className = 'log-entry';
  logEntry.innerHTML = `<span class="timestamp">${timestamp}</span> ${randomExcuse.excuse}`;
  logContainer.prepend(logEntry);

  const existingLogs = JSON.parse(sessionStorage.getItem('excuseLog')) || [];
  existingLogs.unshift({
    timestamp,
    excuse: randomExcuse.excuse
  });
  sessionStorage.setItem('excuseLog', JSON.stringify(existingLogs));

});

/*=============== UPDATING COPY/SAVE BTNS ===============*/

const copyBtn = document.getElementById('copy-btn');

const copy_originalHTML = copyBtn.innerHTML;

copyBtn.addEventListener('click', () => {
  const text = excuseText.textContent.replace(/"/g, '');

  navigator.clipboard.writeText(text)
    .then(() => {
      copyBtn.innerHTML = 'Copied!';

      setTimeout(() => {
        copyBtn.innerHTML = copy_originalHTML;
      }, 1500);
    })
    .catch(err => {
      console.error('Copy failed:', err);
      copyBtn.innerHTML = 'Error';
    });
});


window.addEventListener('DOMContentLoaded', () => {
  const logContainer = document.getElementById('log-container');
  const storedLogs = JSON.parse(sessionStorage.getItem('excuseLog')) || [];

  storedLogs.forEach(({ timestamp, excuse }) => {
    const p = document.createElement('p');
    p.className = 'log-entry';
    p.innerHTML = `<span class="timestamp">${timestamp}</span> ${excuse}`;
    logContainer.appendChild(p);
  });
});


const saveBtn = document.getElementById('save-btn');
const save_originalHTML = saveBtn.innerHTML;

saveBtn.addEventListener('click', () => {
  if (!currentExcuse) {
    alert('Generate an excuse before saving!');
    return;
  }

  const saved = JSON.parse(localStorage.getItem('savedExcuses')) || [];
  saved.push(currentExcuse);
  localStorage.setItem('savedExcuses', JSON.stringify(saved));

  saveBtn.textContent = 'Saved!';
  setTimeout(() => {
    saveBtn.innerHTML = save_originalHTML;
  }, 1500);
});


/*=============== LOADING LAST GENERATED EXCUSE ===============*/

window.addEventListener('DOMContentLoaded', () => {
  // const last = localStorage.getItem('lastExcuse');
  if (currentExcuse) {
    const excuse = JSON.parse(last);
    excuseText.textContent = `"${excuse.excuse}"`;

    const iconClass = getBelievabilityIcon(excuse.believability);
    wifiIcon.innerHTML = `<i class="ph-bold ${iconClass}"></i>`;

    currentExcuse = excuse;
  }
});

window.addEventListener('DOMContentLoaded', () => {
  if (!currentExcuse) {
    const lastExcuse = localStorage.getItem('lastExcuse');
    if (lastExcuse) {
      try {
        const parsed = JSON.parse(lastExcuse);
        currentExcuse = parsed;
        excuseText.textContent = `"${parsed.excuse}"`;
        const iconClass = getBelievabilityIcon(parsed.believability);
        wifiIcon.innerHTML = `<i class="ph-bold ${iconClass}"></i>`;
      } catch (e) {
        console.error('Error parsing lastExcuse from localStorage:', e);
      }
    }
  }
});

window.addEventListener('DOMContentLoaded', () => {
  const lastState = localStorage.getItem('lastExcuse');
  if (lastState) {
    try {
      const parsed = JSON.parse(lastState);
      const { excuse, sliderValue } = parsed;

      currentExcuse = excuse;

      excuseText.textContent = `"${excuse.excuse}"`;

      const iconClass = getBelievabilityIcon(excuse.believability);
      wifiIcon.innerHTML = `<i class="ph-bold ${iconClass}"></i>`;

      slider.value = sliderValue;
      updateWackLabel(sliderValue);

    } catch (err) {
      console.error('Failed to parse lastExcuse from localStorage:', err);
    }
  }
});

/*=============== FOOTER TOGGLE ===============*/

const footerToggleBtn = document.getElementById('footer-toggle');
const termsFooter = document.getElementById('terms-footer');

footerToggleBtn.addEventListener('click', () => {
  termsFooter.classList.toggle('show');

  const icon = footerToggleBtn.querySelector('i');
  if (termsFooter.classList.contains('show')) {
    footerToggleBtn.innerHTML = '<i class="ri-arrow-up-s-line"></i> Hide Terms of Excusiveness';
  } else {
    footerToggleBtn.innerHTML = '<i class="ri-arrow-down-s-line"></i> Show Terms of Excusiveness';
  }
});
