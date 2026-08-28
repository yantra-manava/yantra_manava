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
  // ==========================================================================
  // 9. INDIAN LANGUAGES MULTI-LANGUAGE TRANSLATION ENGINE
  // ==========================================================================
  const langSelector = document.getElementById('lang-selector');

  const translations = {
    en: {
      welcomeHome: 'WELCOME HOME',
      heroTag: 'INDIA DIGITAL PUBLIC INFRASTRUCTURE',
      heroTitle: 'INDIA\'S ALL-IN-ONE TECHNOLOGY PORTAL',
      heroSub: 'Decoding Useful Tech & AI Tools to Create / Build What You Want',
      ctaMatrix: '<span class="btn-bracket">&lt;</span> ENTER THE MATRIX <span class="btn-bracket">&gt;</span>',
      ctaNewsletter: 'INSIDER DISPATCHES',
      aboutHeading: '// DECODING USEFUL TECH & AI',
      missionTag: '> MISSION_STATEMENT',
      missionTitle: 'Lead India\'s AI Revolution & Tech Literacy',
      missionP1: 'Welcome to <strong>Yantra Manava</strong> — your hub for decoding practical technology and cutting-edge AI tools. We break down modern AI models, creator tools, low-code development platforms, and everyday tech workflows so you can build, automate, and bring your ideas to life.',
      missionP2: 'From mastering generative AI tools and AI agents to driving widespread <strong>AI Literacy</strong> across India, tracking <strong>Tech Progression</strong>, and following India\'s rapid <strong>EV Revolution</strong>—Yantra Manava equips creators, students, developers, and entrepreneurs with actionable tech knowledge.',
      focusToolsTitle: 'Useful AI Tools',
      focusToolsSub: 'AI agents, prompt engineering & builder tech',
      focusLiteracyTitle: 'AI Literacy India',
      focusLiteracySub: 'Empowering students & creators across India',
      focusEvTitle: 'EV Revolution',
      focusEvSub: 'Electric mobility, smart battery & charging grids',
      focusTechTitle: 'Tech Progression',
      focusTechSub: 'Modern dev workflows, automation & building',
      stackTitle: 'MODERN AI TOOLS & BUILDER STACK',
      newsTitle: 'TOP USEFUL TECH & AI DISPATCHES',
      news1Title: 'National AI Literacy Drive Reaches 5M Students & Builders with Free Hands-on AI Toolkits',
      news1Summary: 'Government and tech ecosystem initiatives launch interactive AI workflows, prompt engineering modules, and multilingual AI builder tools across 12 Indian languages.',
      news2Title: 'India\'s EV Revolution Surges as Native Smart Scooters & Fast Battery Swapping Infra Reach 100+ Cities',
      news2Summary: 'Domestic EV makers deploy AI-optimized battery management systems (BMS) and smart charging networks across urban hubs and national highways.',
      news3Title: 'Next-Gen AI Coding Assistants & Autonomous Agents Empower Solo Creators to Build Full-Stack Apps',
      news3Summary: 'Breakthroughs in multi-agent orchestration and natural language software builders reduce full-stack web app development times from weeks to minutes.',
      news4Title: 'Multimodal Creator Tools Democratize Real-Time Video Synthesis, 3D Assets, and Design',
      news4Summary: 'Generative UI and design automation platforms enable creators worldwide to produce studio-grade visuals and web applications with simple text prompts.',
      newsletterTitle: 'JOIN THE YANTRA MANAVA INSIDER DISPATCH',
      newsletterSub: 'Receive weekly breakdowns of useful AI tools, builder tutorials, EV updates, and tech literacy guides delivered straight to your terminal inbox.',
      transmitBtn: '<span class="btn-bracket">&lt;</span> TRANSMIT <span class="btn-bracket">&gt;</span>'
    },
    hi: {
      welcomeHome: 'स्वागत है',
      heroTag: 'भारत डिजिटल पब्लिक इंफ्रास्ट्रक्चर',
      heroTitle: 'भारत का ऑल-इन-वन टेक्नोलॉजी पोर्टल',
      heroSub: 'उपयोगी टेक और एआई टूल्स को समझें और जो चाहें वो बनाएं',
      ctaMatrix: '<span class="btn-bracket">&lt;</span> मैट्रिक्स में प्रवेश करें <span class="btn-bracket">&gt;</span>',
      ctaNewsletter: 'इंसाइडर समाचार',
      aboutHeading: '// उपयोगी टेक और एआई डिकोडिंग',
      missionTag: '> मिशन_स्टेटमेंट',
      missionTitle: 'भारत की एआई क्रांति और टेक साक्षरता का नेतृत्व',
      missionP1: '<strong>यंत्र मानव</strong> में आपका स्वागत है — व्यावहारिक तकनीक और आधुनिक एआई टूल्स को समझने का आपका केंद्र। हम आधुनिक एआई मॉडल, क्रिएटर टूल्स और ऑटोमेशन वर्कफ़्लो को सरल बनाते हैं ताकि आप अपने विचारों को साकार कर सकें।',
      missionP2: 'एआई टूल्स में महारत हासिल करने से लेकर पूरे भारत में <strong>एआई साक्षरता</strong> को बढ़ावा देने, <strong>टेक प्रगति</strong> और <strong>ईवी क्रांति</strong> को ट्रैक करने तक—यंत्र मानव छात्रों और डेवलपर्स को उपयोगी ज्ञान प्रदान करता है।',
      focusToolsTitle: 'उपयोगी एआई टूल्स',
      focusToolsSub: 'एआई एजेंट्स, प्रॉम्प्ट इंजीनियरिंग और बिल्डर तकनीक',
      focusLiteracyTitle: 'एआई साक्षरता भारत',
      focusLiteracySub: 'भारत भर में छात्रों और रचनाकारों को सशक्त बनाना',
      focusEvTitle: 'ईवी क्रांति',
      focusEvSub: 'इलेक्ट्रिक वाहन, स्मार्ट बैटरी और चार्जिंग ग्रिड',
      focusTechTitle: 'टेक प्रगति',
      focusTechSub: 'आधुनिक देव वर्कफ़्लो, स्वचालन और निर्माण',
      stackTitle: 'आधुनिक एआई टूल्स और बिल्डर स्टैक',
      newsTitle: 'शीर्ष उपयोगी टेक और एआई समाचार',
      news1Title: 'राष्ट्रीय एआई साक्षरता अभियान ने 50 लाख छात्रों और बिल्डरों को मुफ्त एआई टूलकिट प्रदान की',
      news1Summary: 'सरकारी और टेक पहलों ने 12 भारतीय भाषाओं में इंटरैक्टिव एआई वर्कफ़्लो और बहुभाषी एआई टूल्स लॉन्च किए।',
      news2Title: 'भारत की ईवी क्रांति का विस्तार: 100+ शहरों में स्मार्ट स्कूटर और फास्ट बैटरी स्वैपिंग इंफ्रा उपलब्ध',
      news2Summary: 'स्वदेशी ईवी निर्माताओं ने शहरों और राजमार्गों पर एआई-अनुकूलित बैटरी प्रबंधन और चार्जिंग नेटवर्क तैनात किए।',
      news3Title: 'नेक्स्ट-जेन एआई कोडिंग असिस्टेंट्स ने सोलो क्रिएटर्स को फुल-स्टैक ऐप्स बनाने में सक्षम बनाया',
      news3Summary: 'मल्टी-एजेंट ऑकेस्ट्रेशन और प्राकृतिक भाषा सॉफ्टवेयर बिल्डरों ने ऐप विकास समय को हफ्तों से घटाकर मिनटों में बदल दिया।',
      news4Title: 'मल्टीमॉडल क्रिएटर टूल्स ने रियल-टाइम वीडियो और 3डी डिज़ाइन का लोकतंत्रीकरण किया',
      news4Summary: 'जेनेरेटिव यूआई और डिज़ाइन ऑटोमेशन प्लेटफॉर्म अब दुनिया भर के रचनाकारों को टेक्स्ट प्रॉम्प्ट से ऐप बनाने में सक्षम बनाते हैं।',
      newsletterTitle: 'यंत्र मानव इंसाइडर नेटवर्क से जुड़ें',
      newsletterSub: 'उपयोगी एआई टूल्स, बिल्डर ट्यूटोरियल, ईवी अपडेट और टेक गाइड हर हफ्ते अपने इनबॉक्स में प्राप्त करें।',
      transmitBtn: '<span class="btn-bracket">&lt;</span> भेजें <span class="btn-bracket">&gt;</span>'
    },
    kn: {
      welcomeHome: 'ಸ್ವಾಗತ',
      heroTag: 'ಭಾರತ ಡಿಜಿಟಲ್ ಸಾರ್ವಜನಿಕ ಮೂಲಸೌಕರ್ಯ',
      heroTitle: 'ಭಾರತದ ಆಲ್-ಇನ್-ಒನ್ ತಂತ್ರಜ್ಞಾನ ಪೋರ್ಟಲ್',
      heroSub: 'ನಿಮಗೆ ಬೇಕಾದುದನ್ನು ನಿರ್ಮಿಸಲು ಉಪಯುಕ್ತ ತಂತ್ರಜ್ಞಾನ ಮತ್ತು ಎಐ ಪರಿಕರಗಳನ್ನು ಅರ್ಥೈಸಿಕೊಳ್ಳಿ',
      ctaMatrix: '<span class="btn-bracket">&lt;</span> ಮ್ಯಾಟ್ರಿಕ್ಸ್ ಪ್ರವೇಶಿಸಿ <span class="btn-bracket">&gt;</span>',
      ctaNewsletter: 'ಇನ್‌ಸೈಡರ್ ಸುದ್ದಿಗಳು',
      aboutHeading: '// ಉಪಯುಕ್ತ ತಂತ್ರಜ್ಞಾನ ಮತ್ತು ಎಐ ಡಿಕೋಡಿಂಗ್',
      missionTag: '> ಮಿಷನ್_ಸ್ಟೇಟ್‌ಮೆಂಟ್',
      missionTitle: 'ಭಾರತದ ಎಐ ಕ್ರಾಂತಿ ಮತ್ತು ತಾಂತ್ರಿಕ ಸಾಕ್ಷರತೆಯ ನೇತೃತ್ವ',
      missionP1: '<strong>ಯಂತ್ರ ಮಾನವ</strong>ಗೆ ಸುಸ್ವಾಗತ — ಪ್ರಾಯೋಗಿಕ ತಂತ್ರಜ್ಞಾನ ಮತ್ತು ಆಧುನಿಕ ಎಐ ಪರಿಕರಗಳನ್ನು ಅರ್ಥೈಸಿಕೊಳ್ಳುವ ನಿಮ್ಮ ಕೇಂದ್ರ। ನಾವು ಆಧುನಿಕ ಎಐ ಮಾದರಿಗಳು ಮತ್ತು ಆಟೋಮೇಷನ್ ಪರಿಕರಗಳನ್ನು ಸರಳಗೊಳಿಸುತ್ತೇವೆ.',
      missionP2: 'ಎಐ ಪರಿಕರಗಳನ್ನು ಕಲಿಯುವುದರಿಂದ ಹಿಡಿದು ಭಾರತದಾದ್ಯಂತ <strong>ಎಐ ಸಾಕ್ಷರತೆ</strong>, <strong>ತಂತ್ರಜ್ಞಾನ ಪ್ರಗತಿ</strong> ಮತ್ತು <strong>ಇವಿ ಕ್ರಾಂತಿ</strong>ಯನ್ನು ಬೆಂಬಲಿಸುವವರೆಗೆ—ಯಂತ್ರ ಮಾನವ ವಿದ್ಯಾರ್ಥಿಗಳು ಮತ್ತು ಡೆವಲಪರ್‌ಗಳಿಗೆ ಜ್ಞಾನವನ್ನು ನೀಡುತ್ತದೆ.',
      focusToolsTitle: 'ಉಪಯುಕ್ತ ಎಐ ಪರಿಕರಗಳು',
      focusToolsSub: 'ಎಐ ಏಜೆಂಟ್‌ಗಳು, ಪ್ರಾಂಪ್ಟ್ ಎಂಜಿನಿಯರಿಂಗ್ ಮತ್ತು ಬಿಲ್ಡರ್ ತಂತ್ರಜ್ಞಾನ',
      focusLiteracyTitle: 'ಎಐ ಸಾಕ್ಷರತೆ ಭಾರತ',
      focusLiteracySub: 'ಭಾರತದಾದ್ಯಂತ ವಿದ್ಯಾರ್ಥಿಗಳನ್ನು ಸಶಕ್ತಗೊಳಿಸುವುದು',
      focusEvTitle: 'ಇವಿ ಕ್ರಾಂತಿ',
      focusEvSub: 'ಎಲೆಕ್ಟ್ರಿಕ್ ವಾಹನಗಳು, ಸ್ಮಾರ್ಟ್ ಬ್ಯಾಟರಿ ಮತ್ತು ಚಾರ್ಜಿಂಗ್ ನೆಟ್‌ವರ್ಕ್',
      focusTechTitle: 'ತಂತ್ರಜ್ಞಾನ ಪ್ರಗತಿ',
      focusTechSub: 'ಆಧುನಿಕ ಡೆವಲಪ್‌ಮೆಂಟ್ ವರ್ಕ್‌ಫ್ಲೋ ಮತ್ತು ಆಟೋಮೇಷನ್',
      stackTitle: 'ಆಧುನಿಕ ಎಐ ಉಪಕರಣಗಳು ಮತ್ತು ಬಿಲ್ಡರ್ ಸ್ಟ್ಯಾಕ್',
      newsTitle: 'ಪ್ರಮುಖ ಉಪಯುಕ್ತ ತಂತ್ರಜ್ಞಾನ ಮತ್ತು ಎಐ ವರದಿಗಳು',
      news1Title: 'ರಾಷ್ಟ್ರೀಯ ಎಐ ಸಾಕ್ಷರತಾ ಅಭಿಯಾನ: 50 ಲಕ್ಷ ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ಉಚಿತ ಎಐ ಟೂಲ್‌ಕಿಟ್',
      news1Summary: 'ಸರ್ಕಾರಿ ಮತ್ತು ತಂತ್ರಜ್ಞಾನ ಸಂಸ್ಥೆಗಳು 12 ಭಾರತೀಯ ಭಾಷೆಗಳಲ್ಲಿ ಇಂಟರಾಕ್ಟಿವ್ ಎಐ ಪರಿಕರಗಳನ್ನು ಬಿಡುಗಡೆ ಮಾಡಿವೆ.',
      news2Title: 'ಭಾರತದ ಇವಿ ಕ್ರಾಂತಿ: 100+ ನಗರ ತಲುಪಿದ ಸ್ಮಾರ್ಟ್ ಸ್ಕೂಟರ್‌ಗಳು ಮತ್ತು ಬ್ಯಾಟರಿ ಸ್ವಾಪಿಂಗ್ ಸೌಲಭ್ಯ',
      news2Summary: 'ದೇಶೀಯ ಇವಿ ತಯಾರಕರು ನಗರಗಳಲ್ಲಿ ಎಐ ಆಪ್ಟಿಮೈಸ್ಡ್ ಬ್ಯಾಟರಿ ನಿರ್ವಹಣೆ ಮತ್ತು ಚಾರ್ಜಿಂಗ್ ಸೌಲಭ್ಯವನ್ನು ಒದಗಿಸಿದ್ದಾರೆ.',
      news3Title: 'ನೆಕ್ಸ್ಟ್-ಜೆನ್ ಎಐ ಕೋಡಿಂಗ್ ಅಸಿಸ್ಟೆಂಟ್‌ಗಳಿಂದ ಕೇವಲ ನಿಮಿಷಗಳಲ್ಲಿ ಫುಲ್-ಸ್ಟ್ಯಾಕ್ ಆಪ್‌ಗಳ ನಿರ್ಮಾಣ',
      news3Summary: 'ಮಲ್ಟಿ-ಏಜೆಂಟ್ ತಂತ್ರಜ್ಞಾನವು ವೆಬ್ ಅಪ್ಲಿಕೇಶನ್ ಅಭಿವೃದ್ಧಿಯ ಸಮಯವನ್ನು ವಾರಗಳಿಂದ ನಿಮಿಷಗಳಿಗೆ ಇಳಿಸಿದೆ.',
      news4Title: 'ಮಲ್ಟಿಮೋಡಲ್ ಕ್ರಿಯೇಟರ್ ಪರಿಕರಗಳಿಂದ ರಿಯಲ್-ಟೈಮ್ ವೀಡಿಯೊ ಮತ್ತು 3ಡಿ ಡಿಸೈನ್ ಕ್ರಾಂತಿ',
      news4Summary: 'ಜನರೇಟಿವ್ ಯುಐ ಮತ್ತು ಡಿಸೈನ್ ಆಟೋಮೇಷನ್ ಪ್ಲಾಟ್‌ಫಾರ್ಮ್‌ಗಳು ಪಠ್ಯ ಪ್ರಾಂಪ್ಟ್‌ಗಳಿಂದ ಆಪ್ ನಿರ್ಮಿಸಲು ಸಹಾಯ ಮಾಡುತ್ತವೆ.',
      newsletterTitle: 'ಯಂತ್ರ ಮಾನವ ಇನ್‌ಸೈಡರ್ ನೆಟ್‌ವರ್ಕ್‌ಗೆ ಸೇರಿಕೊಳ್ಳಿ',
      newsletterSub: 'ಉಪಯುಕ್ತ ಎಐ ಪರಿಕರಗಳು, ಇವಿ ನವೀಕರಣಗಳು ಮತ್ತು ತಂತ್ರಜ್ಞಾನ ಮಾರ್ಗದರ್ಶಿಗಳನ್ನು ನಿಮ್ಮ ಇನ್‌ಬಾಕ್ಸ್‌ನಲ್ಲಿ ಪಡೆಯಿರಿ.',
      transmitBtn: '<span class="btn-bracket">&lt;</span> ಕಳುಹಿಸಿ <span class="btn-bracket">&gt;</span>'
    },
    ta: {
      welcomeHome: 'நல்வரவு',
      heroTag: 'இந்திய டிஜிட்டல் பொது உள்கட்டமைப்பு',
      heroTitle: 'இந்தியாவின் ஆல்-இன்-ஒன் தொழில்நுட்ப போர்ட்டல்',
      heroSub: 'நீங்கள் விரும்பியதை உருவாக்க பயனுள்ள தொழில்நுட்பம் மற்றும் AI கருவிகளைப் புரிந்து கொள்ளுங்கள்',
      ctaMatrix: '<span class="btn-bracket">&lt;</span> மேட்ரிக்ஸில் நுழையுங்கள் <span class="btn-bracket">&gt;</span>',
      ctaNewsletter: 'இன்சைடர் செய்திகள்',
      aboutHeading: '// பயனுள்ள தொழில்நுட்பம் மற்றும் AI',
      missionTag: '> மிஷன்_அறிக்கை',
      missionTitle: 'இந்தியாவின் AI புரட்சி மற்றும் தொழில்நுட்ப கல்வியறிவை வழிநடத்துதல்',
      missionP1: '<strong>யந்திர மானவா</strong>விற்கு வரவேற்கிறோம் — நடைமுறை தொழில்நுட்பம் மற்றும் நவீன AI கருவிகளைப் புரிந்துகொள்ளும் மையம்.',
      missionP2: 'AI கருவிகளைப் பயிற்றுவிப்பதில் இருந்து இந்தியா முழுவதும் <strong>AI கல்வியறிவு</strong>, <strong>தொழில்நுட்ப வளர்ச்சி</strong> மற்றும் <strong>EV புரட்சி</strong>யை ஊக்குவிப்பது வரை.',
      focusToolsTitle: 'பயனுள்ள AI கருவிகள்',
      focusToolsSub: 'AI முகவர்கள், பிராம்ப்ட் இன்ஜினியரிங் மற்றும் பில்டர் தொழில்நுட்பம்',
      focusLiteracyTitle: 'AI கல்வியறிவு இந்தியா',
      focusLiteracySub: 'மாணவர்கள் மற்றும் படைப்பாளர்களை மேம்படுத்துதல்',
      focusEvTitle: 'EV புரட்சி',
      focusEvSub: 'மின்சார வாகனங்கள், ஸ்மார்ட் பேட்டரி & சார்ஜிங் நெட்வொர்க்',
      focusTechTitle: 'தொழில்நுட்ப வளர்ச்சி',
      focusTechSub: 'நவீன மேம்பாட்டு பணிப்பாய்வு மற்றும் ஆட்டோமேஷன்',
      stackTitle: 'நவீன AI கருவிகள் மற்றும் பில்டர் ஸ்டாக்',
      newsTitle: 'முக்கிய பயனுள்ள தொழில்நுட்பம் மற்றும் AI செய்திகள்',
      news1Title: 'தேசிய AI கல்வியறிவு இயக்கம் 50 லட்சம் மாணவர்களை இலவச AI டூல்கிட்களுடன் சென்றடைந்தது',
      news1Summary: 'அரசு மற்றும் தொழில்நுட்ப அமைப்புகள் 12 இந்திய மொழிகளில் AI கருவிகளை அறிமுகப்படுத்தியுள்ளன.',
      news2Title: 'இந்தியாவின் EV புரட்சி: 100+ நகரங்களை எட்டிய ஸ்மார்ட் ஸ்கூட்டர்கள் மற்றும் பேட்டரி ஸ்வாப்பிங்',
      news2Summary: 'உள்நாட்டு EV உற்பத்தியாளர்கள் AI மேம்படுத்தப்பட்ட பேட்டரி மேலாண்மை அமைப்புகளை அமைத்துள்ளனர்.',
      news3Title: 'அடுத்த தலைமுறை AI கோடிங் உதவியாளர்கள் மூலம் நிமிடங்களில் முழு ஆப் உருவாக்கம்',
      news3Summary: 'மல்டி-ஏஜென்ட் தொழில்நுட்பம் இணையப் பயன்பாட்டு வளர்ச்சி நேரத்தைக் கணிசமாகக் குறைத்துள்ளது.',
      news4Title: 'மல்டிமாடல் கிரியேட்டர் கருவிகள் மூலம் நிகழ்நேர வீடியோ மற்றும் 3D வடிவமைப்பு',
      news4Summary: 'ஜெனரேட்டிவ் UI மற்றும் ஆட்டோமேஷன் தளங்கள் உரை கட்டளைகளில் இருந்து பயன்பாடுகளை உருவாக்க உதவுகின்றன.',
      newsletterTitle: 'யந்திர மானவா இன்சைடர் நெட்வொர்க்கில் இணையுங்கள்',
      newsletterSub: 'பயனுள்ள AI கருவிகள் மற்றும் தொழில்நுட்ப வழிகாட்டிகளை வாரந்தோறும் மின்னஞ்சலில் பெறுங்கள்.',
      transmitBtn: '<span class="btn-bracket">&lt;</span> அனுப்பு <span class="btn-bracket">&gt;</span>'
    },
    te: {
      welcomeHome: 'స్వాగతం',
      heroTag: 'భారత డిజిటల్ పబ్లిక్ ఇన్‌ఫ్రాస్ట్రక్చర్',
      heroTitle: 'భారతదేశపు ఆల్-ఇన్-వన్ టెక్నాలజీ పోర్టల్',
      heroSub: 'మీరు కావాలనుకున్నది నిర్మించడానికి ఉపయోగపడే టెక్ & AI టూల్స్‌ను అర్థం చేసుకోండి',
      ctaMatrix: '<span class="btn-bracket">&lt;</span> మ్యాట్రిక్స్‌లోకి ప్రవేశించండి <span class="btn-bracket">&gt;</span>',
      ctaNewsletter: 'ఇన్‌సైడర్ విశేషాలు',
      aboutHeading: '// ఉపయోగపడే టెక్ & AI డికోడింగ్',
      missionTag: '> మిషన్_స్టేట్‌మెంట్',
      missionTitle: 'భారతదేశపు AI విప్లవం మరియు టెక్ సాక్షరతను నడిపించడం',
      missionP1: '<strong>యంత్ర మానవ</strong>కు స్వాగతం — ఆధునిక టెక్నాలజీ మరియు AI టూల్స్‌ను అర్థం చేసుకునే వేదిక.',
      missionP2: 'AI టూల్స్‌ను నేర్చుకోవడం నుండి భారతదేశంలో <strong>AI సాక్షరత</strong>, <strong>టెక్ పురోగతి</strong> మరియు <strong>EV విప్లవం</strong>ను ప్రోత్సహించడం వరకు.',
      focusToolsTitle: 'ఉపయోగపడే AI టూల్స్',
      focusToolsSub: 'AI ఏజెంట్లు, ప్రాంప్ట్ ఇంజనీరింగ్ మరియు బిల్డర్ టెక్నాలజీ',
      focusLiteracyTitle: 'AI సాక్షరత భారత్',
      focusLiteracySub: 'విద్యార్థులు మరియు క్రియేటర్లను సాధికారపరచడం',
      focusEvTitle: 'EV విప్లవం',
      focusEvSub: 'ఎలక్ట్రిక్ వాహనాలు, స్మార్ట్ బ్యాటరీ & ఛార్జింగ్ నెట్‌వర్క్',
      focusTechTitle: 'టెక్ పురోగతి',
      focusTechSub: 'ఆధునిక డెవలప్‌మెంట్ వర్క్‌ఫ్లో మరియు ఆటోమేషన్',
      stackTitle: 'ఆధునిక AI టూల్స్ మరియు బిల్డర్ స్టాక్',
      newsTitle: 'ప్రధాన ఉపయోగపడే టెక్ మరియు AI విశేషాలు',
      news1Title: 'జాతీయ AI సాక్షరతా డ్రైవ్: 50 లక్షల మందికి ఉచిత AI టూల్‌కిట్లు అందజేత',
      news1Summary: 'ప్రభుత్వ మరియు టెక్ సంస్థలు 12 భారతీయ భాషలలో AI వర్క్‌ఫ్లోలను ప్రారంభించాయి.',
      news2Title: 'భారతదేశంలో EV విప్లవం: 100+ నగరాలకు చేరిన స్మార్ట్ స్కూటర్లు మరియు బ్యాటరీ స్వాపింగ్',
      news2Summary: 'స్వదేశీ EV తయారీదారులు AI ఆప్టిమైజ్డ్ బ్యాటరీ మేనేజ్‌మెంట్ సిస్టమ్‌లను అందుబాటులోకి తెచ్చారు.',
      news3Title: 'నెక్స్ట్-జెన్ AI కోడింగ్ అసిస్టెంట్లతో నిమిషాల్లోనే ఫుల్-స్టాక్ యాప్‌ల నిర్మాణం',
      news3Summary: 'మల్టీ-ఏజెంట్ సాంకేతికత యాప్ డెవలప్‌మెంట్ సమయాన్ని వారాల నుండి నిమిషాలకు తగ్గించింది.',
      news4Title: 'మల్టీమోడల్ క్రియేటర్ టూల్స్తో రియల్-టైమ్ వీడియో మరియు 3D డిజైన్ లభ్యం',
      news4Summary: 'జెనరేటివ్ UI వేదికలు కేవలం టెక్స్ట్ ప్రాంప్ట్‌లతో యాప్‌లను నిర్మించడానికి సహాయపడతాయి.',
      newsletterTitle: 'యంత్ర మానవ ఇన్‌సైడర్ నెట్‌వర్క్‌లో చేరండి',
      newsletterSub: 'ఉపయోగపడే AI టూల్స్ మరియు టెక్ మార్గదర్శకాలను ప్రతివారం మీ ఇన్బాక్స్‌లో పొందండి.',
      transmitBtn: '<span class="btn-bracket">&lt;</span> పంపండి <span class="btn-bracket">&gt;</span>'
    },
    bn: {
      welcomeHome: 'স্বাগতম',
      heroTag: 'ভারতের ডিজিটাল পাবলিক ইনফ্রাস্ট্রাকচার',
      heroTitle: 'ভারতের অল-ইন-ওয়ান টেকনোলজি পোর্টাল',
      heroSub: 'আপনার পছন্দের জিনিস তৈরি করতে দরকারি টেক ও এআই টুলস বুঝুন',
      ctaMatrix: '<span class="btn-bracket">&lt;</span> ম্যাট্রিক্সে প্রবেশ করুন <span class="btn-bracket">&gt;</span>',
      ctaNewsletter: 'ইনসাইডার আপডেট',
      aboutHeading: '// দরকারি টেক ও এআই ডিকোডিং',
      missionTag: '> মিশন_স্টেটমেন্ট',
      missionTitle: 'ভারতের এআই বিপ্লব ও টেক সাক্ষরতার নেতৃত্বদান',
      missionP1: '<strong>যন্ত্র মানব</strong>-এ স্বাগতম — ব্যবহারিক প্রযুক্তি ও আধুনিক এআই টুলস বোঝার আপনার বিশ্বস্ত কেন্দ্র।',
      missionP2: 'এআই টুলস শেখা থেকে শুরু করে ভারতজুড়ে <strong>এআই সাক্ষরতা</strong>, <strong>প্রযুক্তিগত অগ্রগতি</strong> এবং <strong>ইভি বিপ্লব</strong>-কে এগিয়ে নেওয়া।',
      focusToolsTitle: 'দরকারি এআই টুলস',
      focusToolsSub: 'এআই এজেন্ট, প্রম্পট ইঞ্জিনিয়ারিং এবং বিল্ডার প্রযুক্তি',
      focusLiteracyTitle: 'এআই সাক্ষরতা ভারত',
      focusLiteracySub: 'শিক্ষার্থী ও ক্রিয়েটরদের ক্ষমতায়ন',
      focusEvTitle: 'ইভি বিপ্লব',
      focusEvSub: 'ইলেকট্রিক যানবাহন, স্মার্ট ব্যাটারি ও চার্জিং নেটওয়ার্ক',
      focusTechTitle: 'টেক অগ্রগতি',
      focusTechSub: 'আধুনিক ডেভেলপমেন্ট ওয়ার্কফ্লো ও অটোমেশন',
      stackTitle: 'আধুনিক এআই টুলস এবং বিল্ডার স্ট্যাক',
      newsTitle: 'শীর্ষ দরকারি টেক ও এআই ডিসপ্যাচ',
      news1Title: 'জাতীয় এআই সাক্ষরতা অভিযান ৫০ লক্ষ শিক্ষার্থীর কাছে বিনামূল্যে এআই টুলকিট পৌঁছে দিয়েছে',
      news1Summary: 'সরকারি ও টেক উদ্যোগ ১২টি ভারতীয় ভাষায় এআই টুলস চালু করেছে।',
      news2Title: 'ভারতের ইভি বিপ্লব: ১০০+ শহরে পৌঁছাল স্মার্ট স্কুটার ও ফাস্ট ব্যাটারি সোয়াপিং',
      news2Summary: 'দেশীয় ইভি প্রস্তুতকারকরা এআই-অপটিমাইজড ব্যাটারি ম্যানেজমেন্ট সিস্টেম চালু করেছে।',
      news3Title: 'নেক্সট-জেন এআই কোডিং অ্যাসিস্ট্যান্টের মাধ্যমে মিনিটে ফুল-স্ট্যাক অ্যাপ তৈরি',
      news3Summary: 'মাল্টি-এজেন্ট টেকনোলজি অ্যাপ তৈরির সময়কে সপ্তাহে থেকে মিনিটে কমিয়ে এনেছে।',
      news4Title: 'মাল্টিমোডাল ক্রিয়েটর টুলসের মাধ্যমে রিয়েল-টাইম ভিডিও ও ৩ডি ডিজাইন সহজলভ্য',
      news4Summary: 'জেনারেটিভ ইউআই প্ল্যাটফর্মগুলি সাধারণ টেক্সট প্রম্পট থেকে অ্যাপ তৈরি করতে সক্ষম করে।',
      newsletterTitle: 'যন্ত্র মানব ইনসাইডার নেটওয়ার্কে যোগ দিন',
      newsletterSub: 'দরকারি এআই টুলস এবং টেক গাইড প্রতি সপ্তাহে আপনার ইনবক্সে পান।',
      transmitBtn: '<span class="btn-bracket">&lt;</span> পাঠান <span class="btn-bracket">&gt;</span>'
    }
  };

  function applyTranslation(langKey) {
    const data = translations[langKey] || translations.en;

    // Helper to safely set innerHTML/textContent
    const setElem = (selector, content, isHTML = false) => {
      const el = document.querySelector(selector);
      if (el) {
        if (isHTML) el.innerHTML = content;
        else el.textContent = content;
      }
    };

    // Header nav links
    const navLinksList = document.querySelectorAll('.nav-link');
    if (navLinksList[0]) navLinksList[0].innerHTML = `<span class="nav-num">01.</span>${data.navAbout || 'ABOUT'}`;
    if (navLinksList[1]) navLinksList[1].innerHTML = `<span class="nav-num">02.</span>${data.navTools || 'TOOLS & AI'}`;
    if (navLinksList[2]) navLinksList[2].innerHTML = `<span class="nav-num">03.</span>${data.navInsider || 'INSIDER'}`;

    // Header status badge
    setElem('.status-badge', `<span class="pulse-dot"></span>${data.statusBadge || 'INDIA_TECH_PORTAL'}`, true);
    setElem('.sys-code', data.sysCode || 'YANTRA_MANAVA_INDIA_TECH_PORTAL_v3.0');

    // Hero title & buttons
    const mainTitle = document.getElementById('main-title');
    if (mainTitle) {
      mainTitle.textContent = data.welcomeHome || 'WELCOME HOME';
      mainTitle.setAttribute('data-value', data.welcomeHome || 'WELCOME HOME');
    }

    setElem('.enter-matrix-btn', data.ctaMatrix, true);
    setElem('.hero-subtitle', data.heroSub);

    // Section headings & mission
    setElem('.about-section .hud-heading', data.aboutHeading);
    setElem('.bio-tag', data.missionTag);
    setElem('.bio-title', data.missionTitle);

    const pElems = document.querySelectorAll('.bio-card .bio-text');
    if (pElems[0]) pElems[0].innerHTML = data.missionP1;
    if (pElems[1]) pElems[1].innerHTML = data.missionP2;

    // Focus items
    const focusItems = document.querySelectorAll('.focus-item');
    if (focusItems[0]) {
      const detail = focusItems[0].querySelector('.focus-detail');
      if (detail) {
        const strong = detail.querySelector('strong');
        const span = detail.querySelector('span');
        if (strong) strong.textContent = data.focusToolsTitle;
        if (span) span.textContent = data.focusToolsSub;
      }
    }
    if (focusItems[1]) {
      const detail = focusItems[1].querySelector('.focus-detail');
      if (detail) {
        const strong = detail.querySelector('strong');
        const span = detail.querySelector('span');
        if (strong) strong.textContent = data.focusLiteracyTitle;
        if (span) span.textContent = data.focusLiteracySub;
      }
    }
    if (focusItems[2]) {
      const detail = focusItems[2].querySelector('.focus-detail');
      if (detail) {
        const strong = detail.querySelector('strong');
        const span = detail.querySelector('span');
        if (strong) strong.textContent = data.focusEvTitle;
        if (span) span.textContent = data.focusEvSub;
      }
    }
    if (focusItems[3]) {
      const detail = focusItems[3].querySelector('.focus-detail');
      if (detail) {
        const strong = detail.querySelector('strong');
        const span = detail.querySelector('span');
        if (strong) strong.textContent = data.focusTechTitle;
        if (span) span.textContent = data.focusTechSub;
      }
    }

    setElem('.tech-stack-title', data.stackTitle);
    setElem('.ai-news-title', data.newsTitle);

    // News tags & topics
    const indiaTags = document.querySelectorAll('.india-tag');
    indiaTags.forEach(tag => {
      tag.innerHTML = `<svg class="news-tag-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 3v18"/><path d="M3 12h18"/><circle cx="12" cy="12" r="3"/></svg> ${data.tagIndia || 'INDIA HIGHLIGHT'}`;
    });

    const globalTags = document.querySelectorAll('.global-tag');
    globalTags.forEach(tag => {
      tag.innerHTML = `<svg class="news-tag-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg> ${data.tagGlobal || 'USEFUL TECH & AI'}`;
    });

    const newsTimes = document.querySelectorAll('.news-time');
    if (newsTimes[0]) newsTimes[0].textContent = data.time2h || '2 HRS AGO';
    if (newsTimes[1]) newsTimes[1].textContent = data.time5h || '5 HRS AGO';
    if (newsTimes[2]) newsTimes[2].textContent = data.time8h || '8 HRS AGO';
    if (newsTimes[3]) newsTimes[3].textContent = data.time12h || '12 HRS AGO';

    const newsTopicTags = document.querySelectorAll('.news-footer-tag code');
    if (newsTopicTags[0]) newsTopicTags[0].textContent = data.topic1 || 'TOPIC: AI LITERACY & BUILDER TOOLS';
    if (newsTopicTags[1]) newsTopicTags[1].textContent = data.topic2 || 'TOPIC: EV REVOLUTION & CLEAN MOBILITY';
    if (newsTopicTags[2]) newsTopicTags[2].textContent = data.topic3 || 'TOPIC: AI TOOLS & CREATOR TECH';
    if (newsTopicTags[3]) newsTopicTags[3].textContent = data.topic4 || 'TOPIC: TECH PROGRESSION & CREATOR TOOLS';

    const newsCards = document.querySelectorAll('.news-card');
    if (newsCards[0]) {
      newsCards[0].querySelector('.news-headline').textContent = data.news1Title;
      newsCards[0].querySelector('.news-summary').textContent = data.news1Summary;
    }
    if (newsCards[1]) {
      newsCards[1].querySelector('.news-headline').textContent = data.news2Title;
      newsCards[1].querySelector('.news-summary').textContent = data.news2Summary;
    }
    if (newsCards[2]) {
      newsCards[2].querySelector('.news-headline').textContent = data.news3Title;
      newsCards[2].querySelector('.news-summary').textContent = data.news3Summary;
    }
    if (newsCards[3]) {
      newsCards[3].querySelector('.news-headline').textContent = data.news4Title;
      newsCards[3].querySelector('.news-summary').textContent = data.news4Summary;
    }

    setElem('.newsletter-title', data.newsletterTitle);
    setElem('.newsletter-desc', data.newsletterSub);
    
    const emailInput = document.getElementById('email-input');
    if (emailInput) emailInput.placeholder = data.emailPlaceholder || 'enter_your_email@domain.com';

    const submitBtn = document.querySelector('.newsletter-form .primary-btn');
    if (submitBtn) submitBtn.innerHTML = data.transmitBtn;

    // Footer
    setElem('.footer-brand p', data.footerSubtitle || 'India\'s All-in-One Technology Portal');
    const footerLinksList = document.querySelectorAll('.footer-links a');
    if (footerLinksList[0]) footerLinksList[0].textContent = data.footerLink1 || 'The AI Revolution';
    if (footerLinksList[1]) footerLinksList[1].textContent = data.footerLink2 || 'Interactive Terminal';
    if (footerLinksList[2]) footerLinksList[2].textContent = data.footerLink3 || 'Insider Newsletter';
    setElem('.footer-bottom p', data.footerCopyright);
  }

  if (langSelector) {
    langSelector.addEventListener('change', (e) => {
      const lang = e.target.value;
      applyTranslation(lang);
    });
  }

});

