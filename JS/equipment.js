export function addEquipment() {
    const table = document.getElementById('equipmentTable').getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();
    newRow.innerHTML = `
      <td><input type="text" class="form-control" placeholder="Item Name"></td>
      <td><input type="number" class="form-control" placeholder="Weight"></td>
      <td><input type="number" class="form-control" placeholder="Quantity"></td>
      <td><button class="btn btn-danger">Delete</button></td>
    `;
    newRow.querySelector('button').addEventListener('click', () => table.deleteRow(newRow.rowIndex));
  }
  
  export function calculateTotalWeight() {
    const rows = document.querySelectorAll('#equipmentTable tbody tr');
    let totalWeight = 0;
    rows.forEach(row => {
      const weight = parseFloat(row.querySelector('input[type="number"]').value) || 0;
      const quantity = parseFloat(row.querySelectorAll('input[type="number"]')[1].value) || 0;
      totalWeight += weight * quantity;
    });
    document.getElementById('totalWeight').textContent = `${totalWeight} lbs`;
  }