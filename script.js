/* ==========================================================================
   YANTRA MANAVA - DARK MATRIX JAVASCRIPT CONTROLLER
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================================================
  // 1. MATRIX DIGITAL RAIN ENGINE (WITH INTERACTIVE TOUCH & MOUSE)
  // ==========================================================================
  const canvas = document.getElementById('matrix-canvas');
  const ctx = canvas ? canvas.getContext('2d') : null;
  const rainZone = document.getElementById('matrix-rain-zone');

  let animationId = null;
  let isRainActive = true;

  // Set canvas size matching the rain zone
  function resizeCanvas() {
    if (!canvas) return;
    const parent = rainZone || canvas.parentElement || document.body;
    canvas.width = parent.offsetWidth || window.innerWidth;
    canvas.height = parent.offsetHeight || 750;
  }
  resizeCanvas();

  // Multilingual Indian Scripts (Devanagari, Kannada, Tamil, Telugu, Bengali, Malayalam) + Cyber Symbols
  const matrixChars = 'अआइईउऊऋएऐओऔकखगघङचछजझञटठडढणतथदधनपफबभमयरलवशषसह०१२३४५६७८९ಅಆಇಈಉಊಋಎಏಐಒಓಔಕಖಗಘಙಚಛಜಝಞಟಠಡಢಣತಥದಧನಪಫಬಭಮಯರಲವಶಷಸಹಳஅஆஇஈஉஊஎஏஐஒஓஔகஙசஞடணதநபமயரலவழளறனఅఆఇఈఉఊఋఎఏఐఒఓఔకఖగఘఙచఛజఝఞటఠడఢణతథదధనపఫబభమయരലവശഷസഹ0123456789010101<>/{}[];:*#@!';
  const fontSize = 16;
  let columns = canvas ? Math.floor(canvas.width / fontSize) : 0;
  let drops = [];
  let touchRipples = [];

  function initDrops() {
    if (!canvas) return;
    columns = Math.floor(canvas.width / fontSize);
    drops = [];
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100;
    }
  }
  initDrops();

  window.addEventListener('resize', () => {
    resizeCanvas();
    initDrops();
  });

  // Interactive Touch & Cursor Handler
  function handleRainTouch(clientX, clientY) {
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    if (x < 0 || x > canvas.width || y < 0 || y > canvas.height) return;

    const col = Math.floor(x / fontSize);
    const row = Math.floor(y / fontSize);

    // Trigger matrix drops at touched column & adjacent columns
    for (let offset = -2; offset <= 2; offset++) {
      const c = col + offset;
      if (c >= 0 && c < columns) {
        drops[c] = row + Math.random() * 2 - 1;
      }
    }

    // Add glowing touch burst particle
    for (let i = 0; i < 3; i++) {
      touchRipples.push({
        x: x + (Math.random() * 30 - 15),
        y: y + (Math.random() * 20 - 10),
        char: matrixChars.charAt(Math.floor(Math.random() * matrixChars.length)),
        alpha: 1.0,
        vy: Math.random() * 3 + 1,
        color: Math.random() > 0.3 ? '#ffffff' : '#00ff66'
      });
    }
  }

  if (canvas) {
    canvas.addEventListener('mousemove', (e) => {
      handleRainTouch(e.clientX, e.clientY);
    });

    canvas.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches[0]) {
        handleRainTouch(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    canvas.addEventListener('touchstart', (e) => {
      if (e.touches && e.touches[0]) {
        handleRainTouch(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    canvas.addEventListener('click', (e) => {
      handleRainTouch(e.clientX, e.clientY);
    });
  }

  function drawMatrixRain() {
    if (!canvas || !ctx) return;
    // Semi-transparent background fade effect
    ctx.fillStyle = 'rgba(4, 7, 6, 0.08)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = `${fontSize}px 'Share Tech Mono', monospace`;

    for (let i = 0; i < drops.length; i++) {
      const text = matrixChars.charAt(Math.floor(Math.random() * matrixChars.length));
      
      // Randomly color leading character WHITE, trailing characters MATRIX GREEN
      const isLead = Math.random() > 0.88;
      
      if (isLead) {
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 8;
      } else {
        ctx.fillStyle = 'rgba(0, 255, 102, 0.65)';
        ctx.shadowColor = 'rgba(0, 255, 102, 0.4)';
        ctx.shadowBlur = 4;
      }

      ctx.fillText(text, i * fontSize, drops[i] * fontSize);
      ctx.shadowBlur = 0;

      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }

      drops[i]++;
    }

    // Render Touch Burst Particles
    for (let i = touchRipples.length - 1; i >= 0; i--) {
      const p = touchRipples[i];
      ctx.fillStyle = p.color === '#ffffff' ? `rgba(255, 255, 255, ${p.alpha})` : `rgba(0, 255, 102, ${p.alpha})`;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 10;
      ctx.font = `${fontSize * 1.25}px 'Share Tech Mono', monospace`;
      ctx.fillText(p.char, p.x, p.y);
      ctx.shadowBlur = 0;

      p.alpha -= 0.03;
      p.y += p.vy;
      if (p.alpha <= 0) {
        touchRipples.splice(i, 1);
      }
    }

    if (isRainActive) {
      animationId = requestAnimationFrame(drawMatrixRain);
    }
  }

  drawMatrixRain();

  // Mini Host Card Matrix Rain Engine
  const hostCanvas = document.getElementById('host-matrix-canvas');
  const hostCtx = hostCanvas ? hostCanvas.getContext('2d') : null;

  if (hostCanvas && hostCtx) {
    function resizeHostCanvas() {
      hostCanvas.width = hostCanvas.offsetWidth || 360;
      hostCanvas.height = hostCanvas.offsetHeight || 440;
    }
    resizeHostCanvas();

    const hostFontSize = 14;
    const hostCols = Math.floor((hostCanvas.width || 360) / hostFontSize);
    const hostDrops = [];
    for (let i = 0; i < hostCols; i++) {
      hostDrops[i] = Math.random() * -30;
    }

    function drawHostMatrixRain() {
      hostCtx.fillStyle = 'rgba(4, 7, 6, 0.12)';
      hostCtx.fillRect(0, 0, hostCanvas.width, hostCanvas.height);
      hostCtx.font = `${hostFontSize}px 'Share Tech Mono', monospace`;

      for (let i = 0; i < hostDrops.length; i++) {
        const text = matrixChars.charAt(Math.floor(Math.random() * matrixChars.length));
        const isWhite = Math.random() > 0.85;

        hostCtx.fillStyle = isWhite ? '#ffffff' : 'rgba(0, 255, 102, 0.75)';
        hostCtx.fillText(text, i * hostFontSize, hostDrops[i] * hostFontSize);

        if (hostDrops[i] * hostFontSize > hostCanvas.height && Math.random() > 0.95) {
          hostDrops[i] = 0;
        }
        hostDrops[i]++;
      }
      requestAnimationFrame(drawHostMatrixRain);
    }
    drawHostMatrixRain();
  }

  // Matrix Rain Toggle Button
  const rainToggleBtn = document.getElementById('rain-toggle');
  const rainStatus = document.getElementById('rain-status');

  if (rainToggleBtn) {
    rainToggleBtn.addEventListener('click', () => {
      isRainActive = !isRainActive;
      if (isRainActive) {
        rainStatus.textContent = 'ON';
        rainToggleBtn.classList.add('active');
        drawMatrixRain();
      } else {
        rainStatus.textContent = 'OFF';
        rainToggleBtn.classList.remove('active');
        if (animationId) cancelAnimationFrame(animationId);
        if (ctx && canvas) ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    });
  }

  // ==========================================================================
  // 2. CRT SCANLINES TOGGLE
  // ==========================================================================
  const crtOverlay = document.getElementById('crt-overlay');
  const scanlineToggleBtn = document.getElementById('scanline-toggle');
  const crtStatus = document.getElementById('crt-status');

  if (scanlineToggleBtn && crtOverlay) {
    scanlineToggleBtn.addEventListener('click', () => {
      crtOverlay.classList.toggle('disabled');
      const isEnabled = !crtOverlay.classList.contains('disabled');
      crtStatus.textContent = isEnabled ? 'ON' : 'OFF';
      scanlineToggleBtn.classList.toggle('active', isEnabled);
    });
  }

  // ==========================================================================
  // 3. SCRAMBLED TEXT DECODER ANIMATION
  // ==========================================================================
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789ಅಆಇಈಉಊಕಖಗಘಙಚಛಜಝ";

  function runTextDecoder(element) {
    const originalText = element.dataset.value || element.innerText;
    let iteration = 0;
    
    clearInterval(element.interval);

    element.interval = setInterval(() => {
      element.innerText = originalText
        .split("")
        .map((char, index) => {
          if (char === " " || char === "/" || char === "[" || char === "]") return char;
          if (index < iteration) {
            return originalText[index];
          }
          return letters[Math.floor(Math.random() * letters.length)];
        })
        .join("");

      if (iteration >= originalText.length) {
        clearInterval(element.interval);
      }

      iteration += 1 / 2;
    }, 30);
  }

  // Run initial decoder on Hero Title
  const mainTitle = document.getElementById('main-title');
  if (mainTitle) {
    runTextDecoder(mainTitle);
    mainTitle.addEventListener('mouseover', () => runTextDecoder(mainTitle));
  }

  // Run decoder effect on section headings on hover
  document.querySelectorAll('.hud-heading').forEach(heading => {
    heading.addEventListener('mouseenter', () => runTextDecoder(heading));
  });

  // ==========================================================================
  // 4. INTERACTIVE MATRIX TERMINAL SHELL
  // ==========================================================================
  const terminalForm = document.getElementById('terminal-form');
  const terminalInput = document.getElementById('terminal-input');
  const terminalOutput = document.getElementById('terminal-output');
  const terminalBody = document.getElementById('terminal-body');
  const cmdPills = document.querySelectorAll('.cmd-pill');

  const commandHistory = [];
  let historyIndex = -1;

  const COMMANDS = {
    help: `Available commands:
  • help       : Display available commands & system usage
  • about      : Learn about Yantra Manava tech portal architecture
  • episodes   : View latest technology dispatches & modules
  • India      : India's digital public infrastructure & space missions
  • karnataka  : Karnataka technology ecosystem & Silicon Hub facts
  • World      : Global semiconductor landscape & tech alliances
  • clear      : Clear terminal screen output
  • date       : Display current UTC system time`,

    about: `YANTRA MANAVA // PORTAL ARCHITECTURE
--------------------------------------------------
Mission    : India's Premier All-in-One Technology Portal.
Core Focus : Semiconductor Fabs, Silicon Valleys, Indic LLMs & Multilingual AI, ISRO Space Missions, UPI, and Quantum Infrastructure.
Host       : Chief Tech Storyteller @ Yantra Manava.`,

    episodes: `LATEST TECH DISPATCHES & MODULES:
--------------------------------------------------
[YM#TECH-042]   How India Built Asia's Silicon Hub: Semiconductor & Chipset Archives
[YM#AI-039]     Indic Language LLMs & Multilingual Generative AI Frontiers
[YM#AERO-035]   India's Aerospace Legacy: ISRO, HAL, Skyroot & Private Rocketry
[YM#CYBER-028]  Quantum Cryptography & Smart Grid Security in India
[YM#STARTUP-022] The Hardware & Robotics Revolution: National Industrial Corridors
[YM#CLEAN-015]  Next-Gen Renewable Tech & Electric Mobility Supergrids in India`,

    instagram: `INSTAGRAM CHANNEL:
--------------------------------------------------
Handle : @yantra_manava
URL    : https://www.instagram.com/yantra_manava/
Bio    : Karnataka's Premier Technology Portal! 📍 Bengaluru, India`,

    karnataka: `KARNATAKA TECHNOLOGY ECOSYSTEM:
--------------------------------------------------
• Silicon Capital : Bengaluru drives over 40% of India's IT & software exports.
• Global R&D Hub  : 400+ Fortune 500 tech & semiconductor innovation centers.
• Fab & VLSI      : Mysuru & Bengaluru lead India's chip design ecosystem.
• Space & Defense : ISRO HQ, HAL, NAL & 65% of India's aerospace manufacturing.
• AI & Startups   : Home to 40+ Tech Unicorns and native Indic AI research.`,

    india: `INDIA DIGITAL INFRASTRUCTURE & TECH FRONTIERS:
--------------------------------------------------
• UPI & India Stack: Processing 13+ Billion digital transactions monthly.
• India Semiconductor Mission: $10B+ chip design & packaging initiative.
• Space Program: Gaganyaan Human Spaceflight & Chandrayaan lunar missions.
• Digital Public Goods: Aadhaar, CoWIN, ONDC, and Open Energy Grids.`,

    world: `GLOBAL TECH LANDSCAPE & ALLIANCES:
--------------------------------------------------
• Semiconductors  : Sub-2nm nodes driving AI accelerators worldwide.
• Generative AI   : Multi-modal frontier models transforming industries.
• Quantum Leap    : 1000+ qubit systems testing QKD secure communications.
• Global Supply   : Indo-Pacific tech corridors & cross-border innovation.`,

    date: () => `SYSTEM TIME: ${new Date().toUTCString()}`
  };

  // Case aliases
  COMMANDS.stories = COMMANDS.episodes;
  COMMANDS.India = COMMANDS.india;
  COMMANDS.World = COMMANDS.world;

  function handleCommand(cmdText) {
    const raw = cmdText.trim();
    if (!raw) return;

    commandHistory.push(raw);
    historyIndex = commandHistory.length;

    // Append user input line
    const userLine = document.createElement('div');
    userLine.className = 'term-line';
    userLine.innerHTML = `<span class="prompt-user">guest@yantra-manava</span>:<span class="prompt-path">~</span>$&nbsp;<span class="term-user-cmd">${escapeHTML(raw)}</span>`;
    terminalOutput.appendChild(userLine);

    const lower = raw.toLowerCase();

    if (lower === 'clear') {
      terminalOutput.innerHTML = '';
    } else if (COMMANDS[raw] || COMMANDS[lower]) {
      const resp = COMMANDS[raw] || COMMANDS[lower];
      const outputText = typeof resp === 'function' ? resp() : resp;
      const respLine = document.createElement('div');
      respLine.className = 'term-line term-response';
      respLine.textContent = outputText;
      terminalOutput.appendChild(respLine);
    } else {
      const errLine = document.createElement('div');
      errLine.className = 'term-line term-response';
      errLine.style.color = '#ef4444';
      errLine.textContent = `command not found: '${raw}'. Type 'help' for available commands.`;
      terminalOutput.appendChild(errLine);
    }

    if (terminalBody) {
      terminalBody.scrollTop = terminalBody.scrollHeight;
    }
  }

  function escapeHTML(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  if (terminalForm && terminalInput) {
    terminalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = terminalInput.value;
      terminalInput.value = '';
      handleCommand(val);
    });

    terminalInput.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowUp') {
        if (historyIndex > 0) {
          historyIndex--;
          terminalInput.value = commandHistory[historyIndex] || '';
        }
        e.preventDefault();
      } else if (e.key === 'ArrowDown') {
        if (historyIndex < commandHistory.length - 1) {
          historyIndex++;
          terminalInput.value = commandHistory[historyIndex] || '';
        } else {
          historyIndex = commandHistory.length;
          terminalInput.value = '';
        }
        e.preventDefault();
      }
    });
  }

  if (terminalBody) {
    terminalBody.addEventListener('click', () => {
      if (terminalInput) terminalInput.focus();
    });
  }

  cmdPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const cmd = pill.getAttribute('data-cmd');
      if (cmd) {
        if (terminalInput) terminalInput.value = cmd;
        handleCommand(cmd);
      }
    });
  });

  // ==========================================================================
  // 5. STORY CATEGORY FILTERING SYSTEM
  // ==========================================================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const storyCards = document.querySelectorAll('.story-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      storyCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            if (card.style.opacity === '0') {
              card.style.display = 'none';
            }
          }, 200);
        }
      });
    });
  });

  // ==========================================================================
  // 6. NEWSLETTER FORM HANDLER
  // ==========================================================================
  const newsletterForm = document.getElementById('newsletter-form');
  const emailInput = document.getElementById('subscriber-email');
  const formToast = document.getElementById('form-toast');

  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = emailInput.value.trim();

      if (email) {
        formToast.className = 'form-toast success';
        formToast.innerHTML = `[SYS_MSG: 200 SUCCESS] &gt; <strong>${email}</strong> HAS BEEN ENROLLED IN THE YANTRA MANAVA TECH INSIDER NETWORK.`;
        emailInput.value = '';

        setTimeout(() => {
          formToast.innerHTML = '';
        }, 5000);
      }
    });
  }

  // ==========================================================================
  // 7. REALTIME SYSTEM CLOCK
  // ==========================================================================
  const sysClock = document.getElementById('sys-clock');

  function updateClock() {
    if (!sysClock) return;
    const now = new Date();
    const timeString = now.toUTCString().replace('GMT', 'UTC');
    sysClock.textContent = `SYSTEM TIME: ${timeString.split(' ').slice(4).join(' ')} UTC`;
  }

  setInterval(updateClock, 1000);
  updateClock();

  // ==========================================================================
  // 8. MOBILE MENU TOGGLE
  // ==========================================================================
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const navLinks = document.getElementById('nav-links');

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      const isExpanded = navLinks.style.display === 'flex';
      navLinks.style.display = isExpanded ? 'none' : 'flex';
      if (!isExpanded) {
        navLinks.style.position = 'absolute';
        navLinks.style.top = '100%';
        navLinks.style.left = '0';
        navLinks.style.width = '100%';
        navLinks.style.background = 'rgba(4, 7, 6, 0.95)';
        navLinks.style.flexDirection = 'column';
        navLinks.style.padding = '1.5rem';
        navLinks.style.borderBottom = '1px solid var(--hud-border)';
      }
    });
  }

});

