document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. Typing Effect (Hero Subtitle)
     ========================================================================== */
  const twElement = document.getElementById('tw');
  const phrases = [
    'Systems Dev Manager @ Google',
    'Former SRE Manager @ AWS',
    'Franchise Owner @ Sparkle Squad',
    'Angel Investor & STEM Mentor'
  ];
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  const typeEffect = () => {
    const currentPhrase = phrases[phraseIndex];
    
    if (isDeleting) {
      twElement.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
    } else {
      twElement.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
    }

    let delay = isDeleting ? 30 : 60;

    if (!isDeleting && charIndex === currentPhrase.length) {
      // Pause at the end of the phrase
      delay = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      delay = 350;
    }

    setTimeout(typeEffect, delay);
  };

  // Start typing after a short delay
  if (twElement) {
    setTimeout(typeEffect, 800);
  }


  /* ==========================================================================
     2. Sidebar Navigation Active Highlighting
     ========================================================================== */
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.hud-nav .nav-item');

  const highlightNav = () => {
    let scrollY = window.scrollY;
    
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navItems.forEach(item => {
          item.classList.remove('active');
          if (item.getAttribute('href') === `#${sectionId}`) {
            item.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', highlightNav, { passive: true });


  /* ==========================================================================
     3. Scroll Reveals and Skill Metric Fills (Intersection Observer)
     ========================================================================== */
  
  // Progressively reveal elements if CSS scroll timeline is not supported
  const hasScrollTimeline = CSS.supports('(animation-timeline: view()) and (animation-range: entry)');
  
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      
      // Delay stagger effect for sibling elements coming in
      const siblings = Array.from(entry.target.parentElement.children).filter(el => el.classList.contains('reveal'));
      const delay = siblings.indexOf(entry.target) * 75;
      
      setTimeout(() => {
        entry.target.classList.add('on');
      }, delay);
      
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.08 });

  if (!hasScrollTimeline) {
    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
  } else {
    // For browsers with native timeline, force the class so they are fully visible
    // when CSS finishes, just to be safe
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('on'));
  }

  // Trigger skill metrics filling when overview comes into view
  const metricsFillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      
      entry.target.querySelectorAll('.tm-fill').forEach(fill => {
        fill.style.width = fill.parentElement.previousElementSibling.querySelector('span:last-child').textContent;
      });
      metricsFillObserver.unobserve(entry.target);
    });
  }, { threshold: 0.1 });

  const skillsSection = document.getElementById('skills');
  if (skillsSection) {
    metricsFillObserver.observe(skillsSection);
  }


  /* ==========================================================================
     4. Number Count-up Animation
     ========================================================================== */
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      
      const el = entry.target;
      const targetCount = parseInt(el.getAttribute('data-count'), 10);
      let current = 0;
      const step = Math.max(1, Math.ceil(targetCount / 40));
      
      const tick = () => {
        current = Math.min(current + step, targetCount);
        el.textContent = current;
        if (current < targetCount) {
          requestAnimationFrame(tick);
        }
      };
      
      requestAnimationFrame(tick);
      countObserver.unobserve(el);
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-count]').forEach(el => countObserver.observe(el));


  /* ==========================================================================
     5. Interactive Terminal Widget
     ========================================================================== */
  const termInput = document.getElementById('term-input');
  const termBody = document.getElementById('term-body');
  
  if (termInput) {
    termBody.addEventListener('click', () => {
      termInput.focus();
    });

    termInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const inputVal = termInput.value.trim();
        processCommand(inputVal);
        termInput.value = '';
      }
    });
  }

  const systemConfig = {
    help: `
      <span class="cyan">SYS COMMANDS LIST:</span><br>
      - <span class="green">help</span>       : Show this help list.<br>
      - <span class="green">about</span>      : Display developer operational profile.<br>
      - <span class="green">projects</span>   : Output active development/experience logs.<br>
      - <span class="green">skills</span>     : Display technical capabilities index.<br>
      - <span class="green">certs</span>      : Query academic & credentials registry.<br>
      - <span class="green">lab &lt;id&gt;</span>    : Show technical specifications for a role/lab (e.g. <span class="cyan">lab 1</span>).<br>
      - <span class="green">clear</span>      : Wipe session console terminal screen.<br>
      - <span class="green">secret</span>     : Access classified data.
    `,
    about: `
      <span class="cyan">OPERATIONAL LOG // DEPLOYEE: JAWANN GRAVES</span><br>
      ===============================================<br>
      <span>ROLE: Systems Development Engineering Manager @ Google</span><br>
      <span>BUSINESS: Owner, Sparkle Squad of Ashburn-Leesburg-Sterling</span><br>
      <span>LOCATION: Leesburg, VA // USA</span><br>
      <span>CORE OBJECTIVE: Aligning high-performance engineering systems with local business execution. Leading large systems reliability projects at scale while investing in the tech ecosystem.</span>
    `,
    projects: `
      <span class="cyan">WORK & EXPERIENCE REGISTRY:</span><br>
      ====================================<br>
      [01] <span class="green">Google</span> - Systems Development Engineering Manager (Active)<br>
      [02] <span class="green">Amazon / AWS</span> - Cloud Infrastructure Automation Leadership (Past)<br>
      [03] <span class="green">Sparkle Squad</span> - Business Operations Platform Architecture (Active)<br>
      [04] <span class="green">Angel Investing & Mentorship</span> - inSTEM mentor, Black Angel Group (Active)<br>
      <br>
      Type <span class="cyan">lab 1</span>, <span class="cyan">lab 2</span>, etc., to fetch detailed configurations.
    `,
    skills: `
      <span class="cyan">CAPABILITIES METRIC:</span><br>
      ====================================<br>
      - <span class="yellow">Leadership</span>: Systems Development Management, SRE, Team Scale<br>
      - <span class="yellow">Platforms</span>: Amazon Web Services (AWS), Google Cloud Platform (GCP)<br>
      - <span class="yellow">Languages</span>: Python, Go, Bash, Java, JavaScript<br>
      - <span class="yellow">Ecosystem</span>: Infrastructure as Code (Terraform), SRE, API Integrations
    `,
    certs: `
      <span class="cyan">ACADEMIC & CREDENTIALS REGISTRY:</span><br>
      ======================================<br>
      <span class="yellow">PROFESSIONAL CERTIFICATIONS:</span><br>
      - Google Cloud Digital Leader (May 2024 - May 2027)<br>
      - CompTIA Security+ (Aug 2022 - Aug 2025 | ID: VXNFC0JDT34E133S)<br>
      - CompTIA Network+ (Jun 2019 - Jun 2022 | ID: COMP001020700719)<br>
      - AWS Certified Developer - Associate (Feb 2018 - Feb 2021)<br>
      - AWS Certified Solutions Architect - Associate (Dec 2016 - Dec 2019 | ID: AWS-ASA-27539)<br>
      - CompTIA Cloud+ (Apr 2014 - Apr 2017 | ID: COMP001020700719)<br>
      - GIAC Security Essentials (GSEC) Silver (Feb 2006 - Feb 2010 | ID: 5062)<br>
      <br>
      <span class="yellow">ACADEMIC DEGREES:</span><br>
      [✓] MS in IT Management (WGU, 2021)<br>
      [✓] BS in Computer Science (Strayer University)<br>
      [✓] CS, Math & Psychology Studies (Rensselaer Polytechnic Institute)<br>
      [▸] Doctoral Studies in Engineering Management (George Washington University)
    `,
    secret: `
      <span class="red">CLASSIFIED SECURITY BREACH ATTEMPT...</span><br>
      <span class="green">Initializing Matrix simulation loop...</span><br>
      <span class="grey">Wake up, Jawann... Follow the white rabbit. 🐇</span><br>
      <span>MEMBER PROFILE DETECTED: Mensa International | Maryland Masons (PHA Past Master, Lodge #141).</span>
    `
  };

  const labSpecs = {
    "1": `
      <span class="cyan">SPECIFICATIONS // GOOGLE SYSTEM DEVELOPMENT</span><br>
      -----------------------------------------------<br>
      <span>ROLE: Systems Development Engineering Manager</span><br>
      <span>FOCUS: Leading engineering teams in systems software development, site reliability engineering (SRE), and IT infrastructure scaling.</span><br>
      <span>HIGHLIGHTS: Scaling large-scale server telemetry automation pipelines and establishing optimal SLA monitoring.</span>
    `,
    "2": `
      <span class="cyan">SPECIFICATIONS // AWS AUTOMATION LEADERSHIP</span><br>
      -----------------------------------------------<br>
      <span>ROLE: Systems Development Manager (AWS)</span><br>
      <span>FOCUS: Automated cloud resource management and systems tooling for global datacenters.</span><br>
      <span>ADVOCACY: Served as Global Board Co-President of the Black Employee Network (BEN), driving diversity in tech.</span>
    `,
    "3": `
      <span class="cyan">SPECIFICATIONS // SPARKLE SQUAD OPERATIONAL STACK</span><br>
      -----------------------------------------------<br>
      <span>ROLE: Franchise Owner & Technology Director</span><br>
      <span>STACK: Integrated CRM, Google APIs, scheduling automation, and local marketing automation.</span><br>
      <span>GOAL: Infusing standard corporate tech-sector processes into residential & commercial window/gutter washing.</span>
    `,
    "4": `
      <span class="cyan">SPECIFICATIONS // STEM MENTORSHIP & ANGEL INVESTING</span><br>
      -----------------------------------------------<br>
      <span>ROLE: Angel Investor & STEM Mentor</span><br>
      <span>AFFILIATIONS: Black Angel Group (BAG), NSTMF inSTEM Mentor</span><br>
      <span>GOAL: Supporting underrepresented STEM students and funding early-stage seed startups.</span>
    `
  };

  const processCommand = (cmdStr) => {
    const outputContainer = termBody.querySelector('.term-output');
    const cmdClean = cmdStr.toLowerCase().trim();
    
    const commandEcho = document.createElement('div');
    commandEcho.innerHTML = `<span class="prompt-text">guest@jawann-sys:~$</span> <span>${escapeHtml(cmdStr)}</span>`;
    outputContainer.appendChild(commandEcho);

    const resultLine = document.createElement('div');
    resultLine.className = 'term-result';
    
    if (cmdClean === '') {
      outputContainer.appendChild(resultLine);
      termBody.scrollTop = termBody.scrollHeight;
      return;
    }

    if (cmdClean === 'clear') {
      outputContainer.innerHTML = '';
      termBody.scrollTop = termBody.scrollHeight;
      return;
    }

    if (systemConfig[cmdClean]) {
      resultLine.innerHTML = systemConfig[cmdClean];
    } else if (cmdClean.startsWith('lab ')) {
      const id = cmdClean.replace('lab ', '').trim();
      if (labSpecs[id]) {
        resultLine.innerHTML = labSpecs[id];
      } else {
        resultLine.innerHTML = `<span class="red">ERR: Operational ID "${escapeHtml(id)}" not found. Type "projects" to view active IDs.</span>`;
      }
    } else {
      resultLine.innerHTML = `<span class="red">SYS_ERR: Command "${escapeHtml(cmdStr)}" unrecognized. Type <span class="white">help</span> for available commands.</span>`;
    }

    outputContainer.appendChild(resultLine);
    outputContainer.appendChild(document.createElement('br'));
    
    termBody.scrollTop = termBody.scrollHeight;
  };

  const escapeHtml = (text) => {
    const div = document.createElement('div');
    div.innerText = text;
    return div.innerHTML;
  };

  /* ==========================================================================
     6. Direct Specs Button Integration
     ========================================================================== */
  document.querySelectorAll('.btn-spec').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const cmd = btn.getAttribute('data-cmd');
      if (cmd) {
        const termElement = document.getElementById('terminal');
        if (termElement) {
          window.scrollTo({
            top: termElement.getBoundingClientRect().top + window.scrollY - 70,
            behavior: 'smooth'
          });
          
          setTimeout(() => {
            processCommand(cmd);
            if (termInput) termInput.focus();
          }, 500);
        }
      }
    });
  });

});
