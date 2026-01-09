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
function initTaskItem(item) {
    const checkbox = item.querySelector('.task-checkbox');
    const text = item.querySelector('.task-text');
    const deleteBtn = item.querySelector('.task-delete');
    
    // Gestion de la checkbox
    checkbox.addEventListener('click', (e) => {
        e.stopPropagation();
        checkbox.classList.toggle('checked');
        text.classList.toggle('completed');
    });
    
    // Gestion de la suppression
    if (deleteBtn) {
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (confirm('Supprimer cette tâche ?')) {
                // Ajouter animation puis supprimer l'élément au terme de l'animation
                item.classList.add('task-removing');
                item.addEventListener('animationend', () => item.remove(), { once: true });
            }
        });
    }
}

// Initialiser toutes les tâches existantes
document.querySelectorAll('.task-item').forEach(initTaskItem);

// Fonction pour ajouter une nouvelle tâche
function addTask(category) {
    const taskList = category.querySelector('.task-list');
    const newItem = document.createElement('li');
    newItem.className = 'task-item';
    newItem.innerHTML = `
        <div class="task-checkbox"></div>
        <input type="text" class="task-text" value="Nouvelle tâche" placeholder="Entrez une tâche...">
        <button class="task-delete">🗑️</button>
        <button class="add-task-btn"> + Ajouter une tâche</button>
        
    `;
    taskList.appendChild(newItem);
    
    // Initialiser les événements de la nouvelle tâche
    initTaskItem(newItem);
    
    // Focus sur le champ de texte et sélectionner le texte
    const input = newItem.querySelector('.task-text');
    input.focus();
    input.select();
}

// Gestion des boutons "Ajouter une tâche"
// Utilise la délégation d'événements pour gérer aussi les boutons ajoutés dynamiquement
document.addEventListener('click', (e) => {
    const btn = e.target.closest('.add-task-btn');
    if (!btn) return;
    const category = btn.closest('.category');
    if (category) addTask(category);
});

// Gestion du markdown (protégé si les éléments sont absents)
const editor = document.querySelector('.markdown-editor');
const preview = document.querySelector('.markdown-preview');

if (editor && preview && typeof marked !== 'undefined') {
    function updatePreview() {
        const markdown = editor.value;
        preview.innerHTML = marked.parse(markdown);
    }

    editor.addEventListener('input', updatePreview);
    updatePreview();
} else if ((editor || preview) && typeof marked === 'undefined') {
    // Si l'utilisateur a inclus l'éditeur mais pas la lib marked, éviter les erreurs
    console.warn('marked.js non disponible — aperçu markdown désactivé');
}

