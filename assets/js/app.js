"use strict";

    /* =========================================================
       ДОКУМЕНТАЦИЯ ПО JAVASCRIPT

       Приложение хранит массив объектов масел в localStorage.

       Пример одного объекта:

       {
         id: "уникальный идентификатор",
         name: "Лаванда",
         category: "Одиночное масло",
         bottleVolume: 15,
         sealedBottles: 1,
         openedBottles: 1,
         remainingVolume: 5,
         minimumStock: 1,
         manualPurchaseQuantity: 0,
         autoPurchase: true,
         priority: "Обычный",
         notes: "Для сна",
         createdAt: "дата создания",
         updatedAt: "дата обновления"
       }

       Ключ localStorage:
       doterra_oil_inventory_v1
       ========================================================= */

    const STORAGE_KEY = "doterra_oil_inventory_v1";

    /* =========================================================
       1. ПОЛУЧЕНИЕ ЭЛЕМЕНТОВ СТРАНИЦЫ
       ========================================================= */

    const elements = {
      oilForm: document.getElementById("oilForm"),
      editingOilId: document.getElementById("editingOilId"),
      formTitle: document.getElementById("formTitle"),
      saveOilButton: document.getElementById("saveOilButton"),
      cancelEditButton: document.getElementById("cancelEditButton"),

      oilName: document.getElementById("oilName"),
      oilCategory: document.getElementById("oilCategory"),
      bottleVolume: document.getElementById("bottleVolume"),
      customVolumeGroup: document.getElementById("customVolumeGroup"),
      customVolume: document.getElementById("customVolume"),
      sealedBottles: document.getElementById("sealedBottles"),
      openedBottles: document.getElementById("openedBottles"),
      remainingVolume: document.getElementById("remainingVolume"),
      minimumStock: document.getElementById("minimumStock"),
      purchaseQuantity: document.getElementById("purchaseQuantity"),
      autoPurchase: document.getElementById("autoPurchase"),
      purchasePriority: document.getElementById("purchasePriority"),
      oilNotes: document.getElementById("oilNotes"),

      searchInput: document.getElementById("searchInput"),
      statusFilter: document.getElementById("statusFilter"),
      categoryFilter: document.getElementById("categoryFilter"),

      oilTableBody: document.getElementById("oilTableBody"),
      mobileCardsContainer:
        document.getElementById("mobileCardsContainer"),
      emptyState: document.getElementById("emptyState"),
      emptyStateTitle: document.getElementById("emptyStateTitle"),
      emptyStateText: document.getElementById("emptyStateText"),
      desktopTableWrapper:
        document.getElementById("desktopTableWrapper"),
      visibleRecordsText:
        document.getElementById("visibleRecordsText"),

      totalNamesStatistic:
        document.getElementById("totalNamesStatistic"),
      totalBottlesStatistic:
        document.getElementById("totalBottlesStatistic"),
      availableStatistic:
        document.getElementById("availableStatistic"),
      lowStockStatistic:
        document.getElementById("lowStockStatistic"),
      shoppingStatistic:
        document.getElementById("shoppingStatistic"),

      openShoppingListButton:
        document.getElementById("openShoppingListButton"),
      shoppingModal: document.getElementById("shoppingModal"),
      shoppingListContainer:
        document.getElementById("shoppingListContainer"),
      emptyShoppingState:
        document.getElementById("emptyShoppingState"),
      closeShoppingModalButton:
        document.getElementById("closeShoppingModalButton"),
      closeShoppingModalFooterButton:
        document.getElementById("closeShoppingModalFooterButton"),
      copyShoppingListButton:
        document.getElementById("copyShoppingListButton"),
      exportCsvButton:
        document.getElementById("exportCsvButton"),

      exportButton: document.getElementById("exportButton"),
      importButton: document.getElementById("importButton"),
      importFileInput: document.getElementById("importFileInput"),
      clearAllButton: document.getElementById("clearAllButton"),

      toastContainer: document.getElementById("toastContainer")
    };

    /* =========================================================
       2. СОСТОЯНИЕ ПРИЛОЖЕНИЯ
       ========================================================= */

    let oils = loadOilsFromStorage();

    /* =========================================================
       3. ПРИМЕРЫ МАСЕЛ ПРИ ПЕРВОМ ЗАПУСКЕ

       Если вы хотите запускать приложение с пустым списком,
       удалите вызов addExampleOilsIfNeeded() ниже.
       ========================================================= */

    function addExampleOilsIfNeeded() {
      const hasOpenedApplicationBefore =
        localStorage.getItem(`${STORAGE_KEY}_initialized`);

      if (hasOpenedApplicationBefore) {
        return;
      }

      oils = [
        {
          id: generateId(),
          name: "Лаванда",
          category: "Одиночное масло",
          bottleVolume: 15,
          sealedBottles: 1,
          openedBottles: 1,
          remainingVolume: 7,
          minimumStock: 1,
          manualPurchaseQuantity: 0,
          autoPurchase: true,
          priority: "Обычный",
          notes: "Для расслабления и вечерних ритуалов.",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: generateId(),
          name: "Лимон",
          category: "Одиночное масло",
          bottleVolume: 15,
          sealedBottles: 0,
          openedBottles: 1,
          remainingVolume: 2,
          minimumStock: 2,
          manualPurchaseQuantity: 0,
          autoPurchase: true,
          priority: "Высокий",
          notes: "Используется часто, желательно иметь запас.",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: generateId(),
          name: "On Guard",
          category: "Смесь",
          bottleVolume: 15,
          sealedBottles: 0,
          openedBottles: 0,
          remainingVolume: 0,
          minimumStock: 1,
          manualPurchaseQuantity: 1,
          autoPurchase: true,
          priority: "Срочный",
          notes: "Добавить в ближайший заказ.",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];

      localStorage.setItem(`${STORAGE_KEY}_initialized`, "true");
      saveOilsToStorage();
    }

    addExampleOilsIfNeeded();

    /* =========================================================
       4. РАБОТА С LOCALSTORAGE
       ========================================================= */

    function loadOilsFromStorage() {
      try {
        const savedData = localStorage.getItem(STORAGE_KEY);

        if (!savedData) {
          return [];
        }

        const parsedData = JSON.parse(savedData);

        if (!Array.isArray(parsedData)) {
          return [];
        }

        return parsedData;
      } catch (error) {
        console.error("Ошибка чтения данных:", error);
        return [];
      }
    }

    function saveOilsToStorage() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(oils));
      } catch (error) {
        console.error("Ошибка сохранения данных:", error);

        showToast(
          "Не удалось сохранить данные в браузере.",
          "error"
        );
      }
    }

    /* =========================================================
       5. ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
       ========================================================= */

    function generateId() {
      if (
        typeof crypto !== "undefined" &&
        typeof crypto.randomUUID === "function"
      ) {
        return crypto.randomUUID();
      }

      return (
        Date.now().toString(36) +
        Math.random().toString(36).slice(2)
      );
    }

    function toNonNegativeNumber(value) {
      const number = Number(value);

      if (!Number.isFinite(number) || number < 0) {
        return 0;
      }

      return number;
    }

    function formatNumber(value) {
      return new Intl.NumberFormat("ru-RU", {
        maximumFractionDigits: 1
      }).format(toNonNegativeNumber(value));
    }

    function escapeHtml(value) {
      return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
    }

    function getBottleVolume(oil) {
      return toNonNegativeNumber(oil.bottleVolume);
    }

    function getTotalBottles(oil) {
      return (
        toNonNegativeNumber(oil.sealedBottles) +
        toNonNegativeNumber(oil.openedBottles)
      );
    }

    /*
      Расчёт фактического эквивалента полных флаконов.

      Пример:
      1 закрытый флакон 15 мл + остаток 7,5 мл
      = 1,5 условного полного флакона.
    */
    function getEquivalentBottleCount(oil) {
      const bottleVolume = getBottleVolume(oil);
      const sealedBottles =
        toNonNegativeNumber(oil.sealedBottles);
      const remainingVolume =
        toNonNegativeNumber(oil.remainingVolume);

      if (bottleVolume <= 0) {
        return sealedBottles;
      }

      return sealedBottles + remainingVolume / bottleVolume;
    }

    /*
      Автоматически рассчитывает, сколько флаконов нужно купить,
      чтобы запас достиг минимального значения.
    */
    function getAutomaticPurchaseQuantity(oil) {
      if (!oil.autoPurchase) {
        return 0;
      }

      const minimumStock =
        toNonNegativeNumber(oil.minimumStock);
      const currentEquivalent = getEquivalentBottleCount(oil);

      return Math.max(
        0,
        Math.ceil(minimumStock - currentEquivalent)
      );
    }

    /*
      Итоговое количество покупки.

      Используется максимальное значение из:
      1. автоматического расчёта;
      2. указанного вручную количества.

      Поэтому ручное значение не дублирует автоматическое.
    */
    function getPurchaseQuantity(oil) {
      const automaticQuantity =
        getAutomaticPurchaseQuantity(oil);

      const manualQuantity =
        toNonNegativeNumber(oil.manualPurchaseQuantity);

      return Math.max(automaticQuantity, manualQuantity);
    }

    function getOilStatus(oil) {
      const equivalentBottles = getEquivalentBottleCount(oil);
      const minimumStock =
        toNonNegativeNumber(oil.minimumStock);

      if (equivalentBottles <= 0) {
        return {
          key: "missing",
          label: "Нет в наличии",
          badgeClass: "badge-danger"
        };
      }

      if (equivalentBottles < minimumStock) {
        return {
          key: "low",
          label: "Заканчивается",
          badgeClass: "badge-warning"
        };
      }

      return {
        key: "available",
        label: "В наличии",
        badgeClass: "badge-success"
      };
    }

    function getPriorityWeight(priority) {
      const weights = {
        "Срочный": 3,
        "Высокий": 2,
        "Обычный": 1
      };

      return weights[priority] || 1;
    }

    function getOilColor(oil) {
      const colors = {
        "Одиночное масло": "#668b67",
        "Смесь": "#a7794f",
        "Роллер": "#9670a7",
        "Детская коллекция": "#5d8fa5",
        "Кулинарное применение": "#c28a43",
        "Другое": "#777d78"
      };

      return colors[oil.category] || colors["Другое"];
    }

    /* =========================================================
       6. ФИЛЬТРАЦИЯ И СОРТИРОВКА
       ========================================================= */

    function getFilteredOils() {
      const searchText =
        elements.searchInput.value.trim().toLowerCase();

      const selectedStatus = elements.statusFilter.value;
      const selectedCategory = elements.categoryFilter.value;

      return oils
        .filter((oil) => {
          const searchableText = [
            oil.name,
            oil.category,
            oil.notes,
            oil.priority
          ]
            .join(" ")
            .toLowerCase();

          const matchesSearch =
            !searchText || searchableText.includes(searchText);

          const status = getOilStatus(oil);

          let matchesStatus = true;

          if (selectedStatus === "shopping") {
            matchesStatus = getPurchaseQuantity(oil) > 0;
          } else if (selectedStatus !== "all") {
            matchesStatus = status.key === selectedStatus;
          }

          const matchesCategory =
            selectedCategory === "all" ||
            oil.category === selectedCategory;

          return (
            matchesSearch &&
            matchesStatus &&
            matchesCategory
          );
        })
        .sort((firstOil, secondOil) => {
          const purchaseDifference =
            getPurchaseQuantity(secondOil) -
            getPurchaseQuantity(firstOil);

          if (purchaseDifference !== 0) {
            return purchaseDifference;
          }

          return firstOil.name.localeCompare(
            secondOil.name,
            "ru"
          );
        });
    }

    /* =========================================================
       7. ОТРИСОВКА ПРИЛОЖЕНИЯ
       ========================================================= */

    function renderApplication() {
      renderCategoryFilter();
      renderStatistics();
      renderOilList();
      renderShoppingList();
    }

    function renderStatistics() {
      const totalNames = oils.length;

      const totalBottles = oils.reduce(
        (sum, oil) => sum + getTotalBottles(oil),
        0
      );

      const availableCount = oils.filter(
        (oil) => getOilStatus(oil).key === "available"
      ).length;

      const lowStockCount = oils.filter(
        (oil) => getOilStatus(oil).key === "low"
      ).length;

      const shoppingCount = oils.filter(
        (oil) => getPurchaseQuantity(oil) > 0
      ).length;

      elements.totalNamesStatistic.textContent =
        formatNumber(totalNames);

      elements.totalBottlesStatistic.textContent =
        formatNumber(totalBottles);

      elements.availableStatistic.textContent =
        formatNumber(availableCount);

      elements.lowStockStatistic.textContent =
        formatNumber(lowStockCount);

      elements.shoppingStatistic.textContent =
        formatNumber(shoppingCount);
    }

    function renderCategoryFilter() {
      const currentValue = elements.categoryFilter.value;

      const categories = [
        ...new Set(
          oils
            .map((oil) => oil.category)
            .filter(Boolean)
        )
      ].sort((a, b) => a.localeCompare(b, "ru"));

      elements.categoryFilter.innerHTML =
        '<option value="all">Все категории</option>';

      categories.forEach((category) => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        elements.categoryFilter.appendChild(option);
      });

      const valueStillExists =
        currentValue === "all" ||
        categories.includes(currentValue);

      elements.categoryFilter.value =
        valueStillExists ? currentValue : "all";
    }

    function renderOilList() {
      const filteredOils = getFilteredOils();

      elements.visibleRecordsText.textContent =
        `Показано: ${filteredOils.length} из ${oils.length}`;

      elements.oilTableBody.innerHTML = "";
      elements.mobileCardsContainer.innerHTML = "";

      if (filteredOils.length === 0) {
        elements.desktopTableWrapper.classList.add("hidden");
        elements.mobileCardsContainer.classList.add("hidden");
        elements.emptyState.classList.remove("hidden");

        if (oils.length === 0) {
          elements.emptyStateTitle.textContent =
            "Масла пока не добавлены";

          elements.emptyStateText.textContent =
            "Заполните форму, чтобы добавить первое эфирное масло в вашу коллекцию.";
        } else {
          elements.emptyStateTitle.textContent =
            "Ничего не найдено";

          elements.emptyStateText.textContent =
            "Попробуйте изменить поисковый запрос или выбранные фильтры.";
        }

        return;
      }

      elements.desktopTableWrapper.classList.remove("hidden");
      elements.mobileCardsContainer.classList.remove("hidden");
      elements.emptyState.classList.add("hidden");

      filteredOils.forEach((oil) => {
        elements.oilTableBody.insertAdjacentHTML(
          "beforeend",
          createDesktopTableRow(oil)
        );

        elements.mobileCardsContainer.insertAdjacentHTML(
          "beforeend",
          createMobileOilCard(oil)
        );
      });
    }

    function createDesktopTableRow(oil) {
      const status = getOilStatus(oil);
      const purchaseQuantity = getPurchaseQuantity(oil);
      const color = getOilColor(oil);

      return `
        <tr>
          <td>
            <div class="oil-name">
              <span
                class="oil-color"
                style="background: ${color}"
              ></span>

              <div>
                <div class="oil-title">
                  ${escapeHtml(oil.name)}
                </div>

                <div
                  class="oil-subtitle"
                  title="${escapeHtml(oil.notes || "")}"
                >
                  ${escapeHtml(
                    oil.notes ||
                    oil.category ||
                    "Без заметок"
                  )}
                </div>
              </div>
            </div>
          </td>

          <td>
            ${formatNumber(oil.bottleVolume)} мл
          </td>

          <td>
            <span class="quantity-value">
              ${formatNumber(oil.sealedBottles)}
            </span>
          </td>

          <td>
            <span class="quantity-value">
              ${formatNumber(oil.openedBottles)}
            </span>
          </td>

          <td>
            <span class="quantity-value">
              ${formatNumber(oil.remainingVolume)}
            </span>
            <span class="muted"> мл</span>
          </td>

          <td>
            <span class="badge ${status.badgeClass}">
              ${status.label}
            </span>
          </td>

          <td>
            ${
              purchaseQuantity > 0
                ? `
                  <span class="badge badge-warning">
                    ${formatNumber(purchaseQuantity)} шт.
                  </span>
                `
                : `
                  <span class="badge badge-neutral">
                    Не нужно
                  </span>
                `
            }
          </td>

          <td>
            <div class="actions-cell">
              <button
                class="icon-button"
                type="button"
                title="Редактировать"
                aria-label="Редактировать ${escapeHtml(oil.name)}"
                data-action="edit"
                data-id="${oil.id}"
              >
                ✏️
              </button>

              <button
                class="icon-button"
                type="button"
                title="Добавить один закрытый флакон"
                aria-label="Добавить флакон ${escapeHtml(oil.name)}"
                data-action="add-bottle"
                data-id="${oil.id}"
              >
                ＋
              </button>

              <button
                class="icon-button danger"
                type="button"
                title="Удалить"
                aria-label="Удалить ${escapeHtml(oil.name)}"
                data-action="delete"
                data-id="${oil.id}"
              >
                🗑️
              </button>
            </div>
          </td>
        </tr>
      `;
    }

    function createMobileOilCard(oil) {
      const status = getOilStatus(oil);
      const purchaseQuantity = getPurchaseQuantity(oil);
      const color = getOilColor(oil);

      return `
        <article class="oil-card">
          <div class="oil-card-header">
            <div class="oil-card-title">
              <span
                class="oil-color"
                style="background: ${color}"
              ></span>

              <div>
                <div class="oil-title">
                  ${escapeHtml(oil.name)}
                </div>

                <div class="oil-subtitle">
                  ${escapeHtml(oil.category)}
                </div>
              </div>
            </div>

            <span class="badge ${status.badgeClass}">
              ${status.label}
            </span>
          </div>

          <div class="oil-card-grid">
            <div class="oil-card-info">
              <small>Объём</small>
              <strong>
                ${formatNumber(oil.bottleVolume)} мл
              </strong>
            </div>

            <div class="oil-card-info">
              <small>Закрытые флаконы</small>
              <strong>
                ${formatNumber(oil.sealedBottles)}
              </strong>
            </div>

            <div class="oil-card-info">
              <small>Открытые флаконы</small>
              <strong>
                ${formatNumber(oil.openedBottles)}
              </strong>
            </div>

            <div class="oil-card-info">
              <small>Остаток</small>
              <strong>
                ${formatNumber(oil.remainingVolume)} мл
              </strong>
            </div>

            <div class="oil-card-info">
              <small>Минимальный запас</small>
              <strong>
                ${formatNumber(oil.minimumStock)} шт.
              </strong>
            </div>

            <div class="oil-card-info">
              <small>Нужно купить</small>
              <strong>
                ${formatNumber(purchaseQuantity)} шт.
              </strong>
            </div>
          </div>

          ${
            oil.notes
              ? `
                <p class="muted">
                  ${escapeHtml(oil.notes)}
                </p>
              `
              : ""
          }

          <div class="oil-card-actions">
            <button
              class="button button-secondary button-small"
              type="button"
              data-action="edit"
              data-id="${oil.id}"
            >
              ✏️ Изменить
            </button>

            <button
              class="button button-secondary button-small"
              type="button"
              data-action="add-bottle"
              data-id="${oil.id}"
            >
              ＋ Флакон
            </button>

            <button
              class="button button-danger button-small"
              type="button"
              data-action="delete"
              data-id="${oil.id}"
            >
              🗑️ Удалить
            </button>
          </div>
        </article>
      `;
    }

    /* =========================================================
       8. ДОБАВЛЕНИЕ И РЕДАКТИРОВАНИЕ
       ========================================================= */

    function handleFormSubmit(event) {
      event.preventDefault();

      const name = elements.oilName.value.trim();

      if (!name) {
        showToast("Введите название масла.", "error");
        elements.oilName.focus();
        return;
      }

      const bottleVolume =
        elements.bottleVolume.value === "other"
          ? toNonNegativeNumber(elements.customVolume.value)
          : toNonNegativeNumber(elements.bottleVolume.value);

      if (bottleVolume <= 0) {
        showToast(
          "Объём флакона должен быть больше нуля.",
          "error"
        );

        elements.customVolume.focus();
        return;
      }

      const openedBottles =
        toNonNegativeNumber(elements.openedBottles.value);

      const remainingVolume =
        toNonNegativeNumber(elements.remainingVolume.value);

      const maximumRemainingVolume =
        openedBottles * bottleVolume;

      if (
        openedBottles === 0 &&
        remainingVolume > 0
      ) {
        showToast(
          "При остатке масла укажите хотя бы один открытый флакон.",
          "error"
        );

        elements.openedBottles.focus();
        return;
      }

      if (
        openedBottles > 0 &&
        remainingVolume > maximumRemainingVolume
      ) {
        showToast(
          `Остаток не может превышать ${formatNumber(
            maximumRemainingVolume
          )} мл для указанного количества открытых флаконов.`,
          "error"
        );

        elements.remainingVolume.focus();
        return;
      }

      const editingId = elements.editingOilId.value;
      const currentDate = new Date().toISOString();

      const existingOil = oils.find(
        (oil) => oil.id === editingId
      );

      const oilData = {
        id: editingId || generateId(),
        name,
        category: elements.oilCategory.value,
        bottleVolume,
        sealedBottles: Math.floor(
          toNonNegativeNumber(elements.sealedBottles.value)
        ),
        openedBottles: Math.floor(openedBottles),
        remainingVolume,
        minimumStock: Math.floor(
          toNonNegativeNumber(elements.minimumStock.value)
        ),
        manualPurchaseQuantity: Math.floor(
          toNonNegativeNumber(elements.purchaseQuantity.value)
        ),
        autoPurchase: elements.autoPurchase.checked,
        priority: elements.purchasePriority.value,
        notes: elements.oilNotes.value.trim(),
        createdAt: existingOil?.createdAt || currentDate,
        updatedAt: currentDate
      };

      if (editingId) {
        oils = oils.map((oil) =>
          oil.id === editingId ? oilData : oil
        );

        showToast(
          `Масло «${name}» обновлено.`,
          "success"
        );
      } else {
        oils.push(oilData);

        showToast(
          `Масло «${name}» добавлено.`,
          "success"
        );
      }

      saveOilsToStorage();
      resetOilForm();
      renderApplication();
    }

    function startEditingOil(id) {
      const oil = oils.find((item) => item.id === id);

      if (!oil) {
        return;
      }

      elements.editingOilId.value = oil.id;
      elements.oilName.value = oil.name;
      elements.oilCategory.value =
        oil.category || "Одиночное масло";

      const standardVolumes = [5, 10, 15];

      if (standardVolumes.includes(Number(oil.bottleVolume))) {
        elements.bottleVolume.value =
          String(oil.bottleVolume);

        elements.customVolumeGroup.classList.add("hidden");
        elements.customVolume.value = "";
      } else {
        elements.bottleVolume.value = "other";
        elements.customVolumeGroup.classList.remove("hidden");
        elements.customVolume.value = oil.bottleVolume;
      }

      elements.sealedBottles.value =
        oil.sealedBottles ?? 0;

      elements.openedBottles.value =
        oil.openedBottles ?? 0;

      elements.remainingVolume.value =
        oil.remainingVolume ?? 0;

      elements.minimumStock.value =
        oil.minimumStock ?? 0;

      elements.purchaseQuantity.value =
        oil.manualPurchaseQuantity ?? 0;

      elements.autoPurchase.checked =
        Boolean(oil.autoPurchase);

      elements.purchasePriority.value =
        oil.priority || "Обычный";

      elements.oilNotes.value = oil.notes || "";

      elements.formTitle.textContent = "Редактировать масло";
      elements.saveOilButton.textContent =
        "💾 Сохранить изменения";

      elements.cancelEditButton.classList.remove("hidden");

      elements.oilName.focus();

      if (window.innerWidth < 1120) {
        elements.oilForm.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    }

    function resetOilForm() {
      elements.oilForm.reset();
      elements.editingOilId.value = "";
      elements.formTitle.textContent = "Добавить масло";
      elements.saveOilButton.textContent = "➕ Добавить масло";
      elements.cancelEditButton.classList.add("hidden");

      elements.bottleVolume.value = "15";
      elements.customVolumeGroup.classList.add("hidden");
      elements.customVolume.value = "";
      elements.sealedBottles.value = "0";
      elements.openedBottles.value = "0";
      elements.remainingVolume.value = "0";
      elements.minimumStock.value = "1";
      elements.purchaseQuantity.value = "0";
      elements.autoPurchase.checked = true;
      elements.purchasePriority.value = "Обычный";
    }

    /* =========================================================
       9. УДАЛЕНИЕ И БЫСТРОЕ ДОБАВЛЕНИЕ ФЛАКОНА
       ========================================================= */

    function deleteOil(id) {
      const oil = oils.find((item) => item.id === id);

      if (!oil) {
        return;
      }

      const confirmed = window.confirm(
        `Удалить масло «${oil.name}» из учёта?`
      );

      if (!confirmed) {
        return;
      }

      oils = oils.filter((item) => item.id !== id);

      if (elements.editingOilId.value === id) {
        resetOilForm();
      }

      saveOilsToStorage();
      renderApplication();

      showToast(
        `Масло «${oil.name}» удалено.`,
        "success"
      );
    }

    function addSealedBottle(id) {
      const oil = oils.find((item) => item.id === id);

      if (!oil) {
        return;
      }

      oil.sealedBottles =
        toNonNegativeNumber(oil.sealedBottles) + 1;

      /*
        Если количество покупки было установлено вручную,
        уменьшаем его на один после покупки флакона.
      */
      oil.manualPurchaseQuantity = Math.max(
        0,
        toNonNegativeNumber(oil.manualPurchaseQuantity) - 1
      );

      oil.updatedAt = new Date().toISOString();

      saveOilsToStorage();
      renderApplication();

      showToast(
        `Добавлен один флакон «${oil.name}».`,
        "success"
      );
    }

    function markPurchaseCompleted(id) {
      const oil = oils.find((item) => item.id === id);

      if (!oil) {
        return;
      }

      const purchaseQuantity = getPurchaseQuantity(oil);

      if (purchaseQuantity <= 0) {
        return;
      }

      const confirmed = window.confirm(
        `Отметить покупку «${oil.name}» — ${purchaseQuantity} шт.? Количество закрытых флаконов увеличится.`
      );

      if (!confirmed) {
        return;
      }

      oil.sealedBottles =
        toNonNegativeNumber(oil.sealedBottles) +
        purchaseQuantity;

      oil.manualPurchaseQuantity = 0;
      oil.updatedAt = new Date().toISOString();

      saveOilsToStorage();
      renderApplication();

      showToast(
        `Покупка «${oil.name}» отмечена.`,
        "success"
      );
    }

    function clearAllOils() {
      if (oils.length === 0) {
        showToast("Список уже пуст.", "warning");
        return;
      }

      const confirmed = window.confirm(
        "Удалить все масла? Это действие нельзя отменить. Рекомендуется сначала сделать экспорт."
      );

      if (!confirmed) {
        return;
      }

      const secondConfirmation = window.confirm(
        "Вы точно хотите полностью очистить базу?"
      );

      if (!secondConfirmation) {
        return;
      }

      oils = [];
      saveOilsToStorage();
      resetOilForm();
      renderApplication();

      showToast("Все записи удалены.", "success");
    }

    /* =========================================================
       10. СПИСОК ПОКУПОК
       ========================================================= */

    function getShoppingOils() {
      return oils
        .filter((oil) => getPurchaseQuantity(oil) > 0)
        .sort((firstOil, secondOil) => {
          const priorityDifference =
            getPriorityWeight(secondOil.priority) -
            getPriorityWeight(firstOil.priority);

          if (priorityDifference !== 0) {
            return priorityDifference;
          }

          return firstOil.name.localeCompare(
            secondOil.name,
            "ru"
          );
        });
    }

    function renderShoppingList() {
      const shoppingOils = getShoppingOils();

      elements.shoppingListContainer.innerHTML = "";

      if (shoppingOils.length === 0) {
        elements.shoppingListContainer.classList.add("hidden");
        elements.emptyShoppingState.classList.remove("hidden");
        return;
      }

      elements.shoppingListContainer.classList.remove("hidden");
      elements.emptyShoppingState.classList.add("hidden");

      shoppingOils.forEach((oil) => {
        const quantity = getPurchaseQuantity(oil);

        elements.shoppingListContainer.insertAdjacentHTML(
          "beforeend",
          `
            <div class="shopping-item">
              <div>
                <div class="shopping-item-name">
                  ${escapeHtml(oil.name)}
                </div>

                <div class="shopping-item-details">
                  ${escapeHtml(oil.priority)} приоритет •
                  ${formatNumber(oil.bottleVolume)} мл
                </div>
              </div>

              <div class="shopping-quantity">
                ${formatNumber(quantity)} шт.
              </div>

              <button
                class="button button-primary button-small"
                type="button"
                data-action="purchase-complete"
                data-id="${oil.id}"
              >
                Куплено
              </button>
            </div>
          `
        );
      });
    }

    function openShoppingModal() {
      renderShoppingList();
      elements.shoppingModal.classList.remove("hidden");
      document.body.style.overflow = "hidden";
    }

    function closeShoppingModal() {
      elements.shoppingModal.classList.add("hidden");
      document.body.style.overflow = "";
    }

    async function copyShoppingList() {
      const shoppingOils = getShoppingOils();

      if (shoppingOils.length === 0) {
        showToast(
          "Список покупок сейчас пуст.",
          "warning"
        );

        return;
      }

      const lines = [
        "СПИСОК ПОКУПОК DOTERRA",
        "",
        ...shoppingOils.map((oil, index) => {
          return (
            `${index + 1}. ${oil.name} — ` +
            `${getPurchaseQuantity(oil)} шт. ` +
            `по ${formatNumber(oil.bottleVolume)} мл ` +
            `(${oil.priority.toLowerCase()} приоритет)`
          );
        })
      ];

      const text = lines.join("\n");

      try {
        await navigator.clipboard.writeText(text);

        showToast(
          "Список покупок скопирован.",
          "success"
        );
      } catch (error) {
        /*
          Резервный способ копирования для старых браузеров
          и некоторых онлайн-редакторов.
        */
        const temporaryTextarea =
          document.createElement("textarea");

        temporaryTextarea.value = text;
        temporaryTextarea.style.position = "fixed";
        temporaryTextarea.style.opacity = "0";

        document.body.appendChild(temporaryTextarea);
        temporaryTextarea.select();

        const copied = document.execCommand("copy");
        temporaryTextarea.remove();

        showToast(
          copied
            ? "Список покупок скопирован."
            : "Не удалось скопировать список.",
          copied ? "success" : "error"
        );
      }
    }

    /* =========================================================
       11. ЭКСПОРТ И ИМПОРТ JSON
       ========================================================= */

    function exportDataAsJson() {
      const exportObject = {
        application: "Учёт эфирных масел doTERRA",
        version: 1,
        exportedAt: new Date().toISOString(),
        oils
      };

      const jsonContent = JSON.stringify(
        exportObject,
        null,
        2
      );

      downloadFile(
        `doterra-oils-backup-${getCurrentDateString()}.json`,
        jsonContent,
        "application/json;charset=utf-8"
      );

      showToast(
        "Резервная копия сохранена.",
        "success"
      );
    }

    function handleImportFile(event) {
      const file = event.target.files?.[0];

      if (!file) {
        return;
      }

      const reader = new FileReader();

      reader.onload = () => {
        try {
          const importedData = JSON.parse(reader.result);

          const importedOils = Array.isArray(importedData)
            ? importedData
            : importedData.oils;

          if (!Array.isArray(importedOils)) {
            throw new Error(
              "В файле отсутствует массив масел."
            );
          }

          const normalizedOils = importedOils
            .map(normalizeImportedOil)
            .filter(Boolean);

          const confirmed = window.confirm(
            `Найдено записей: ${normalizedOils.length}. Заменить текущую базу импортированными данными?`
          );

          if (!confirmed) {
            return;
          }

          oils = normalizedOils;
          saveOilsToStorage();
          resetOilForm();
          renderApplication();

          showToast(
            `Импортировано записей: ${normalizedOils.length}.`,
            "success"
          );
        } catch (error) {
          console.error("Ошибка импорта:", error);

          showToast(
            "Не удалось импортировать файл. Проверьте его формат.",
            "error"
          );
        } finally {
          /*
            Очищаем input, чтобы тот же файл можно было
            выбрать повторно.
          */
          elements.importFileInput.value = "";
        }
      };

      reader.onerror = () => {
        showToast(
          "Не удалось прочитать выбранный файл.",
          "error"
        );

        elements.importFileInput.value = "";
      };

      reader.readAsText(file, "UTF-8");
    }

    function normalizeImportedOil(rawOil) {
      if (
        !rawOil ||
        typeof rawOil !== "object" ||
        !String(rawOil.name || "").trim()
      ) {
        return null;
      }

      const currentDate = new Date().toISOString();

      return {
        id: String(rawOil.id || generateId()),
        name: String(rawOil.name).trim(),
        category:
          String(rawOil.category || "Другое").trim(),
        bottleVolume:
          toNonNegativeNumber(rawOil.bottleVolume) || 15,
        sealedBottles: Math.floor(
          toNonNegativeNumber(rawOil.sealedBottles)
        ),
        openedBottles: Math.floor(
          toNonNegativeNumber(rawOil.openedBottles)
        ),
        remainingVolume:
          toNonNegativeNumber(rawOil.remainingVolume),
        minimumStock: Math.floor(
          toNonNegativeNumber(rawOil.minimumStock)
        ),
        manualPurchaseQuantity: Math.floor(
          toNonNegativeNumber(
            rawOil.manualPurchaseQuantity ??
            rawOil.purchaseQuantity
          )
        ),
        autoPurchase:
          rawOil.autoPurchase !== false,
        priority:
          ["Обычный", "Высокий", "Срочный"].includes(
            rawOil.priority
          )
            ? rawOil.priority
            : "Обычный",
        notes: String(rawOil.notes || ""),
        createdAt: rawOil.createdAt || currentDate,
        updatedAt: rawOil.updatedAt || currentDate
      };
    }

    /* =========================================================
       12. ЭКСПОРТ CSV

       CSV можно открыть в Excel, Google Таблицах
       или других табличных программах.
       ========================================================= */

    function exportShoppingListAsCsv() {
      const shoppingOils = getShoppingOils();

      if (shoppingOils.length === 0) {
        showToast(
          "Список покупок сейчас пуст.",
          "warning"
        );

        return;
      }

      const rows = [
        [
          "Название",
          "Категория",
          "Объём, мл",
          "Количество к покупке",
          "Приоритет",
          "Заметки"
        ],
        ...shoppingOils.map((oil) => [
          oil.name,
          oil.category,
          oil.bottleVolume,
          getPurchaseQuantity(oil),
          oil.priority,
          oil.notes
        ])
      ];

      /*
        Добавляем BOM \uFEFF, чтобы Excel правильно
        распознавал русские буквы.
      */
      const csvContent =
        "\uFEFF" +
        rows
          .map((row) =>
            row
              .map((cell) => {
                const value = String(cell ?? "");
                return `"${value.replaceAll('"', '""')}"`;
              })
              .join(";")
          )
          .join("\n");

      downloadFile(
        `doterra-shopping-list-${getCurrentDateString()}.csv`,
        csvContent,
        "text/csv;charset=utf-8"
      );

      showToast(
        "Список покупок CSV сохранён.",
        "success"
      );
    }

    function downloadFile(fileName, content, mimeType) {
      const blob = new Blob([content], {
        type: mimeType
      });

      const fileUrl = URL.createObjectURL(blob);
      const downloadLink = document.createElement("a");

      downloadLink.href = fileUrl;
      downloadLink.download = fileName;

      document.body.appendChild(downloadLink);
      downloadLink.click();
      downloadLink.remove();

      URL.revokeObjectURL(fileUrl);
    }

    function getCurrentDateString() {
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");

      return `${year}-${month}-${day}`;
    }

    /* =========================================================
       13. УВЕДОМЛЕНИЯ
       ========================================================= */

    function showToast(message, type = "success") {
      const icons = {
        success: "✅",
        error: "⚠️",
        warning: "ℹ️"
      };

      const toast = document.createElement("div");
      toast.className = `toast toast-${type}`;

      toast.innerHTML = `
        <span aria-hidden="true">
          ${icons[type] || "ℹ️"}
        </span>

        <div>
          ${escapeHtml(message)}
        </div>
      `;

      elements.toastContainer.appendChild(toast);

      window.setTimeout(() => {
        toast.remove();
      }, 3500);
    }

    /* =========================================================
       14. ОБРАБОТЧИКИ СОБЫТИЙ
       ========================================================= */

    elements.oilForm.addEventListener(
      "submit",
      handleFormSubmit
    );

    elements.cancelEditButton.addEventListener(
      "click",
      resetOilForm
    );

    elements.bottleVolume.addEventListener(
      "change",
      () => {
        const isCustom =
          elements.bottleVolume.value === "other";

        elements.customVolumeGroup.classList.toggle(
          "hidden",
          !isCustom
        );

        if (isCustom) {
          elements.customVolume.focus();
        }
      }
    );

    elements.searchInput.addEventListener(
      "input",
      renderOilList
    );

    elements.statusFilter.addEventListener(
      "change",
      renderOilList
    );

    elements.categoryFilter.addEventListener(
      "change",
      renderOilList
    );

    /*
      Делегирование событий:
      один обработчик работает для всех кнопок в таблице
      и мобильных карточках.
    */
    document.addEventListener("click", (event) => {
      const actionButton =
        event.target.closest("[data-action]");

      if (!actionButton) {
        return;
      }

      const action = actionButton.dataset.action;
      const id = actionButton.dataset.id;

      if (action === "edit") {
        startEditingOil(id);
      }

      if (action === "delete") {
        deleteOil(id);
      }

      if (action === "add-bottle") {
        addSealedBottle(id);
      }

      if (action === "purchase-complete") {
        markPurchaseCompleted(id);
      }
    });

    elements.openShoppingListButton.addEventListener(
      "click",
      openShoppingModal
    );

    elements.closeShoppingModalButton.addEventListener(
      "click",
      closeShoppingModal
    );

    elements.closeShoppingModalFooterButton.addEventListener(
      "click",
      closeShoppingModal
    );

    elements.shoppingModal.addEventListener(
      "click",
      (event) => {
        if (event.target === elements.shoppingModal) {
          closeShoppingModal();
        }
      }
    );

    document.addEventListener("keydown", (event) => {
      if (
        event.key === "Escape" &&
        !elements.shoppingModal.classList.contains("hidden")
      ) {
        closeShoppingModal();
      }
    });

    elements.copyShoppingListButton.addEventListener(
      "click",
      copyShoppingList
    );

    elements.exportCsvButton.addEventListener(
      "click",
      exportShoppingListAsCsv
    );

    elements.exportButton.addEventListener(
      "click",
      exportDataAsJson
    );

    elements.importButton.addEventListener(
      "click",
      () => elements.importFileInput.click()
    );

    elements.importFileInput.addEventListener(
      "change",
      handleImportFile
    );

    elements.clearAllButton.addEventListener(
      "click",
      clearAllOils
    );

    /* =========================================================
       15. ПЕРВЫЙ ЗАПУСК ОТРИСОВКИ
       ========================================================= */

    renderApplication();
