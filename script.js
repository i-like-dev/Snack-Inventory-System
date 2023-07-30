document.addEventListener('DOMContentLoaded', function () {
  const snackNameInput = document.getElementById('snack-name');
  const quantityInput = document.getElementById('quantity');
  const inventoryItemsList = document.getElementById('inventory-items');
  const totalQuantitySpan = document.getElementById('total-quantity');
  const outStockItemSelect = document.getElementById('out-stock-item');
  const quantityToRemoveInput = document.getElementById('quantity-to-remove');

  // 初始化資料
  let inventory = [];
  const savedInventory = localStorage.getItem('inventory');
  if (savedInventory) {
    inventory = JSON.parse(savedInventory);
    updateInventoryDisplay();
    updateStockActions();
  }

  function addItem() {
    const snackName = snackNameInput.value;
    const quantity = parseInt(quantityInput.value);

    if (snackName.trim() === '' || Number.isNaN(quantity) || quantity <= 0) {
      alert('請輸入有效的零食名稱和數量。');
      return;
    }

    const newItem = {
      name: snackName,
      quantity: quantity,
    };

    inventory.push(newItem);
    updateInventoryDisplay();
    updateStockActions();
    saveInventory();
    snackNameInput.value = ''; // 清空輸入框
    quantityInput.value = ''; // 清空輸入框
  }

  function updateInventoryDisplay() {
    totalQuantitySpan.textContent = calculateTotalQuantity();

    while (inventoryItemsList.firstChild) {
      inventoryItemsList.removeChild(inventoryItemsList.firstChild);
    }

    inventory.forEach((item, index) => {
      const li = document.createElement('li');
      li.textContent = `${item.name}: ${item.quantity}`;
      inventoryItemsList.appendChild(li);
    });
  }

  function calculateTotalQuantity() {
    let total = 0;
    inventory.forEach((item) => {
      total += item.quantity;
    });
    return total;
  }

  function updateStockActions() {
    while (outStockItemSelect.firstChild) {
      outStockItemSelect.removeChild(outStockItemSelect.firstChild);
    }

    inventory.forEach((item, index) => {
      const option = document.createElement('option');
      option.textContent = `${item.name}: ${item.quantity}`;
      option.value = index;
      outStockItemSelect.appendChild(option);
    });
  }

  function removeItem() {
    const selectedIndex = outStockItemSelect.value;
    const quantityToRemove = parseInt(quantityToRemoveInput.value);

    if (Number.isNaN(quantityToRemove) || quantityToRemove <= 0) {
      alert('出庫數量應為正整數。');
      return;
    }

    if (selectedIndex >= 0) {
      const selectedItem = inventory[selectedIndex];
      if (selectedItem.quantity < quantityToRemove) {
        alert('出庫數量超過庫存數量。');
        return;
      }
      selectedItem.quantity -= quantityToRemove;
      updateInventoryDisplay();
      updateStockActions();
      saveInventory();
    }
  }

  function saveInventory() {
    localStorage.setItem('inventory', JSON.stringify(inventory));
  }

  const addButton = document.getElementById('add-button');
  const removeButton = document.getElementById('remove-button');

  addButton.addEventListener('click', addItem);
  removeButton.addEventListener('click', removeItem);
});
