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
    const modifiersDiv = document.getElementById('modifiers');
    const newModifier = document.createElement('div');
    newModifier.textContent = 'New Modifier';
    modifiersDiv.appendChild(newModifier);
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

    itemCell.textContent = 'New Item';
    weightCell.textContent = '0';
    quantityCell.textContent = '1';
    priceCell.textContent = '0';
    slotsCell.textContent = '0';
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', function() {
        table.deleteRow(newRow.rowIndex - 1);
    });
    actionCell.appendChild(deleteButton);
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
            item: row.cells[0].textContent,
            weight: row.cells[1].textContent,
            quantity: row.cells[2].textContent,
            price: row.cells[3].textContent,
            slots: row.cells[4].textContent
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
