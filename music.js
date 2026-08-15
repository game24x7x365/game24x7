
let musicOn = localStorage.getItem("retroMusic") !== "off";
let musicCtx = null, musicTimer = null, musicStep = 0;
const melody = [261.63,329.63,392.00,523.25,392.00,329.63,293.66,392.00,
                261.63,329.63,440.00,523.25,440.00,329.63,293.66,220.00];

function startRetroMusic() {
  if (!musicOn) return;
  try {
    musicCtx ??= new (window.AudioContext || window.webkitAudioContext)();
    if (musicCtx.state === "suspended") musicCtx.resume();
    if (musicTimer) return;

    const playNote = () => {
      if (!musicOn || !musicCtx) return;
      const now = musicCtx.currentTime;
      const f = melody[musicStep % melody.length];
      const osc = musicCtx.createOscillator();
      const gain = musicCtx.createGain();
      osc.type = (musicStep % 4 === 0) ? "square" : "triangle";
      osc.frequency.value = f;
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.035, now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.20);
      osc.connect(gain);
      gain.connect(musicCtx.destination);
      osc.start(now);
      osc.stop(now + 0.22);

      // Quiet bass note for an arcade feel.
      if (musicStep % 2 === 0) {
        const bass = musicCtx.createOscillator();
        const bg = musicCtx.createGain();
        bass.type = "square";
        bass.frequency.value = f / 2;
        bg.gain.setValueAtTime(0.0001, now);
        bg.gain.exponentialRampToValueAtTime(0.018, now + 0.01);
        bg.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);
        bass.connect(bg);
        bg.connect(musicCtx.destination);
        bass.start(now);
        bass.stop(now + 0.20);
      }
      musicStep++;
    };

    playNote();
    musicTimer = setInterval(playNote, 250);
  } catch (e) {}
}

function stopRetroMusic() {
  if (musicTimer) {
    clearInterval(musicTimer);
    musicTimer = null;
  }
}

function toggleRetroMusic() {
  musicOn = !musicOn;
  localStorage.setItem("retroMusic", musicOn ? "on" : "off");
  document.querySelectorAll(".music-btn").forEach(b =>
    b.textContent = "🎵 MUSIC: " + (musicOn ? "ON" : "OFF")
  );
  if (musicOn) startRetroMusic();
  else stopRetroMusic();
}

function initRetroMusic() {
  document.querySelectorAll(".music-btn").forEach(b =>
    b.textContent = "🎵 MUSIC: " + (musicOn ? "ON" : "OFF")
  );
  // Browsers generally block audio autoplay. The first click/key/touch starts it.
  const begin = () => {
    startRetroMusic();
    window.removeEventListener("pointerdown", begin);
    window.removeEventListener("keydown", begin);
    window.removeEventListener("touchstart", begin);
  };
  window.addEventListener("pointerdown", begin, {once:true});
  window.addEventListener("keydown", begin, {once:true});
  window.addEventListener("touchstart", begin, {once:true});
}
