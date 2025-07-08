/*=============== display saved cards ===============*/

window.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('saved-excuses-container');
  const saved = JSON.parse(localStorage.getItem('savedExcuses')) || [];

  if (saved.length === 0) {
    container.innerHTML = '<p>No saved excuses yet.</p>';
    return;
  }

  saved.forEach((excuse, index) => {
    const card = document.createElement('div');
    card.className = 'excuse-card';

    card.innerHTML = `
      <h3 class="excuse-heading">Excuse #${index + 1}</h3>
      <p class="excuse-text">${excuse.excuse}</p>
      <div class="excuse-meta">
        <div class="meta-item">
          <span class="meta-label">Wack:</span>
          <span class="meta-value">${excuse.wackometer}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Believability:</span>
          <span class="meta-value">${excuse.believability}</span>
        </div>
      </div>
      <button class="delete-btn" data-index="${index}">
        <i class="ri-delete-bin-line"></i> Delete
      </button>
    `;

    container.appendChild(card);
  });

  container.addEventListener('click', (e) => {
    if (e.target.closest('.delete-btn')) {
      const index = parseInt(e.target.closest('.delete-btn').dataset.index);
      saved.splice(index, 1);
      localStorage.setItem('savedExcuses', JSON.stringify(saved));
      location.reload();
    }
  });
});