function initPatternItem(item) {
    const textSpan = item.querySelector('.pattern-text');
    const deleteBtn = item.querySelector('.pattern-delete');

    function enableEditingOnSpan(span) {
        span.addEventListener('click', (e) => {
            const previousKey = item.dataset.pattern;
            // ensure this paterne is selected when starting edit
            document.querySelectorAll('.pattern-item').forEach(p => p.classList.remove('active'));
            item.classList.add('active');
            const current = span.textContent.trim();
            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'pattern-edit-input';
            input.value = current;
            span.replaceWith(input);
            input.focus();
            input.select();

            function finish(save) {
                const newValue = save ? input.value.trim() : current;
                const newSpan = document.createElement('span');
                newSpan.className = 'pattern-text';
                newSpan.textContent = newValue || current;
                input.replaceWith(newSpan);
                // Update dataset key if saved
                if (save && newValue) {
                    const key = normalizeName(newValue);
                    item.dataset.pattern = key;

                    // Update associated tab if present
                    const oldKey = previousKey;
                    const tab = document.querySelector(`.tab[data-tab="${oldKey}"]`);
                    if (tab) {
                        const newKey = key;
                        tab.dataset.tab = newKey;
                        // Replace display while preserving close button
                        tab.innerHTML = `${newValue} <span class="tab-close">×</span>`;
                        // Update corresponding panel dataset if present
                        const panel = document.querySelector(`.tab-content[data-tab="${oldKey}"]`);
                        if (panel) {
                            panel.dataset.tab = newKey;
                            // Also update the first category title in the panel to reflect the new name
                            const titleInput = panel.querySelector('.category-title');
                            if (titleInput) titleInput.value = newValue;
                        }
                        // Reattach close handler that also removes associated panel
                        const closeBtn = tab.querySelector('.tab-close');
                        if (closeBtn) {
                            closeBtn.addEventListener('click', (ev) => {
                                ev.stopPropagation();
                                if (confirm('Fermer cet onglet ?')) {
                                    const assocPanel = document.querySelector(`.tab-content[data-tab="${newKey}"]`);
                                    if (assocPanel) assocPanel.remove();
                                    tab.remove();
                                }
                            });
                        }
                    }
                }

                // Re-enable editing on the new span
                enableEditingOnSpan(newSpan);
            }

            input.addEventListener('blur', () => finish(true));
            input.addEventListener('keydown', (ev) => {
                if (ev.key === 'Enter') finish(true);
                if (ev.key === 'Escape') finish(false);
            });
        });
    }

    if (textSpan) enableEditingOnSpan(textSpan);

    if (deleteBtn) {
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (confirm('Supprimer ce paterne ?')) {
                item.remove();
            }
        });
    }
} 

    
// Gestion des paternes (utilise délégation et supporte suppression)
const patternList = document.querySelector('.pattern-list');
if (patternList) {
    // Helper pour normaliser un nom en clé (ex: "Paterne 1" -> "paterne-1")
    function normalizeName(name) {
        return name.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '');
    }

    // Initialiser les paternes existants : ajouter data-pattern et bouton de suppression si manquants
    document.querySelectorAll('.pattern-item').forEach(item => {
        const text = item.textContent.trim();
        const key = normalizeName(text);
        item.dataset.pattern = item.dataset.pattern || key;
        // Si pas de bouton de suppression, en ajouter un
        if (!item.querySelector('.pattern-delete')) {
            // Retirer l'ancien texte pour éviter duplication si innerHTML est utilisé
            const nameOnly = text.replace(/\u0078|×|\u2215|🗑️/g, '').trim();
            item.innerHTML = `<span class="pattern-text">${nameOnly}</span> <button class="pattern-delete" title="Supprimer">🗑️</button>`;
        }
        // Attach editing and delete handlers
        initPatternItem(item);
    });
    // Délégation : clic sur un élément de la liste
    patternList.addEventListener('click', (e) => {
        const item = e.target.closest('.pattern-item');
        if (!item) return;

        // Si l'utilisateur a cliqué sur le bouton de suppression
        if (e.target.classList.contains('pattern-delete')) {
            e.stopPropagation();
            if (confirm('Supprimer ce paterne ?')) {
                item.remove();
            }
            return;
        }

        // Sinon, sélectionner le paterne
        document.querySelectorAll('.pattern-item').forEach(p => p.classList.remove('active'));
        item.classList.add('active');
    });

    // Bouton ajouter paterne (protégé si absent)
    const addPatternBtn = document.querySelector('.add-pattern-btn');
    if (addPatternBtn) {
        addPatternBtn.addEventListener('click', () => {
            const patternName = prompt('Nom du nouveau paterne:');
            if (patternName) {
                const newPattern = createPattern(patternName);
                // Sélectionner le nouveau paterne
                document.querySelectorAll('.pattern-item').forEach(p => p.classList.remove('active'));
                newPattern.classList.add('active');
            }
        });
    }

    // Gérer les interactions avec les onglets : sélection, création de paterne associée et fermeture
    const tabs = document.querySelector('.tabs');
    if (tabs) {
        tabs.addEventListener('click', (e) => {
            const tab = e.target.closest('.tab');
            if (!tab) return;
            // Ignorer le bouton '+'
            if (tab.classList.contains('tab-add')) return;

            // Si on a cliqué sur la croix de fermeture
            if (e.target.classList.contains('tab-close')) {
                e.stopPropagation();
                if (confirm('Fermer cet onglet ?')) {
                    const key = tab.dataset.tab || normalizeName(tab.textContent.replace('×', '').trim());
                    // Supprimer le paterne associé si existe
                    const assoc = document.querySelector(`.pattern-item[data-pattern="${key}"]`);
                    if (assoc) assoc.remove();
                    tab.remove();
                }
                return;
            }

            // Sélectionner l'onglet
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Trouver ou créer le paterne associé
            const tabName = tab.textContent.replace('×', '').trim();
            const key = tab.dataset.tab || normalizeName(tabName);
            let targetPattern = document.querySelector(`.pattern-item[data-pattern="${key}"]`);
            if (!targetPattern) {
                targetPattern = document.createElement('li');
                targetPattern.className = 'pattern-item';
                targetPattern.dataset.pattern = key;
                targetPattern.innerHTML = `<span class="pattern-text">${tabName}</span> <button class="pattern-delete" title="Supprimer">🗑️</button>`;
                patternList.appendChild(targetPattern);
                initPatternItem(targetPattern);
            }
            document.querySelectorAll('.pattern-item').forEach(p => p.classList.remove('active'));
            targetPattern.classList.add('active');
            // Afficher le panneau associé à cet onglet/paterne
            showTabContent(key);
        });
    }
}

