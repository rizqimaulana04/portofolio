'use strict';
const dictionaries = window.portfolioTranslations;
const labels = {
  id: { nav: 'Navigasi utama', language: 'Pilih bahasa', profile: 'Lihat profil', close: 'Tutup dialog' },
  en: { nav: 'Main navigation', language: 'Choose language', profile: 'View profile', close: 'Close dialog' }
};
const details = {
  id: {
    cv: { title: 'CV sedang disiapkan.', label: 'CURRICULUM VITAE', description: 'Dokumen CV belum diunggah. Setelah data lengkap tersedia, bagian ini akan menyediakan CV PDF untuk diunduh oleh rekruter.', tags: ['Profil', 'Pendidikan', 'Keahlian', 'Pengalaman'], note: 'Versi pratinjau — belum ada dokumen untuk diunduh.' },
    contact: { title: 'Mari terhubung.', label: 'KONTAK PROFESIONAL', description: 'Alamat email dan tautan profil profesional belum ditambahkan. Informasi ini akan dilengkapi berdasarkan data pemilik portofolio.', tags: ['Email', 'LinkedIn', 'GitHub'], note: 'Versi pratinjau — kanal kontak belum tersedia.' },
    project0: { title: 'Proyek akademik Anda.', label: '01 / PLACEHOLDER PROYEK', description: 'Bagian ini akan memuat judul skripsi atau tugas akhir, masalah yang diteliti, metode yang digunakan, kontribusi pribadi, serta hasil yang dapat ditunjukkan.', tags: ['Latar belakang', 'Metode', 'Kontribusi', 'Hasil'], note: 'Belum ada proyek asli yang ditambahkan. Visual pada kartu hanya ilustrasi tata letak.' },
    project1: { title: 'Proyek pilihan Anda.', label: '02 / PLACEHOLDER PROYEK', description: 'Bagian ini akan memuat aplikasi atau proyek pilihan Anda: tujuan, peran, teknologi, tangkapan layar, serta tautan demo atau repositori jika tersedia.', tags: ['Tujuan', 'Peran', 'Teknologi', 'Demo / repositori'], note: 'Belum ada proyek asli yang ditambahkan. Visual pada kartu hanya ilustrasi tata letak.' },
    project2: { title: 'Pengalaman Anda.', label: '03 / PLACEHOLDER PENGALAMAN', description: 'Bagian ini akan memuat pengalaman kerja, magang, organisasi, atau kolaborasi yang benar-benar Anda jalani, termasuk tanggung jawab dan hasilnya.', tags: ['Konteks', 'Tanggung jawab', 'Kontribusi', 'Hasil'], note: 'Bagian ini akan disesuaikan atau dihapus jika tidak relevan dengan data Anda.' }
  },
  en: {
    cv: { title: 'Your CV is being prepared.', label: 'CURRICULUM VITAE', description: 'A CV has not been uploaded yet. Once the full details are available, this section will provide a downloadable PDF CV for recruiters.', tags: ['Profile', 'Education', 'Skills', 'Experience'], note: 'Preview edition — no document is available to download yet.' },
    contact: { title: 'Let’s connect.', label: 'PROFESSIONAL CONTACT', description: 'An email address and professional profile links have not been added yet. These will be completed using the portfolio owner’s information.', tags: ['Email', 'LinkedIn', 'GitHub'], note: 'Preview edition — contact channels are not available yet.' },
    project0: { title: 'Your academic project.', label: '01 / PROJECT PLACEHOLDER', description: 'This section will present your thesis or final project, the research problem, methodology, personal contribution, and demonstrable outcomes.', tags: ['Background', 'Methodology', 'Contribution', 'Results'], note: 'No actual project has been added yet. The card visual is a layout illustration only.' },
    project1: { title: 'Your selected project.', label: '02 / PROJECT PLACEHOLDER', description: 'This section will present your application or selected project: its purpose, your role, the technology, screenshots, and a demo or repository link if available.', tags: ['Purpose', 'Role', 'Technology', 'Demo / repository'], note: 'No actual project has been added yet. The card visual is a layout illustration only.' },
    project2: { title: 'Your experience.', label: '03 / EXPERIENCE PLACEHOLDER', description: 'This section will cover work, internships, organizations, or collaborations you have actually participated in, including your responsibilities and outcomes.', tags: ['Context', 'Responsibilities', 'Contribution', 'Outcomes'], note: 'This section will be adapted or removed if it is not relevant to your information.' }
  }
};
let language = 'id';
let activeDetail = null;
let previousFocus;
const dialog = document.querySelector('#detail-dialog');
function renderDetail() {
  const detail = details[language][activeDetail];
  document.querySelector('#dialog-title').textContent = detail.title;
  document.querySelector('#dialog-label').textContent = detail.label;
  document.querySelector('#dialog-description').textContent = detail.description;
  document.querySelector('#dialog-note').textContent = detail.note;
  document.querySelector('#dialog-tags').replaceChildren(...detail.tags.map(tag => {
    const span = document.createElement('span'); span.textContent = tag; return span;
  }));
}
function setLanguage(next, announce = true) {
  if (!Object.prototype.hasOwnProperty.call(dictionaries, next)) return;
  language = next;
  document.documentElement.lang = next;
  // These HTML translations are local, authored content, never user input.
  document.querySelectorAll('[data-i18n]').forEach(element => { element.innerHTML = dictionaries[next][element.dataset.i18n]; });
  document.querySelectorAll('[data-label]').forEach(element => element.setAttribute('aria-label', labels[next][element.dataset.label]));
  document.querySelectorAll('[data-lang]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.lang === next)));
  document.title = next === 'id' ? 'Muhammad Rizqi Maulana — Portofolio' : 'Muhammad Rizqi Maulana — Portfolio';
  document.querySelector('meta[name="description"]').content = next === 'id' ? 'Portofolio profesional lulusan S1 Teknik Informatika Universitas Pelita Bangsa.' : 'Professional portfolio of an Informatics graduate from Universitas Pelita Bangsa.';
  if (activeDetail) renderDetail();
  try { localStorage.setItem('portfolio-language', next); } catch { /* Keep translation working without storage. */ }
  if (announce) document.querySelector('#language-announcement').textContent = next === 'id' ? 'Bahasa diubah ke Bahasa Indonesia.' : 'Language changed to English.';
}
document.querySelectorAll('[data-lang]').forEach(button => button.addEventListener('click', () => setLanguage(button.dataset.lang)));
document.querySelectorAll('[data-detail]').forEach(button => button.addEventListener('click', () => {
  previousFocus = document.activeElement;
  activeDetail = button.dataset.detail;
  renderDetail();
  dialog.showModal();
  document.body.style.overflow = 'hidden';
}));
document.querySelectorAll('.dialog-close, .dialog-dismiss').forEach(button => button.addEventListener('click', () => dialog.close()));
dialog.addEventListener('click', event => {
  const rect = dialog.getBoundingClientRect();
  if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
});
dialog.addEventListener('close', () => { document.body.style.overflow = ''; activeDetail = null; previousFocus?.focus(); });
document.querySelector('#year').textContent = new Date().getFullYear();
try { const saved = localStorage.getItem('portfolio-language'); if (saved === 'id' || saved === 'en') language = saved; } catch { /* Default to Indonesian. */ }
setLanguage(language, false);
