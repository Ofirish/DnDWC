document.getElementById('strength').addEventListener('input', updateStrengthFormula);

function increaseTextSize() {
    document.body.style.fontSize = 'larger';
}

function decreaseTextSize() {
    document.body.style.fontSize = 'smaller';
}

function updateStrengthFormula() {
    const strength = document.getElementById('strength').value;
    document.getElementById('strengthFormula').textContent = `Strength: ${strength}`;
}

function addModifier() {
    const itemName = prompt("Enter item name:");
    const strengthValue = prompt("Enter strength modification value:");
    if (itemName && strengthValue) {
        const modifiersDiv = document.getElementById('modifiers');
        const newModifier = document.createElement('div');
        newModifier.textContent = `${itemName}: ${strengthValue}`;
        modifiersDiv.appendChild(newModifier);
    }
}

function addEquipment() {
    const table = document.getElementById('equipmentTable').getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();
    const itemCell = newRow.insertCell(0);
    const weightCell = newRow.insertCell(1);
    const quantityCell = newRow.insertCell(2);
    const priceCell = newRow.insertCell(3);
    const slotsCell = newRow.insertCell(4);
    const actionCell = newRow.insertCell(5);

    const itemInput = document.createElement('input');
    itemInput.type = 'text';
    itemInput.value = 'New Item';
    itemCell.appendChild(itemInput);

    const weightInput = document.createElement('input');
    weightInput.type = 'number';
    weightInput.value = '0';
    weightInput.oninput = updateSlots;
    weightCell.appendChild(weightInput);

    const quantityInput = document.createElement('input');
    quantityInput.type = 'number';
    quantityInput.value = '1';
    quantityCell.appendChild(quantityInput);

    const priceInput = document.createElement('input');
    priceInput.type = 'number';
    priceInput.value = '0';
    priceInput.readOnly = true;
    priceCell.appendChild(priceInput);

    const slotsInput = document.createElement('input');
    slotsInput.type = 'number';
    slotsInput.value = '0';
    slotsInput.readOnly = true;
    slotsCell.appendChild(slotsInput);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', function() {
        table.deleteRow(newRow.rowIndex - 1);
    });
    actionCell.appendChild(deleteButton);

    updateSlots();
}

function updateSlots() {
    const table = document.getElementById('equipmentTable').getElementsByTagName('tbody')[0];
    for (let i = 0; i < table.rows.length; i++) {
        const row = table.rows[i];
        const weight = parseFloat(row.cells[1].getElementsByTagName('input')[0].value);
        const slots = Math.ceil(weight / 100);
        row.cells[4].getElementsByTagName('input')[0].value = slots;
    }
}

function saveCharacterToXML() {
    const characterName = document.getElementById('characterName').value;
    const characterRace = document.getElementById('characterRace').value;
    const strength = document.getElementById('strength').value;
    const equipmentTable = document.getElementById('equipmentTable').getElementsByTagName('tbody')[0];
    let equipmentData = [];

    for (let i = 0; i < equipmentTable.rows.length; i++) {
        const row = equipmentTable.rows[i];
        equipmentData.push({
            item: row.cells[0].getElementsByTagName('input')[0].value,
            weight: row.cells[1].getElementsByTagName('input')[0].value,
            quantity: row.cells[2].getElementsByTagName('input')[0].value,
            price: row.cells[3].getElementsByTagName('input')[0].value,
            slots: row.cells[4].getElementsByTagName('input')[0].value
        });
    }

    const characterData = {
        name: characterName,
        race: characterRace,
        strength: strength,
        equipment: equipmentData
    };

    const xmlData = new XMLSerializer().serializeToString(jsonToXml(characterData));
    const blob = new Blob([xmlData], { type: 'application/xml' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${characterName}.xml`;
    link.click();
}

function printCharacterSheet() {
    window.print();
}

function jsonToXml(json) {
    const xml = document.implementation.createDocument('', '', null);
    const root = xml.createElement('character');
    xml.appendChild(root);

    for (const key in json) {
        if (json.hasOwnProperty(key)) {
            const element = xml.createElement(key);
            if (Array.isArray(json[key])) {
                json[key].forEach(item => {
                    const itemElement = xml.createElement('item');
                    for (const itemKey in item) {
                        if (item.hasOwnProperty(itemKey)) {
                            const itemChild = xml.createElement(itemKey);
                            itemChild.textContent = item[itemKey];
                            itemElement.appendChild(itemChild);
                        }
                    }
                    element.appendChild(itemElement);
                });
            } else {
                element.textContent = json[key];
            }
            root.appendChild(element);
        }
    }

    return xml;
}

// Secret button to show/hide the price list
document.addEventListener('DOMContentLoaded', function() {
    const secretButton = document.createElement('button');
    secretButton.textContent = 'Toggle Price List';
    secretButton.style.display = 'none';
    secretButton.addEventListener('click', function() {
        const priceInputs = document.querySelectorAll('#equipmentTable input[type="number"][readonly]');
        priceInputs.forEach(input => {
            input.style.display = input.style.display === 'none' ? '' : 'none';
        });
    });
    document.body.appendChild(secretButton);

    document.addEventListener('keydown', function(event) {
        if (event.ctrlKey && event.key === 'p') {
            secretButton.style.display = secretButton.style.display === 'none' ? '' : 'none';
        }
    });
});