// Gestion des onglets et panels de contenu
// Convertit le contenu existant en panneau de tab (seulement la première fois)
function setupContentPanels() {
    const content = document.querySelector('.content');
    if (!content) return;
    let contentArea = document.querySelector('.content-area');
    if (!contentArea) {
        contentArea = document.createElement('div');
        contentArea.className = 'content-area';
        content.parentNode.insertBefore(contentArea, content);
    }
    // Déplacer le contenu existant dans le wrapper et en faire un panel
    contentArea.appendChild(content);
    content.classList.add('tab-content');
    const activeTab = document.querySelector('.tab.active');
    const key = (activeTab && (activeTab.dataset.tab || normalizeName(activeTab.textContent.replace('×','').trim()))) || 'default';
    content.dataset.tab = key;
}

// Create a new tab content panel with the same structure as the base panel
function createTabContent(key, name) {
    let existing = document.querySelector(`.tab-content[data-tab="${key}"]`);
    if (existing) return existing;

    // Try to clone the base panel (the first tab-content or the one marked 'default') so layout matches exactly
    const basePanel = document.querySelector('.tab-content[data-tab="default"]') || document.querySelector('.tab-content');
    let panel;
    if (basePanel) {
        panel = basePanel.cloneNode(true);
        panel.dataset.tab = key;
        // Remove any ids so duplicates don't clash
        panel.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));
        // Optionally reset content values if desired (keep layout identical)
        // If a name is provided, set the first category title to the tab name
        const firstTitle = panel.querySelector('.category-title');
        if (firstTitle && name) firstTitle.value = name;
        // Hide panel initially
        panel.style.display = 'none';
    } else {
        // Fallback: create a default structure
        panel = document.createElement('div');
        panel.className = 'tab-content';
        panel.dataset.tab = key;
        panel.innerHTML = `
            <div class="category">
                <h2><input type="text" class="category-title" value="${name || 'Nouvelle catégorie'}"></h2>
                <ul class="task-list">
                    <li class="task-item">
                        <div class="task-checkbox"></div>
                        <input type="text" class="task-text" value="Nouvelle tâche" placeholder="Entrez une tâche...">
                        <button class="task-delete">🗑️</button>
                        <button class="add-task-btn"> + Ajouter une tâche</button>
                    </li>
                </ul>
            </div>
            <div class="add-category">
                <button class="add-category-btn">+ Ajouter une catégorie</button>
            </div>
        `;
    }

    const contentArea = document.querySelector('.content-area') || document.querySelector('.main-section');
    if (contentArea) contentArea.appendChild(panel);

    // Initialize interactive parts inside the panel
    panel.querySelectorAll('.category').forEach(initCategory);
    // Initialize tasks inside (cloned task items need event handlers)
    panel.querySelectorAll('.task-item').forEach(initTaskItem);
    return panel;
}

// Show only the panel matching the key (create it if missing)
function showTabContent(key) {
    document.querySelectorAll('.tab-content').forEach(p => p.style.display = 'none');
    let panel = document.querySelector(`.tab-content[data-tab="${key}"]`);
    if (!panel) panel = createTabContent(key);
    panel.style.display = '';
    // synchronize pattern selection
    const assocPattern = document.querySelector(`.pattern-item[data-pattern="${key}"]`);
    document.querySelectorAll('.pattern-item').forEach(p => p.classList.remove('active'));
    if (assocPattern) assocPattern.classList.add('active');
}

// Attach close behavior to existing tabs and ensure associated panel is removed
document.querySelectorAll('.tab').forEach(tab => {
    const closeBtn = tab.querySelector('.tab-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (confirm('Fermer cet onglet ?')) {
                const key = tab.dataset.tab || normalizeName(tab.textContent.replace('×', '').trim());
                const panel = document.querySelector(`.tab-content[data-tab="${key}"]`);
                if (panel) panel.remove();
                tab.remove();
                // Activate first remaining tab
                const next = document.querySelector('.tab');
                if (next) {
                    next.classList.add('active');
                    const nextKey = next.dataset.tab || normalizeName(next.textContent.replace('×','').trim());
                    showTabContent(nextKey);
                }
            }
        });
    }
});

