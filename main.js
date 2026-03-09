/* =============================================
   THE VAPE HOUSE — main.js
   ============================================= */

// ── AGE GATE ──────────────────────────────────
function enter() {
  const gate = document.getElementById('ag');
  gate.classList.add('out');
  setTimeout(() => gate.style.display = 'none', 700);
}

// ── CUSTOM CURSOR ─────────────────────────────
const c1 = document.getElementById('cur');
const c2 = document.getElementById('cur2');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
  c1.style.left = mx + 'px';
  c1.style.top  = my + 'px';
});

(function animCursor() {
  rx += (mx - rx) * 0.11;
  ry += (my - ry) * 0.11;
  c2.style.left = rx + 'px';
  c2.style.top  = ry + 'px';
  requestAnimationFrame(animCursor);
})();

document.querySelectorAll('a, button, .pc').forEach(el => {
  el.addEventListener('mouseenter', () => {
    c2.style.width       = '52px';
    c2.style.height      = '52px';
    c2.style.borderColor = 'rgba(255,149,0,.75)';
  });
  el.addEventListener('mouseleave', () => {
    c2.style.width       = '34px';
    c2.style.height      = '34px';
    c2.style.borderColor = 'rgba(255,149,0,.45)';
  });
});

// ── NAV SCROLL ────────────────────────────────
window.addEventListener('scroll', () => {
  document.getElementById('nav').classList.toggle('sc', scrollY > 60);
});

// ── MOBILE MENU ───────────────────────────────
function toggleMobile() {
  const m = document.getElementById('mnav');
  const isOpen = m.classList.contains('open');
  m.style.display = isOpen ? 'none' : 'flex';
  m.classList.toggle('open');
}

function checkHam() {
  const ham = document.getElementById('ham');
  const nl  = document.getElementById('navlinks');
  if (window.innerWidth <= 768) {
    ham.style.display = 'flex';
    nl.style.display  = 'none';
  } else {
    ham.style.display = 'none';
    nl.style.display  = 'flex';
    const mnav = document.getElementById('mnav');
    mnav.classList.remove('open');
    mnav.style.display = 'none';
  }
}
checkHam();
window.addEventListener('resize', checkHam);

// ── CART ──────────────────────────────────────
let cart = [];

function selectCardType(btn) {
  document.querySelectorAll('.ctt').forEach(x => x.classList.remove('on'));
  btn.classList.add('on');
}

function addToCart(name, price) {
  const existing = cart.find(i => i.name === name);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ name, price, qty: 1 });
  }
  updateBadge();
  showToast('✦ ' + name + ' added');
}

function updateBadge() {
  document.getElementById('badge').textContent = cart.reduce((s, i) => s + i.qty, 0);
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('on');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('on'), 2500);
}

function renderCart() {
  const itemsEl = document.getElementById('cItems');
  const totalEl = document.getElementById('cTotal');
  const btnText = document.getElementById('pb');

  if (!cart.length) {
    itemsEl.innerHTML = '<div class="ce">— Your cart is empty —</div>';
    totalEl.textContent = 'R0';
    btnText.textContent = 'Complete Purchase';
    return;
  }

  let html = '', total = 0;
  cart.forEach(i => {
    total += i.price * i.qty;
    html += `
      <div class="ci">
        <div>
          <div class="ci-name">${i.name}</div>
          <div class="ci-qty">Qty: ${i.qty}</div>
        </div>
        <div class="ci-price">R${(i.price * i.qty).toLocaleString()}</div>
      </div>`;
  });

  itemsEl.innerHTML = html;
  totalEl.textContent = 'R' + total.toLocaleString();
  btnText.textContent = 'Complete Purchase · R' + total.toLocaleString();
}

function openCart(e) {
  if (e) e.preventDefault();
  renderCart();
  document.getElementById('ov').classList.add('open');
}

function closeCart() {
  document.getElementById('ov').classList.remove('open');
}

document.getElementById('ov').addEventListener('click', e => {
  if (e.target === e.currentTarget) closeCart();
});

// ── CARD NUMBER FORMATTING ────────────────────
document.getElementById('cn').addEventListener('input', function () {
  let v = this.value.replace(/\D/g, '').slice(0, 16);
  this.value = v.replace(/(.{4})/g, '$1 ').trim();
});

document.getElementById('ex').addEventListener('input', function () {
  let v = this.value.replace(/\D/g, '');
  if (v.length >= 2) v = v.slice(0, 2) + ' / ' + v.slice(2, 4);
  this.value = v;
});

