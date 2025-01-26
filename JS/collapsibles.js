export function setupCollapsibles() {
    const collapsibleButtons = document.querySelectorAll('.collapsible-button');
    collapsibleButtons.forEach(button => {
      button.addEventListener('click', () => {
        const content = button.nextElementSibling;
        content.classList.toggle('open');
      });
    });
  }