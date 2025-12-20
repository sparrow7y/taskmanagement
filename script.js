// Optional: Add interactivity if needed
// Example: Smooth scroll for navigation

document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href.startsWith('#')) {
        e.preventDefault();
        document.querySelector(href).scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
});
// Gestion des tâches
document.querySelectorAll('.task-item').forEach(item => {
    const checkbox = item.querySelector('.task-checkbox');
    const text = item.querySelector('.task-text');
    
    checkbox.addEventListener('click', (e) => {
        e.stopPropagation();
        checkbox.classList.toggle('checked');
        text.classList.toggle('completed');
    });
});

// Gestion du markdown
const editor = document.querySelector('.markdown-editor');
const preview = document.querySelector('.markdown-preview');

function updatePreview() {
    const markdown = editor.value;
    preview.innerHTML = marked.parse(markdown);
}

editor.addEventListener('input', updatePreview);
updatePreview();

// Gestion des paternes
document.querySelectorAll('.pattern-item').forEach(item => {
    item.addEventListener('click', () => {
        document.querySelectorAll('.pattern-item').forEach(p => p.classList.remove('active'));
        item.classList.add('active');
    });
});

// Bouton ajouter paterne
document.querySelector('.add-pattern-btn').addEventListener('click', () => {
    const patternName = prompt('Nom du nouveau paterne:');
    if (patternName) {
        const list = document.querySelector('.pattern-list');
        const newPattern = document.createElement('li');
        newPattern.className = 'pattern-item';
        newPattern.textContent = patternName;
        newPattern.addEventListener('click', () => {
            document.querySelectorAll('.pattern-item').forEach(p => p.classList.remove('active'));
            newPattern.classList.add('active');
        });
        list.appendChild(newPattern);
    }
});

// Gestion des onglets
document.querySelectorAll('.tab').forEach(tab => {
    const closeBtn = tab.querySelector('.tab-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (confirm('Fermer cet onglet ?')) {
                tab.remove();
            }
        });
    }
});

document.querySelector('.tab-add').addEventListener('click', () => {
    const tabName = prompt('Nom du nouvel onglet:');
    if (tabName) {
        const tabs = document.querySelector('.tabs');
        const addBtn = document.querySelector('.tab-add');
        const newTab = document.createElement('button');
        newTab.className = 'tab';
        newTab.innerHTML = `${tabName} <span class="tab-close">×</span>`;
        tabs.insertBefore(newTab, addBtn);
        
        // Ajouter l'événement de fermeture au nouveau bouton
        const newCloseBtn = newTab.querySelector('.tab-close');
        newCloseBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (confirm('Fermer cet onglet ?')) {
                newTab.remove();
            }
        });
    }
});