// ── PAYMENT HANDLER ───────────────────────────
function pay() {
  const name  = document.getElementById('fn').value.trim();
  const num   = document.getElementById('cn').value.replace(/\s/g, '');
  const exp   = document.getElementById('ex').value;
  const cvv   = document.getElementById('cv').value;
  const email = document.getElementById('em').value.trim();

  if (!name || num.length < 16 || !exp || !cvv || !email) {
    alert('Please complete all payment fields.');
    return;
  }
  if (!cart.length) {
    alert('Your cart is empty.');
    return;
  }

  const btn = document.querySelector('.pay-main');
  btn.style.opacity = '0.65';
  document.getElementById('pb').textContent = 'Processing…';

  // ────────────────────────────────────────────────────────────
  // REPLACE THE setTimeout BELOW with your real payment gateway.
  // Recommended for SA/FNB:
  //   • PayFast  → https://www.payfast.co.za
  //   • Peach Payments → https://www.peachpayments.com
  // Both route directly to your FNB business account.
  //
  // Example (PayFast redirect):
  //   window.location.href =
  //     `https://www.payfast.co.za/eng/process?merchant_id=YOUR_ID
  //      &merchant_key=YOUR_KEY&amount=${total}&item_name=Vape+Order
  //      &email_address=${email}`;
  // ────────────────────────────────────────────────────────────
  setTimeout(() => {
    cart = [];
    updateBadge();
    closeCart();
    btn.style.opacity = '1';
    document.getElementById('pb').textContent = 'Complete Purchase';
    ['fn', 'cn', 'ex', 'cv', 'em'].forEach(id => {
      document.getElementById(id).value = '';
    });
    showToast('✦ Order confirmed — thank you!');
  }, 2000);
}

// ── SCROLL REVEAL ─────────────────────────────
const revObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('v');
  });
}, { threshold: 0.08 });

document.querySelectorAll('.rev').forEach(r => revObserver.observe(r));

// ── ANIMATED FIRE (Canvas) ────────────────────
(function initFire() {
  const canvas = document.getElementById('fireCanvas');
  const ctx    = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    particles = [];
    const count = Math.ceil(W / 6) * 3;
    for (let i = 0; i < count; i++) particles.push(makeParticle());
  }

  function makeParticle() {
    return {
      x:       Math.random() * W,
      y:       H + Math.random() * 40,
      vx:      (Math.random() - 0.5) * 1.2,
      vy:      -(Math.random() * 3.5 + 1.5),
      life:    0,
      maxLife: 60 + Math.random() * 80,
      size:    Math.random() * 28 + 10,
      col:     Math.floor(Math.random() * 4)
    };
  }

  // Yellow → Amber → Orange → Deep Orange
  const COLORS = [
    a => `rgba(255,214,0,${a})`,
    a => `rgba(255,149,0,${a})`,
    a => `rgba(255,80,0,${a})`,
    a => `rgba(200,30,0,${a})`
  ];

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Background fade
    const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
    bgGrad.addColorStop(0, 'rgba(7,6,10,0)');
    bgGrad.addColorStop(1, 'rgba(7,6,10,1)');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // Ground glow
    const groundGrad = ctx.createLinearGradient(0, H * 0.6, 0, H);
    groundGrad.addColorStop(0,   'rgba(255,100,0,0)');
    groundGrad.addColorStop(0.6, 'rgba(255,80,0,0.12)');
    groundGrad.addColorStop(1,   'rgba(200,30,0,0.25)');
    ctx.fillStyle = groundGrad;
    ctx.fillRect(0, H * 0.6, W, H * 0.4);

    // Particles
    particles.forEach((p, i) => {
      p.x    += p.vx + Math.sin(p.life * 0.05 + i) * 0.5;
      p.y    += p.vy;
      p.vy   *= 0.99;
      p.size *= 0.992;
      p.life++;

      if (p.life > p.maxLife || p.y < -p.size || p.size < 1) {
        particles[i] = makeParticle();
        return;
      }

      const t     = p.life / p.maxLife;
      const alpha = t < 0.2 ? t / 0.2 : t > 0.7 ? (1 - t) / 0.3 : 1;
      const cf    = COLORS[p.col];

      ctx.save();
      ctx.translate(p.x, p.y);

      const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size);
      grad.addColorStop(0,   cf(alpha * 0.9));
      grad.addColorStop(0.5, cf(alpha * 0.5));
      grad.addColorStop(1,   cf(0));

      ctx.fillStyle = grad;
      ctx.scale(1, 1.8);
      ctx.beginPath();
      ctx.arc(0, 0, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // Bright base line (Yellow → Orange gradient across width)
    const lineGrad = ctx.createLinearGradient(0, 0, W, 0);
    lineGrad.addColorStop(0,    'rgba(255,214,0,0)');
    lineGrad.addColorStop(0.15, 'rgba(255,214,0,0.8)');
    lineGrad.addColorStop(0.35, 'rgba(255,149,0,0.9)');
    lineGrad.addColorStop(0.5,  'rgba(255,80,0,1)');
    lineGrad.addColorStop(0.65, 'rgba(255,149,0,0.9)');
    lineGrad.addColorStop(0.85, 'rgba(255,214,0,0.8)');
    lineGrad.addColorStop(1,    'rgba(255,214,0,0)');
    ctx.fillStyle = lineGrad;
    ctx.fillRect(0, H - 8, W, 8);

    // Soft glow above base
    const topGlow = ctx.createLinearGradient(0, H - 80, 0, H);
    topGlow.addColorStop(0, 'rgba(255,80,0,0)');
    topGlow.addColorStop(1, 'rgba(255,80,0,0.18)');
    ctx.fillStyle = topGlow;
    ctx.fillRect(0, H - 80, W, 80);

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  draw();
})();