// Global helper pour créer un paterne (réutilisable)
function createPattern(name) {
    const key = normalizeName(name);
    let existing = document.querySelector(`.pattern-item[data-pattern="${key}"]`);
    if (existing) return existing;
    const newPattern = document.createElement('li');
    newPattern.className = 'pattern-item';
    newPattern.dataset.pattern = key;
    newPattern.innerHTML = `<span class="pattern-text">${name}</span> <button class="pattern-delete" title="Supprimer">🗑️</button>`;
    const patternListEl = document.querySelector('.pattern-list');
    if (patternListEl) {
        patternListEl.appendChild(newPattern);
        initPatternItem(newPattern);
        // Create a corresponding (hidden) content panel that matches the base layout
        createTabContent(key, name);
    }
    return newPattern;
}

// Show pattern modal and return a Promise resolved with the choice
function showPatternModal() {
    return new Promise((resolve) => {
        const modal = document.getElementById('pattern-modal');
        const list = modal.querySelector('.modal-pattern-list');
        const newInput = modal.querySelector('.modal-new-input');
        const btnCancel = modal.querySelector('.modal-cancel');
        const btnSelect = modal.querySelector('.modal-select');
        const btnCreate = modal.querySelector('.modal-create');

        // Populate list
        list.innerHTML = '';
        Array.from(document.querySelectorAll('.pattern-item')).forEach(p => {
            const li = document.createElement('li');
            li.className = 'modal-pattern-item';
            li.textContent = p.querySelector('.pattern-text') ? p.querySelector('.pattern-text').textContent.trim() : p.textContent.trim();
            li.dataset.pattern = p.dataset.pattern;
            li.addEventListener('click', () => {
                list.querySelectorAll('.modal-pattern-item').forEach(i => i.classList.remove('selected'));
                li.classList.add('selected');
                newInput.value = '';
            });
            list.appendChild(li);
        });

        newInput.value = '';
        modal.style.display = 'flex';
        modal.setAttribute('aria-hidden', 'false');

        // Handlers
        function cleanup() {
            modal.style.display = 'none';
            modal.setAttribute('aria-hidden', 'true');
            btnCancel.removeEventListener('click', onCancel);
            btnSelect.removeEventListener('click', onSelect);
            btnCreate.removeEventListener('click', onCreate);
            modal.removeEventListener('click', onOverlay);
        }
        function onCancel() { cleanup(); resolve(null); }
        function onSelect() {
            const sel = list.querySelector('.modal-pattern-item.selected');
            if (sel) { cleanup(); resolve({ type: 'existing', key: sel.dataset.pattern, name: sel.textContent.trim() }); }
            else { alert('Sélectionnez un paterne ou entrez un nouveau nom.'); }
        }
        function onCreate() {
            const v = newInput.value.trim();
            if (!v) { alert('Entrez le nom du nouveau paterne.'); newInput.focus(); return; }
            cleanup(); resolve({ type: 'new', name: v });
        }
        function onOverlay(e) { if (e.target === modal) { onCancel(); } }

        btnCancel.addEventListener('click', onCancel);
        btnSelect.addEventListener('click', onSelect);
        btnCreate.addEventListener('click', onCreate);
        modal.addEventListener('click', onOverlay);
    });
}

// Handle creation of a new tab (and create/show its content panel) with modal selection
document.querySelector('.tab-add').addEventListener('click', async () => {
    const tabName = prompt('Nom du nouvel onglet:');
    if (!tabName) return;
    const tabs = document.querySelector('.tabs');
    const addBtn = document.querySelector('.tab-add');

    // Show modal to choose or create a paterne
    const choice = await showPatternModal();
    if (choice === null) return; // cancelled

    let chosenPattern;
    if (choice.type === 'existing') {
        chosenPattern = document.querySelector(`.pattern-item[data-pattern="${choice.key}"]`);
    } else if (choice.type === 'new') {
        chosenPattern = createPattern(choice.name);
    }

    if (!chosenPattern) return; // nothing chosen/failed

    const patternKey = chosenPattern.dataset.pattern || normalizeName(chosenPattern.querySelector('.pattern-text').textContent.trim());

    // Créer l'onglet et l'associer au paterne choisi
    const newTab = document.createElement('button');
    newTab.className = 'tab';
    newTab.dataset.tab = patternKey;
    newTab.innerHTML = `${tabName} <span class="tab-close">×</span>`;
    tabs.insertBefore(newTab, addBtn);

    // Événement fermeture (supprime aussi le paterne associé)
    const newCloseBtn = newTab.querySelector('.tab-close');
    newCloseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (confirm('Fermer cet onglet ?')) {
            const assoc = document.querySelector(`.pattern-item[data-pattern="${patternKey}"]`);
            if (assoc) assoc.remove();
            const panel = document.querySelector(`.tab-content[data-tab="${patternKey}"]`);
            if (panel) panel.remove();
            newTab.remove();
            // Activate first remaining tab and its panel
            const next = document.querySelector('.tab');
            if (next) {
                next.classList.add('active');
                const nextKey = next.dataset.tab || normalizeName(next.textContent.replace('×','').trim());
                showTabContent(nextKey);
            }
        }
    });

    // Sélectionner l'onglet et le paterne
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    newTab.classList.add('active');
    document.querySelectorAll('.pattern-item').forEach(p => p.classList.remove('active'));
    chosenPattern.classList.add('active');

    // Créer et afficher le panneau associé
    createTabContent(patternKey, tabName);
    showTabContent(patternKey);
});

