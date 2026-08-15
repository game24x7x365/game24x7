let sound=localStorage.getItem("roachSound")!=="off",ac;
function beep(f=500,d=.07){if(!sound)return;try{ac??=new AudioContext();let o=ac.createOscillator(),g=ac.createGain();o.frequency.value=f;o.type="square";g.gain.value=.04;o.connect(g);g.connect(ac.destination);o.start();g.gain.exponentialRampToValueAtTime(.001,ac.currentTime+d);o.stop(ac.currentTime+d)}catch(e){}}
function toggleSound(){sound=!sound;localStorage.setItem("roachSound",sound?"on":"off");document.querySelectorAll(".sound").forEach(b=>b.textContent="🔊 "+(sound?"ON":"OFF"))}
function settings(){document.querySelector(".modal").classList.remove("hidden")}function closeSettings(){document.querySelector(".modal").classList.add("hidden")}
addEventListener("keydown",e=>{if(e.key==="Escape")closeSettings()});document.querySelectorAll(".sound").forEach(b=>b.textContent="🔊 "+(sound?"ON":"OFF"));
function best(k,n){let b=+(localStorage.getItem(k)||0);if(n>b)localStorage.setItem(k,n);return Math.max(b,n)}