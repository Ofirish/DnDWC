export function saveCharacter() {
    const character = {
      name: document.getElementById('characterName').value,
      race: document.getElementById('characterRace').value,
      equipment: Array.from(document.querySelectorAll('#equipmentTable tbody tr')).map(row => ({
        name: row.querySelector('input[type="text"]').value,
        weight: row.querySelector('input[type="number"]').value,
        quantity: row.querySelectorAll('input[type="number"]')[1].value,
      })),
    };
    localStorage.setItem('character', JSON.stringify(character));
    alert('Character saved!');
  }
  
  export function loadCharacter() {
    const character = JSON.parse(localStorage.getItem('character'));
    if (character) {
      document.getElementById('characterName').value = character.name;
      document.getElementById('characterRace').value = character.race;
      const table = document.getElementById('equipmentTable').getElementsByTagName('tbody')[0];
      table.innerHTML = '';
      character.equipment.forEach(item => {
        const newRow = table.insertRow();
        newRow.innerHTML = `
          <td><input type="text" class="form-control" value="${item.name}"></td>
          <td><input type="number" class="form-control" value="${item.weight}"></td>
          <td><input type="number" class="form-control" value="${item.quantity}"></td>
          <td><button class="btn btn-danger">Delete</button></td>
        `;
        newRow.querySelector('button').addEventListener('click', () => table.deleteRow(newRow.rowIndex));
      });
      alert('Character loaded!');
    } else {
      alert('No saved character found!');
    }
  }
  
  export function clearData() {
    localStorage.removeItem('character');
    document.getElementById('characterName').value = '';
    document.getElementById('characterRace').value = '';
    document.getElementById('equipmentTable').getElementsByTagName('tbody')[0].innerHTML = '';
    alert('Data cleared!');
  }