document.querySelector('.save-btn').addEventListener('click', () => {
    alert('Fonction de sauvegarde non implémentée.');
});

// Gestion des catégories : helper pour initialiser une catégorie (supprimer + comportement interne)
function initCategory(category) {
    // Wrap header if needed
    let header = category.querySelector('.category-header');
    const existingH2 = category.querySelector('h2');
    if (!header) {
        header = document.createElement('div');
        header.className = 'category-header';
        if (existingH2) {
            header.appendChild(existingH2);
        } else {
            const h2 = document.createElement('h2');
            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'category-title';
            input.value = '';
            h2.appendChild(input);
            header.appendChild(h2);
        }
        category.insertBefore(header, category.firstChild);
    }

    // Ensure there's a delete button and attach handler (avoid double-binding)
    let delBtn = category.querySelector('.category-delete');
    if (!delBtn) {
        delBtn = document.createElement('button');
        delBtn.className = 'category-delete';
        delBtn.title = 'Supprimer la catégorie';
        delBtn.textContent = '❌';
        header.appendChild(delBtn);
    }
    // Attach handler if not already attached
    if (!delBtn.dataset.inited) {
        delBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (confirm('Supprimer cette catégorie ?')) {
                // animate removal then remove
                category.classList.add('category-removing');
                category.addEventListener('animationend', () => category.remove(), { once: true });
            }
        });
        delBtn.dataset.inited = '1';
    }

    // Init tasks inside category
    category.querySelectorAll('.task-item').forEach(initTaskItem);
}

// Initialize categories that already exist
document.querySelectorAll('.category').forEach(initCategory);

// Setup content panels and show the current active tab's panel (if any)
setupContentPanels();
const initialTab = document.querySelector('.tab.active');
if (initialTab) showTabContent(initialTab.dataset.tab || normalizeName(initialTab.textContent.replace('×','').trim()));

// Delegated handler pour l'ajout de catégorie par panneau (fonctionne pour plusieurs panels)
document.addEventListener('click', (e) => {
    const btn = e.target.closest('.add-category-btn');
    if (!btn) return;
    const contentPanel = btn.closest('.tab-content');
    if (!contentPanel) return;

    const categoryName = prompt('Nom de la nouvelle catégorie:');
    if (!categoryName) return;

    const addWrapper = contentPanel.querySelector('.add-category');
    const newCategory = document.createElement('div');
    newCategory.className = 'category';
    newCategory.innerHTML = `
        <div class="category-header">
            <h2><input type="text" class="category-title" value="${categoryName}"></h2>
            <button class="category-delete" title="Supprimer la catégorie">❌</button>
        </div>
        <ul class="task-list">
            <li class="task-item">
                <div class="task-checkbox"></div>
                <input type="text" class="task-text" value="Nouvelle tâche" placeholder="Entrez une tâche...">
                <button class="task-delete">🗑️</button>
                <button class="add-task-btn"> + Ajouter une tâche</button>
            </li>
        </ul>
    `;

    if (addWrapper && addWrapper.parentNode) {
        addWrapper.parentNode.insertBefore(newCategory, addWrapper);
    } else {
        contentPanel.appendChild(newCategory);
    }

    initCategory(newCategory);
    const firstInput = newCategory.querySelector('.task-text');
    if (firstInput) {
        firstInput.focus();
        firstInput.select();
    }
});