// 搜索框
const searchBox = document.getElementById('searchBox');
const allSections = Array.from(document.querySelectorAll('.content > h2'));

searchBox.addEventListener('input', () => {
  const query = searchBox.value.trim().toLowerCase();

  allSections.forEach(section => {
    const grid = section.nextElementSibling;
    let hasMatch = false;

    Array.from(grid.children).forEach(card => {
      const imgAlt = card.querySelector('img')?.alt.toLowerCase() || '';
      if (imgAlt.includes(query)) {
        card.style.display = 'flex';
        hasMatch = true;
      } else {
        card.style.display = 'none';
      }
    });

    // 如果分类下没有匹配，隐藏标题和 grid
    if (hasMatch) {
      section.style.display = 'block';
      grid.style.display = 'grid';
    } else {
      section.style.display = 'none';
      grid.style.display = 'none';
    }
  });
});


	
// 下载按钮强制下载
document.querySelectorAll('.download-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const src = btn.dataset.src;
    if (src) {
      const a = document.createElement('a');
      a.href = src;
      a.download = src.split('/').pop();
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  });
});

// 回到顶部
const backToTop = document.getElementById("backToTop");
window.addEventListener("scroll", () => {
  backToTop.classList.toggle("show", window.scrollY > 300);
});
backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// Lightbox
const lightbox = document.getElementById('lightbox');
let lightboxImg = lightbox.querySelector('img');
const downloadLightbox = lightbox.querySelector('.download-lightbox');
const closeBtn = lightbox.querySelector('.close-btn');
const navLeft = lightbox.querySelector('.nav-left');
const navRight = lightbox.querySelector('.nav-right');
const cards = Array.from(document.querySelectorAll('.card img'));
let currentIndex = 0;

function openLightbox(src) {
  lightbox.classList.add('show');
  const newImg = new Image();
  newImg.src = src;
  newImg.onload = () => { lightboxImg.replaceWith(newImg); lightboxImg = newImg; };
  downloadLightbox.href = src;
  currentIndex = cards.findIndex(c => c.src === src);
}

function closeLightbox() {
  lightbox.classList.remove('show');
  lightboxImg.src = '';
}

cards.forEach(img => img.addEventListener('click', () => openLightbox(img.src)));
closeBtn.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

navLeft.addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + cards.length) % cards.length;
  openLightbox(cards[currentIndex].src);
});
navRight.addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % cards.length;
  openLightbox(cards[currentIndex].src);
});

document.addEventListener('keydown', e => {
  if (lightbox.classList.contains('show')) {
    if (e.key === 'ArrowRight') navRight.click();
    else if (e.key === 'ArrowLeft') navLeft.click();
    else if (e.key === 'Escape') closeLightbox();
  }
});

// 填充空卡片
function fillEmptyCards() {
  document.querySelectorAll('.grid').forEach(grid => {
    grid.querySelectorAll('.card.empty').forEach(e => e.remove());
    const cardWidth = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--card-width'));
    const cardGap = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--card-gap'));
    const gridWidth = grid.clientWidth;
    const columns = Math.floor((gridWidth + cardGap) / (cardWidth + cardGap));
    const emptyNeeded = columns - grid.children.length % columns;
    if (emptyNeeded < columns && emptyNeeded > 0) {
      for (let i = 0; i < emptyNeeded; i++) {
        const emptyCard = document.createElement('div');
        emptyCard.className = 'card empty';
        grid.appendChild(emptyCard);
      }
    }
  });
}
fillEmptyCards();
window.addEventListener('resize', fillEmptyCards);

// 导航滚动 + 高亮
const navButtons = document.querySelectorAll('.header-right button');
const header = document.querySelector('.header');
const sections = document.querySelectorAll('h2');

navButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const targetEl = document.getElementById(btn.dataset.target);
    if (targetEl) {
      const headerHeight = header.offsetHeight;
      const topPos = targetEl.offsetTop - headerHeight - 48;
      window.scrollTo({ top: topPos, behavior: 'smooth' });

      // 点击时立即更新高亮
      navButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    }
  });
});

function updateActiveNav() {
  const scrollPos = window.scrollY + header.offsetHeight + 50; // 容差50px
  sections.forEach((sec, i) => {
    if (scrollPos >= sec.offsetTop && scrollPos < sec.offsetTop + sec.offsetHeight) {
      navButtons.forEach(btn => btn.classList.remove('active'));
      navButtons[i].classList.add('active');
    }
  });
}
window.addEventListener('scroll', updateActiveNav);
updateActiveNav();

// 默认高亮第一个菜单
navButtons.forEach(b => b.classList.remove('active'));
if(navButtons.length > 0) navButtons[0].classList.add('active');