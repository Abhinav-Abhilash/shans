/**
 * SHANS MOHAMMED // PORTFOLIO CLIENT INTERFACE
 * Features: Terminal Shell, Audio Synth, GIF Switcher, Theme Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- Audio Synthesizer (Web Audio API) ---
  let soundEnabled = true;
  let audioCtx = null;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
  }

  function playKeyClick() {
    if (!soundEnabled) return;
    try {
      initAudio();
      if (!audioCtx || audioCtx.state === 'suspended') {
        audioCtx && audioCtx.resume();
      }
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600 + Math.random() * 200, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.015, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.04);
    } catch (e) {
      // Audio not permitted yet
    }
  }

  function playTerminalBeep(freq = 440, duration = 0.08) {
    if (!soundEnabled) return;
    try {
      initAudio();
      if (!audioCtx || audioCtx.state === 'suspended') {
        audioCtx && audioCtx.resume();
      }
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // Audio not permitted yet
    }
  }

  const soundBtn = document.getElementById('sound-toggle');
  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      soundBtn.querySelector('.sound-icon').textContent = soundEnabled ? '🔊' : '🔇';
      if (soundEnabled) playTerminalBeep(880, 0.1);
    });
  }

  // --- Theme Switcher ---
  const themeButtons = document.querySelectorAll('.theme-btn');
  themeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      themeButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const theme = btn.getAttribute('data-theme');
      document.body.className = theme;
      playTerminalBeep(520, 0.05);
    });
  });

  // --- GIF Switcher ---
  const gifDisplay = document.getElementById('terminal-gif-display');
  const screenSwitchBtns = document.querySelectorAll('.screen-switch-btn');

  screenSwitchBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      screenSwitchBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const targetSrc = btn.getAttribute('data-src');
      if (gifDisplay && targetSrc) {
        gifDisplay.src = targetSrc;
        playTerminalBeep(640, 0.06);
      }
    });
  });

  // --- Terminal Command Engine ---
  const termInput = document.getElementById('terminal-input');
  const termOutput = document.getElementById('terminal-output');
  const sendBtn = document.getElementById('send-cmd-btn');
  const quickCmdBtns = document.querySelectorAll('.cmd-pill');

  const history = [];
  let historyIdx = -1;

  const COMMANDS = {
    help: `
<span class="highlight-cyan">AVAILABLE COMMANDS:</span>
  <span class="highlight-green">whoami</span>       - Display profile overview and career objective
  <span class="highlight-green">skills</span>       - Matrix of programming languages & tools
  <span class="highlight-green">education</span>    - Details regarding Jain University Kochi & BCA
  <span class="highlight-green">sports</span>       - Athletic track record & physical discipline
  <span class="highlight-green">projects</span>     - Showcase of featured software deployments
  <span class="highlight-green">contact</span>      - Communication channels & social links
  <span class="highlight-green">ping</span>         - Ping test to Shans's network terminal
  <span class="highlight-green">screen</span>       - Toggle between CRT gifs (cracked, clean, ball)
  <span class="highlight-green">theme</span>        - Change color scheme (green, cyan, amber)
  <span class="highlight-green">date</span>         - Print current system timestamp
  <span class="highlight-green">clear</span>        - Flush the terminal buffer
  <span class="highlight-green">sudo</span>         - Administrative authorization test
`,

    whoami: `
<span class="highlight-green">=== PROFILE: SHANS MOHAMMED ===</span>
  • <span class="highlight-cyan">Track:</span> BCA (Bachelor of Computer Applications) - Full-Stack Development
  • <span class="highlight-cyan">Campus:</span> Jain (Deemed-to-be University), Kochi Campus 🌴
  • <span class="highlight-cyan">Focus:</span> Software Engineering, DSA, Relational Databases, Startup Scaling
  • <span class="highlight-cyan">Status:</span> "Building the next big thing, one commit at a time."
  • <span class="highlight-cyan">Hobbies:</span> Basketball, Football, Volleyball, Hardware tinkering
`,

    skills: `
<span class="highlight-green">=== TECHNICAL STACK ===</span>
  [<span class="highlight-cyan">Languages</span>]   Python, C++, SQL, JavaScript (ES6+), HTML5, CSS3
  [<span class="highlight-cyan">Frameworks</span>] Modern Vanilla UI, Node.js fundamentals, DOM APIs
  [<span class="highlight-cyan">Databases</span>]  SQL Relational Modeling, Query Optimization, Normalization
  [<span class="highlight-cyan">DevOps/Cloud</span>] Git, GitHub, Vercel Instant Deployments, Zsh/Bash CLI
  [<span class="highlight-cyan">Core CS</span>]    Data Structures, OOP, Algorithmic Efficiency, Schema Design
`,

    education: `
<span class="highlight-green">=== EDUCATION MATRIX ===</span>
  🏛️ <span class="highlight-cyan">Institution:</span> Jain (Deemed-to-be University), Kochi Campus
  📜 <span class="highlight-cyan">Degree:</span> Bachelor of Computer Applications (BCA) - Full-Stack Track
  📅 <span class="highlight-cyan">Duration:</span> 2024 - Present
  📍 <span class="highlight-cyan">Location:</span> Kochi, Kerala, India (Infopark Corridor)
  📚 <span class="highlight-cyan">Relevant Coursework:</span>
     - Data Structures & Algorithms (C++)
     - Web Development & Application Design (HTML/CSS/JS)
     - Database Management Systems (SQL)
     - Python Automation & Scripting
`,

    sports: `
<span class="highlight-green">=== PHYSICAL DISCIPLINE & ATHLETICS ===</span>
  🏀 <span class="highlight-amber">Basketball:</span> Court vision, transition speed, clutch decision-making under game clocks.
  ⚽ <span class="highlight-amber">Football:</span> 90-minute stamina, tactical field awareness, unselfish team synergy.
  🏐 <span class="highlight-amber">Volleyball:</span> Vertical explosion, defensive digs, high-velocity net spikes.
  
  <span class="highlight-cyan">> Philosophy:</span> Physical endurance directly translates to mental stamina behind the keyboard.
`,

    projects: `
<span class="highlight-green">=== FEATURED PROJECTS ===</span>
  1. <span class="highlight-cyan">Interactive Cyber CRT Portfolio</span> [HTML5, CSS3, JS, Vercel]
     - Retro terminal with built-in synth & CRT simulation.
  2. <span class="highlight-cyan">C++ Algorithmic Toolkit</span> [C++, OOP, Data Structures]
     - Custom implementations of fundamental CS algorithms and memory management.
  3. <span class="highlight-cyan">Python Data & SQL Pipeline</span> [Python, SQL, Automation]
     - Automated record ingestion, transformation, and database syncing.
  4. <span class="highlight-cyan">Jain University Student Management DB</span> [SQL, Normalization]
     - Relational database schema with 3NF integrity and complex analytical views.
`,

    contact: `
<span class="highlight-green">=== INITIATE HANDSHAKE ===</span>
  • <span class="highlight-cyan">GitHub:</span>   <a href="https://github.com/shansmohammedtharuvara-ship-it" target="_blank" style="color:var(--accent);">github.com/shansmohammedtharuvara-ship-it</a>
  • <span class="highlight-cyan">LinkedIn:</span> <a href="https://www.linkedin.com/in/shans-mohammed-tharuvara-617b2539a?utm_source=share_via&utm_content=profile&utm_medium=member_ios" target="_blank" style="color:var(--accent);">linkedin.com/in/shans-mohammed-tharuvara</a>
  • <span class="highlight-cyan">Email:</span>    <a href="mailto:shansmohammedtharuvara@gmail.com" style="color:var(--accent);">shansmohammedtharuvara@gmail.com</a>
  • <span class="highlight-cyan">Campus:</span>   Jain University, Kochi, Kerala, India
`,

    ping: `
<span class="highlight-green">PING shansmohammed (127.0.0.1): 56 data bytes</span>
64 bytes from 127.0.0.1: icmp_seq=0 ttl=64 time=0.038 ms
64 bytes from 127.0.0.1: icmp_seq=1 ttl=64 time=0.042 ms
64 bytes from 127.0.0.1: icmp_seq=2 ttl=64 time=0.039 ms

<span class="highlight-cyan">--- shansmohammed ping statistics ---</span>
3 packets transmitted, 3 packets received, <span class="highlight-green">0.0% packet loss</span>
Status: <span class="highlight-green">Online & Ready to Connect!</span>
`,

    date: () => `<span class="highlight-cyan">${new Date().toString()}</span>`,

    sudo: `
<span class="highlight-amber">[SECURITY ALERT]</span> Nice try! User "shans" is not in the sudoers file. This incident will be reported to Jain University SysOps. 😉
`,

    ball: () => {
      if (gifDisplay) {
        gifDisplay.src = 'assets/basketball_terminal.gif';
      }
      return `<span class="highlight-amber">🏀 IMPACT DETECTED! Screen switched to basketball impact animation!</span>`;
    }
  };

  function appendOutput(content, isCommand = false, cmdText = '') {
    if (isCommand) {
      const cmdDiv = document.createElement('div');
      cmdDiv.className = 'term-line prompt-line';
      cmdDiv.innerHTML = `<span class="prompt-symbol">shans@jain-kochi:~$</span> ${cmdText}`;
      termOutput.appendChild(cmdDiv);
    }

    if (content) {
      const outDiv = document.createElement('div');
      outDiv.className = 'term-line output-line';
      outDiv.innerHTML = typeof content === 'function' ? content() : content;
      termOutput.appendChild(outDiv);
    }

    termOutput.scrollTop = termOutput.scrollHeight;
  }

  function handleCommand(rawInput) {
    const trimmed = rawInput.trim();
    if (!trimmed) return;

    history.push(trimmed);
    historyIdx = history.length;

    const parts = trimmed.split(' ');
    const cmd = parts[0].toLowerCase();
    const arg = parts[1] ? parts[1].toLowerCase() : '';

    playTerminalBeep(580, 0.06);

    if (cmd === 'clear' || cmd === 'cls') {
      termOutput.innerHTML = '';
      return;
    }

    if (cmd === 'theme') {
      if (['green', 'cyan', 'amber'].includes(arg)) {
        document.body.className = `theme-${arg}`;
        themeButtons.forEach(b => {
          b.classList.toggle('active', b.getAttribute('data-theme') === `theme-${arg}`);
        });
        appendOutput(`<span class="highlight-green">Theme switched to: ${arg}</span>`, true, trimmed);
      } else {
        appendOutput(`<span class="highlight-amber">Usage: theme [green | cyan | amber]</span>`, true, trimmed);
      }
      return;
    }

    if (cmd === 'screen') {
      if (arg === 'clean') {
        gifDisplay.src = 'assets/shans_terminal.gif';
        appendOutput(`<span class="highlight-green">Switched to Clean Terminal screen</span>`, true, trimmed);
      } else if (arg === 'cracked') {
        gifDisplay.src = 'assets/cracked_terminal.gif';
        appendOutput(`<span class="highlight-green">Switched to Cracked CRT screen</span>`, true, trimmed);
      } else if (arg === 'ball' || arg === 'basketball') {
        gifDisplay.src = 'assets/basketball_terminal.gif';
        appendOutput(`<span class="highlight-amber">Switched to Basketball Crash screen</span>`, true, trimmed);
      } else {
        appendOutput(`<span class="highlight-amber">Usage: screen [cracked | clean | ball]</span>`, true, trimmed);
      }
      return;
    }

    if (COMMANDS[cmd]) {
      appendOutput(COMMANDS[cmd], true, trimmed);
    } else {
      appendOutput(`
<span class="highlight-amber">command not found:</span> ${trimmed}.
Type <span class="cmd-highlight">help</span> for a list of valid commands.
`, true, trimmed);
    }
  }

  if (termInput) {
    termInput.addEventListener('keydown', (e) => {
      playKeyClick();

      if (e.key === 'Enter') {
        e.preventDefault();
        const val = termInput.value;
        termInput.value = '';
        handleCommand(val);
      } else if (e.key === 'ArrowUp') {
        if (history.length > 0 && historyIdx > 0) {
          historyIdx--;
          termInput.value = history[historyIdx];
        }
      } else if (e.key === 'ArrowDown') {
        if (historyIdx < history.length - 1) {
          historyIdx++;
          termInput.value = history[historyIdx];
        } else {
          historyIdx = history.length;
          termInput.value = '';
        }
      } else if (e.key === 'Tab') {
        e.preventDefault();
        const currentVal = termInput.value.toLowerCase().trim();
        const match = Object.keys(COMMANDS).find(c => c.startsWith(currentVal));
        if (match) {
          termInput.value = match;
        }
      }
    });
  }

  if (sendBtn) {
    sendBtn.addEventListener('click', () => {
      if (termInput) {
        const val = termInput.value;
        termInput.value = '';
        handleCommand(val);
        termInput.focus();
      }
    });
  }

  quickCmdBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const cmd = btn.getAttribute('data-cmd');
      handleCommand(cmd);
      if (termInput) termInput.focus();
    });
  });

  // --- Copy Email Button ---
  const copyBtn = document.getElementById('copy-email-btn');
  const emailElem = document.getElementById('email-address');

  if (copyBtn && emailElem) {
    copyBtn.addEventListener('click', () => {
      const email = emailElem.textContent.trim();
      navigator.clipboard.writeText(email).then(() => {
        copyBtn.textContent = 'Copied! ✓';
        copyBtn.style.background = 'var(--accent)';
        copyBtn.style.color = '#000';
        playTerminalBeep(700, 0.08);
        setTimeout(() => {
          copyBtn.textContent = 'Copy';
          copyBtn.style.background = '';
          copyBtn.style.color = '';
        }, 2000);
      });
    });
  }

  // --- Scroll spy for Navbar Links ---
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 140;
      if (window.pageYOffset >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
});
