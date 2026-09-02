(function(){
  "use strict";

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ============================================================
     PARTICLE SYSTEM — drifting dandelion seeds
  ============================================================ */
  var canvas = document.getElementById('particles');
  var ctx = canvas.getContext('2d');
  var W, H, particles = [];
  var seedColors = ['#b99879', '#a9895f', '#c2a67e', '#8a5a38'];

  function resize(){
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  function makeSeed(initY){
    var spokeCount = 8 + Math.floor(Math.random()*3);
    var spokes = [];
    for(var i=0;i<spokeCount;i++){
      spokes.push((i/spokeCount)*Math.PI*2 + (Math.random()-0.5)*0.3);
    }
    return {
      x: Math.random()*W,
      y: initY !== undefined ? initY : Math.random()*H,
      size: 4.5 + Math.random()*4.5,
      speed: 0.14 + Math.random()*0.22,
      drift: 0.6 + Math.random()*1.3,
      phase: Math.random()*Math.PI*2,
      rot: Math.random()*360,
      rotSpeed: (Math.random()-0.5)*0.35,
      color: seedColors[Math.floor(Math.random()*seedColors.length)],
      alpha: 0.3 + Math.random()*0.35,
      spokes: spokes
    };
  }

  function initParticles(){
    particles = [];
    var count = window.innerWidth < 560 ? 14 : 24;
    for(var i=0;i<count;i++) particles.push(makeSeed());
  }
  initParticles();
  window.addEventListener('resize', function(){ initParticles(); });

  function drawSeed(p){
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot * Math.PI/180);
    ctx.globalAlpha = p.alpha;
    ctx.strokeStyle = p.color;
    ctx.lineWidth = 0.6;
    for(var i=0;i<p.spokes.length;i++){
      var a = p.spokes[i];
      var len = p.size * (0.75 + 0.25*Math.sin(i*2.1));
      ctx.beginPath();
      ctx.moveTo(0,0);
      ctx.lineTo(Math.cos(a)*len, Math.sin(a)*len);
      ctx.stroke();
    }
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(0, 0, p.size*0.16, 0, Math.PI*2);
    ctx.fill();
    ctx.restore();
  }

  var t = 0;
  function tick(){
    t += 1;
    ctx.clearRect(0,0,W,H);
    for(var i=0;i<particles.length;i++){
      var p = particles[i];
      var sway = Math.sin(t*0.01 + p.phase) * p.drift;
      p.y -= p.speed;
      p.x += sway*0.1;
      p.rot += p.rotSpeed;
      if(p.y < -12){ Object.assign(p, makeSeed(H+12)); }
      drawSeed(p);
    }
    requestAnimationFrame(tick);
  }

  if(!reduceMotion){
    requestAnimationFrame(tick);
  } else {
    canvas.style.display = 'none';
  }

  /* ============================================================
     VIEW SWITCHING (crossfade)
  ============================================================ */
  function showView(id){
    var cur = document.querySelector('.view.active');
    var next = document.getElementById(id);
    if(cur === next) return;

    function activateNext(){
      next.classList.add('active');
      next.style.opacity = '0';
      next.style.transform = 'translateY(10px)';
      void next.offsetWidth;
      next.style.transition = 'opacity .55s ease, transform .55s ease';
      next.style.opacity = '1';
      next.style.transform = 'translateY(0)';
      window.scrollTo({ top: 0 });
    }

    if(cur){
      cur.style.transition = 'opacity .4s ease, transform .4s ease';
      cur.style.opacity = '0';
      cur.style.transform = 'translateY(-10px)';
      setTimeout(function(){
        cur.classList.remove('active');
        cur.style.opacity = '';
        cur.style.transform = '';
        cur.style.transition = '';
        activateNext();
      }, 380);
    } else {
      activateNext();
    }
  }

  /* ============================================================
     WORD-BY-WORD TEXT REVEAL
  ============================================================ */
  function renderWords(container, text, baseDelay, wordGap){
    container.innerHTML = '';
    var gap = wordGap || 0.045;
    var lines = String(text).split('\n');
    var wordIndex = 0;
    lines.forEach(function(line, li){
      var words = line.split(' ').filter(function(w){ return w.length; });
      words.forEach(function(w){
        var span = document.createElement('span');
        span.textContent = w;
        span.className = 'word';
        span.style.animationDelay = ((baseDelay||0) + wordIndex*gap) + 's';
        container.appendChild(span);
        container.appendChild(document.createTextNode(' '));
        wordIndex++;
      });
      if(li < lines.length - 1){ container.appendChild(document.createElement('br')); }
    });
  }

  /* ============================================================
     DATA: DUA SURAT
  ============================================================ */
  var stories = {
    istimewa: {
      closingTitle: "Dia Sangat<br>Istimewa.",
      introText: "Ini adalah cerita yang sudah lama aku simpan.\nTentang seseorang yang entah kenapa,\nberhasil membuat hari-hariku terasa berbeda.\n\nAku tidak tahu apakah suatu hari nanti\ncerita ini akan sampai ke tanganmu atau tidak.\nTapi jika kamu sedang membacanya sekarang,\nmungkin itu bukan kebetulan.\n\nSelamat membaca ya.\nSemoga kamu menikmati setiap katanya.",
      closingSub: "Terima kasih sudah membaca sampai akhir.\nSemoga hari-harimu, juga terlihat istimewa.",
      paragraphs: [
        "Ini berawal dari hari pertama aku magang.",
        "Di sana, aku melihat banyak perempuan. Tapi, dari sekian banyak orang yang ada, ada satu orang yang entah kenapa berhasil menarik perhatianku. Bukan hanya sekadar menarik perhatian, tapi aku benar-benar kagum ketika melihatnya.",
        "Dia terlihat dewasa. Entah kenapa, dari caranya bersikap, dia seperti seorang leader di divisi kami. Dia kalem, cantik, dan sorotan matanya menurutku sangat indah. Ada sesuatu dari dirinya yang membuatku terus memperhatikannya.",
        "Dia terlihat istimewa.",
        "Sejak saat itu, tanpa sadar aku mulai menyimpan rasa suka kepadanya. Aku sering mencuri-curi pandang, hanya untuk melihatnya sebentar. Entah kenapa, melihat dia terasa menenangkan. Di dalam ruangan yang terkadang ramai dan berisik, dia justru menjadi salah satu orang yang paling tenang. Dia tidak banyak bicara, tidak banyak membuat keributan, tapi justru itulah yang membuatku semakin tertarik.",
        "Di mataku, dia seperti seseorang yang sempurna.",
        "Tapi aku tidak pernah benar-benar berani untuk mendekatinya. Ada rasa minder dalam diriku. Aku merasa masih banyak kekurangan, dan aku merasa belum pantas untuk bersanding dengan seseorang seperti dia. Jadi, untuk sekarang, aku memilih untuk menyukainya dalam diam. Entah sampai kapan.",
        "Sebenarnya, di dalam pikiranku sering sekali muncul keinginan untuk mengajaknya berbicara berdua. Ingin mengenalnya lebih dekat, ingin sekadar ngobrol tentang hal-hal sederhana. Tapi setiap kali kesempatan itu muncul, gengsiku dan rasa tidak percaya diriku selalu lebih besar daripada keberanianku.",
        "Aku memang terlihat seperti orang yang cuek. Tapi sebenarnya, aku selalu memperhatikannya.",
        "Aku tidak tahu kenapa perasaanku bisa seperti ini. Setiap kali berada di dekatnya, ada rasa berdebar yang sulit dijelaskan. Bahkan ketika dia hanya melihat ke arahku, aku sering langsung memalingkan wajah karena malu.",
        "Mungkin baginya, aku hanyalah seseorang yang kebetulan ada di tempat yang sama.\nTapi bagiku, dia adalah seseorang yang berhasil membuat hari-hari magang terasa berbeda.",
        "Dia sangat cantik di mataku.",
        "Dan entah kenapa, dari awal aku melihatnya sampai sekarang, satu hal yang selalu terlintas di pikiranku adalah—"
      ]
    },
    rasa: {
      closingTitle: "Sebuah Rasa<br>yang Tak Terucap.",
      introText: "Aku bakal menuangkan isi hatiku ke dalam cerita ini.\nKamu pasti bertanya-tanya, kok aku bisa suka sama kamu?\nSejak kapan? Dan kenapa harus kamu?\n\nJadi, ceritanya begini.",
      closingSub: "Terima kasih sudah membaca sampai akhir.\nSekarang kamu tahu, sejak kapan aku jatuh cinta.",
      paragraphs: [
        "Saat perkenalan diri masing-masing di awal aku magang, aku melihatmu sebagai orang yang welcome banget. Mungkin itu juga alasan kenapa, ketika kita membicarakan first impression, aku bilang kalau aku segan sama kamu.",
        "Entah kenapa, sejak awal aku melihatmu seperti seorang leader.",
        "Ketika ada yang membutuhkan bantuan soal ACMT, kamu selalu siap membantu mereka. Kamu nggak pernah ragu buat membantu ketika ada yang kesulitan. Dan jujur, aku selalu merasa kagum melihatmu seperti itu.",
        "Rasa kagum itu terus muncul sampai akhirnya aku mulai melihatmu berbeda dari yang lain.",
        "Ketika orang lain ngobrol dengan begitu berisik, kamu justru lebih sering memilih untuk diam dan tetap kalem. Entah kenapa, hal sederhana itu membuatku melihatmu sebagai seseorang yang berbeda.",
        "Dan mungkin... dari situlah semuanya dimulai.\nDari rasa kagum yang perlahan berubah menjadi rasa suka.",
        "Aku mulai menyimpan rasa itu dalam diam.\nKamu tahu, aku sebenarnya selalu memperhatikanmu. Bukan karena aku cuek atau nggak mau ngobrol sama kamu. Justru sebaliknya.",
        "Aku ingin sekali mengobrol denganmu.\nTapi aku selalu bingung bagaimana cara memulai percakapan yang nantinya bisa membuat kita ngobrol lebih panjang.\nKadang aku punya banyak hal yang ingin aku tanyakan atau ceritakan, tapi ketika ada kesempatan untuk berbicara denganmu, entah kenapa semuanya tiba-tiba hilang.\nAkhirnya aku hanya bisa diam.",
        "Aku juga sempat bertanya-tanya dalam hati...\nApa kamu merasakan hal yang sama?\nAtau sebenarnya cuma aku yang terlalu banyak mengartikan semuanya?",
        "Kita sering berkontak mata. Dan setiap kali itu terjadi, selalu ada bagian kecil dalam diriku yang bertanya,\n\"Mungkinkah dia juga suka sama aku?\"",
        "Tapi aku nggak mau terlalu percaya diri.\nAku selalu mencoba meyakinkan diriku sendiri,\n\"Mungkin dia cuma melihat. Nggak mungkin juga dia bakal suka sama aku.\"",
        "Jadi untuk sekarang, aku memilih untuk menyukaimu dalam diam.\nAku nggak tahu sampai kapan.",
        "Aku juga nggak tahu apakah suatu hari nanti aku akan benar-benar mengungkapkan semuanya kepadamu, atau justru tetap menjadi seseorang yang hanya bisa mengagumimu dari jauh.",
        "Tapi ada satu hal yang pasti.\nKalau suatu hari cerita ini sampai kepadamu, berarti aku sudah menemukan keberanian untuk mengatakan semuanya.\nBerarti aku sudah berani mengakui bahwa selama ini...\naku memang menyukaimu.",
        "Tapi kalau cerita ini belum pernah sampai kepadamu, mungkin aku akan tetap menyimpannya.\nEntah sampai kapan.\nMungkin sampai rasa ini hilang dengan sendirinya.",
        "Atau mungkin...\nsampai akhirnya aku benar-benar berani mengatakan:\n\"Aku suka sama kamu.\""
      ]
    }
  };

  var currentStoryKey = null;

  /* ============================================================
     ENVELOPES (dua pilihan): idle float + cursor tilt per amplop
  ============================================================ */
  var pointerFine = window.matchMedia && window.matchMedia('(pointer: fine)').matches;
  var envelopeControllers = {};

  function setupEnvelope(el){
    var opened = false;
    var tiltX = 0, tiltY = 0, targetTiltX = 0, targetTiltY = 0;
    var phase = el.dataset.story === 'rasa' ? 1.3 : 0;

    if(pointerFine){
      document.addEventListener('mousemove', function(e){
        if(opened) return;
        var rect = el.getBoundingClientRect();
        var cx = rect.left + rect.width/2;
        var cy = rect.top + rect.height/2;
        var dx = (e.clientX - cx) / (rect.width/2);
        var dy = (e.clientY - cy) / (rect.height/2);
        dx = Math.max(-1, Math.min(1, dx));
        dy = Math.max(-1, Math.min(1, dy));
        targetTiltY = dx * 8;
        targetTiltX = -dy * 8;
      });
    }

    function loop(ts){
      if(!opened){
        tiltX += (targetTiltX - tiltX) * 0.08;
        tiltY += (targetTiltY - tiltY) * 0.08;
        var floatY = reduceMotion ? 0 : Math.sin((ts||0)/900 + phase) * 4;
        el.style.transform =
          'translateY('+floatY+'px) perspective(900px) rotateX('+tiltX+'deg) rotateY('+tiltY+'deg)';
      }
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);

    el.addEventListener('click', function(){
      if(opened) return;
      opened = true;
      el.style.transform = '';
      el.classList.add('opened');
      currentStoryKey = el.dataset.story;
      setTimeout(function(){ showView('view-intro'); }, 950);
    });

    return {
      reset: function(){ opened = false; el.classList.remove('opened'); }
    };
  }

  document.querySelectorAll('.envelope').forEach(function(el){
    envelopeControllers[el.dataset.story] = setupEnvelope(el);
  });

  /* ============================================================
     INTRO LETTER
  ============================================================ */
  var introBody = document.getElementById('introBody');
  var lastIntroKey = null;
  document.getElementById('startReading').addEventListener('click', function(){
    showView('view-story');
    startStory();
  });

  var origShowView = showView;
  showView = function(id){
    origShowView(id);
    if(id === 'view-intro' && currentStoryKey && lastIntroKey !== currentStoryKey){
      lastIntroKey = currentStoryKey;
      setTimeout(function(){ renderWords(introBody, stories[currentStoryKey].introText, 0.1); }, 150);
    }
  };

  /* ============================================================
     STORY READER LOGIC
  ============================================================ */
  var current = 0;
  var storyText = document.getElementById('storyText');
  var storyCard = document.querySelector('.story-card');
  var storyProgress = document.getElementById('storyProgress');
  var storyDots = document.getElementById('storyDots');
  var nextBtn = document.getElementById('nextBtn');
  var prevBtn = document.getElementById('prevBtn');

  function activeParagraphs(){
    return stories[currentStoryKey].paragraphs;
  }

  function buildDots(){
    storyDots.innerHTML = '';
    activeParagraphs().forEach(function(_, i){
      var d = document.createElement('span');
      d.className = 'dot';
      d.addEventListener('click', function(){
        if(i === current) return;
        current = i;
        showParagraph(current);
      });
      storyDots.appendChild(d);
    });
  }

  function renderDots(){
    var dots = storyDots.querySelectorAll('.dot');
    dots.forEach(function(d,i){ d.classList.toggle('on', i===current); });
  }

  function updateNav(){
    prevBtn.classList.toggle('hidden', current === 0);
  }

  function showParagraph(i){
    var paragraphs = activeParagraphs();
    storyCard.style.opacity = '0';
    storyCard.style.transform = 'translateY(8px) scale(0.99)';
    setTimeout(function(){
      renderWords(storyText, paragraphs[i], 0, 0.065);
      storyProgress.textContent = (i+1) + ' / ' + paragraphs.length;
      renderDots();
      updateNav();
      storyCard.style.opacity = '1';
      storyCard.style.transform = 'translateY(0) scale(1)';
    }, 300);
  }

  function startStory(){
    current = 0;
    buildDots();
    showParagraph(current);
  }

  nextBtn.addEventListener('click', function(){
    var paragraphs = activeParagraphs();
    if(current < paragraphs.length - 1){
      current++;
      showParagraph(current);
    } else {
      showView('view-closing');
      var story = stories[currentStoryKey];
      document.getElementById('closingTitle').innerHTML = story.closingTitle;
      setTimeout(function(){
        renderWords(document.getElementById('closingSub'), story.closingSub, 0.2);
      }, 200);
    }
  });

  prevBtn.addEventListener('click', function(){
    if(current > 0){
      current--;
      showParagraph(current);
    }
  });

  document.getElementById('replayBtn').addEventListener('click', function(){
    if(currentStoryKey && envelopeControllers[currentStoryKey]){
      envelopeControllers[currentStoryKey].reset();
    }
    currentStoryKey = null;
    lastIntroKey = null;
    showView('view-cover');
  });

  /* ============================================================
     BACKSOUND (user's own mp3) — tries to autoplay on load,
     falls back to starting on first tap/click if the browser
     blocks autoplay-with-sound. A mute/pause button is always available.
  ============================================================ */
  var musicBtn = document.getElementById('musicBtn');
  var bgAudio = document.getElementById('bgAudio');
  var TARGET_VOLUME = 0.55;
  var playing = false;
  var userPaused = false;
  var fadeTimer = null;

  bgAudio.volume = 0;

  function clearFade(){ if(fadeTimer){ clearInterval(fadeTimer); fadeTimer = null; } }

  function fadeTo(target, duration, onDone){
    clearFade();
    var steps = 30;
    var stepTime = duration / steps;
    var startVol = bgAudio.volume;
    var diff = target - startVol;
    var i = 0;
    fadeTimer = setInterval(function(){
      i++;
      bgAudio.volume = Math.max(0, Math.min(1, startVol + diff * (i/steps)));
      if(i >= steps){
        clearFade();
        bgAudio.volume = target;
        if(onDone) onDone();
      }
    }, stepTime);
  }

  function setPlayingUI(isPlaying){
    playing = isPlaying;
    musicBtn.classList.toggle('playing', isPlaying);
  }

  function playMusic(){
    bgAudio.play().then(function(){
      setPlayingUI(true);
      fadeTo(TARGET_VOLUME, 1200);
    }).catch(function(){
      /* autoplay blocked — will retry on first user interaction */
    });
  }

  function pauseMusic(){
    fadeTo(0, 800, function(){ bgAudio.pause(); });
    setPlayingUI(false);
  }

  /* try autoplay immediately on load */
  playMusic();

  /* if blocked, start on the very first interaction anywhere on the page */
  function tryStartOnFirstInteraction(){
    if(!playing && !userPaused){ playMusic(); }
    document.removeEventListener('click', tryStartOnFirstInteraction);
    document.removeEventListener('touchstart', tryStartOnFirstInteraction);
    document.removeEventListener('keydown', tryStartOnFirstInteraction);
  }
  document.addEventListener('click', tryStartOnFirstInteraction);
  document.addEventListener('touchstart', tryStartOnFirstInteraction);
  document.addEventListener('keydown', tryStartOnFirstInteraction);

  musicBtn.addEventListener('click', function(e){
    e.stopPropagation();
    if(playing){
      userPaused = true;
      pauseMusic();
    } else {
      userPaused = false;
      playMusic();
    }
  });

})();
