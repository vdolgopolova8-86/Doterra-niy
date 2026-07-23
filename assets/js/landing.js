"use strict";

const STORAGE_KEY = "doterra_oil_inventory_v1";

function getOilStatus(oil) {
  const bottleVolume = Number(oil.bottleVolume) || 15;
  const sealedBottles = Math.floor(Number(oil.sealedBottles) || 0);
  const remainingVolume = Number(oil.remainingVolume) || 0;
  const equivalentBottles =
    sealedBottles + (bottleVolume > 0 ? remainingVolume / bottleVolume : 0);
  const minimumStock = Math.floor(Number(oil.minimumStock) || 0);

  if (equivalentBottles <= 0) {
    return "missing";
  }

  if (equivalentBottles < minimumStock) {
    return "low";
  }

  return "available";
}

function getPurchaseQuantity(oil) {
  const minimumStock = Math.floor(Number(oil.minimumStock) || 0);
  const bottleVolume = Number(oil.bottleVolume) || 15;
  const sealedBottles = Math.floor(Number(oil.sealedBottles) || 0);
  const remainingVolume = Number(oil.remainingVolume) || 0;
  const equivalentBottles =
    sealedBottles + (bottleVolume > 0 ? remainingVolume / bottleVolume : 0);
  const manualQuantity = Math.floor(Number(oil.manualPurchaseQuantity) || 0);

  let automaticQuantity = 0;

  if (oil.autoPurchase !== false && equivalentBottles < minimumStock) {
    automaticQuantity = Math.max(0, Math.ceil(minimumStock - equivalentBottles));
  }

  return Math.max(automaticQuantity, manualQuantity);
}

function loadOils() {
  try {
    const savedData = localStorage.getItem(STORAGE_KEY);

    if (!savedData) {
      return [];
    }

    const parsedData = JSON.parse(savedData);
    return Array.isArray(parsedData) ? parsedData : [];
  } catch {
    return [];
  }
}

function renderPreviewStats() {
  const oils = loadOils();
  const totalNames = oils.length;
  const totalBottles = oils.reduce(
    (sum, oil) =>
      sum +
      Math.floor(Number(oil.sealedBottles) || 0) +
      Math.floor(Number(oil.openedBottles) || 0),
    0
  );
  const availableCount = oils.filter((oil) => getOilStatus(oil) === "available").length;
  const shoppingCount = oils.filter((oil) => getPurchaseQuantity(oil) > 0).length;

  document.getElementById("previewTotalNames").textContent = String(totalNames);
  document.getElementById("previewTotalBottles").textContent = String(totalBottles);
  document.getElementById("previewAvailable").textContent = String(availableCount);
  document.getElementById("previewShopping").textContent = String(shoppingCount);

  const note = document.getElementById("previewNote");

  if (totalNames === 0) {
    note.textContent =
      "Коллекция пока пуста. Откройте приложение — при первом запуске добавятся примеры масел.";
    return;
  }

  note.textContent =
    shoppingCount > 0
      ? `Сейчас ${shoppingCount} позиций ждут пополнения. Откройте приложение, чтобы посмотреть список покупок.`
      : "Запас в норме. Все данные синхронизированы с вашим браузером.";
}

renderPreviewStats();
