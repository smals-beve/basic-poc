export const tablesModule = {
    multiCheck: {
        init: function() {
            const tables = document.querySelectorAll('.table-responsive');

            tables.forEach(table => {
                const thCheck = table.querySelector('tr:first-child th input[type="checkbox"]');
                const tdCheck = table.querySelectorAll('tr td:first-child input[type="checkbox"]');

                if (thCheck && tdCheck) {
                    // Update tdCheck when thCheck is clicked
                    thCheck.addEventListener('click', function () {
                        const isChecked = thCheck.checked;
                        tdCheck.forEach(el => {
                            el.checked = isChecked;
                        });
                        tablesModule.floatingBar.update(table); // Update the floating bar for this table
                    });

                    // Update thCheck's indeterminate state based on tdCheck
                    tdCheck.forEach(el => {
                        el.addEventListener('click', function () {
                            const total = tdCheck.length;
                            const checkedCount = Array.from(tdCheck).filter(checkbox => checkbox.checked).length;

                            if (checkedCount === 0) {
                                thCheck.checked = false;
                                thCheck.indeterminate = false;
                            } else if (checkedCount === total) {
                                thCheck.checked = true;
                                thCheck.indeterminate = false;
                            } else {
                                thCheck.checked = false;
                                thCheck.indeterminate = true;
                            }
                            tablesModule.floatingBar.update(table); // Update the floating bar for this table
                        });
                    });

                    // Initial update in case some items are already checked on page load
                    tablesModule.floatingBar.update(table);
                }
            });

            // Handle resize event with an indicator for mobile/desktop state
            let isMobile = window.innerWidth <= 575.98; // Initial check
            window.addEventListener('resize', () => {
                const currentIsMobile = window.innerWidth <= 575.98;
                if (currentIsMobile !== isMobile) {
                    isMobile = currentIsMobile; // Update the state
                    tables.forEach(table => {
                        tablesModule.floatingBar.update(table); // Update the floating bar only if the state changes
                    });
                }
            });
        }
    },
    floatingBar: {
        init: function() {
            const tables = document.querySelectorAll('.table-responsive');

            tables.forEach(table => {
                const resetButton = table.parentElement.querySelector('.table-floating-bar .table-floating-bar-reset-btn');

                // Initial call to update the floating bar based on the initial state
                this.update(table);

                // Event listener for the reset button for each table
                if (resetButton) {
                    resetButton.addEventListener('click', () => {
                        this.resetSelection(table);
                    });
                }
            });
        },
        update: function(container) {
            const tdCheck = container.querySelectorAll('tr td:first-child input[type="checkbox"]');
            const checkedCount = Array.from(tdCheck).filter(checkbox => checkbox.checked).length;
            const wrapper = container.closest('.position-relative'); // The div with "position-relative"

            if (!wrapper) return; // Exit the function if wrapper is not found

            const floatingBar = wrapper.querySelector('.table-floating-bar');

            if (!floatingBar) return; // Exit the function if floatingBar is not found

            const lang = document.documentElement.lang || 'en'; // Get language from <html lang="">
            const translations = {
                en: { selected: 'selected', item: 'item', items: 'items' },
                fr: { selected: 'sélectionné', item: 'élément', items: 'éléments' },
                nl: { selected: 'geselecteerd', item: 'item', items: 'items' },
                de: { selected: 'ausgewählt', item: 'Element', items: 'Elemente' }
            };

            // Get translations based on the language
            const { selected, item, items } = translations[lang] || translations.en;
            const selectedText = `${checkedCount} ${checkedCount > 1 ? items : item} ${selected}`;

            // Update the number of selected items in the floating bar
            const selectedCount = floatingBar.querySelector('.table-floating-bar-selected-count');
            if (selectedCount) {
                if (window.innerWidth <= 575.98) {
                    // In mobile view, show the icon and the number of selected items
                    selectedCount.innerHTML = checkedCount > 0
                        ? `<span class="material-symbols-rounded solid" aria-hidden="true" style="vertical-align: middle;">check_box</span><span class="number">${checkedCount}</span>`
                        : '';
                } else {
                    // In desktop view, show the full text
                    selectedCount.textContent = checkedCount > 0 ? selectedText : '';
                }
            }

            // Responsive handling for buttons
            const downloadBtn = floatingBar.querySelector('.table-floating-bar-download-btn');
            const deleteBtn = floatingBar.querySelector('.table-floating-bar-delete-btn');
            const isMobileView = window.innerWidth <= 575.98;

            if (isMobileView) {
                // Remove the "Download" text in mobile view
                if (downloadBtn) downloadBtn.querySelector('span:nth-child(2)').style.display = 'none';

                if (checkedCount === 1) {
                    // Show full text for a single selected item
                    if (deleteBtn) deleteBtn.querySelector('span:nth-child(2)').style.display = 'none';
                } else if (checkedCount > 1) {
                    // Hide text for multiple selected items
                    if (deleteBtn) deleteBtn.querySelector('span:nth-child(2)').style.display = 'none';
                }
            } else {
                // Always show full text in desktop view
                if (downloadBtn) downloadBtn.querySelector('span:nth-child(2)').style.display = 'inline-block';
                if (deleteBtn) deleteBtn.querySelector('span:nth-child(2)').style.display = 'inline-block';
            }

            // Show or hide the floating bar based on the number of checked items
            if (checkedCount > 0) {
                floatingBar.classList.add('is-visible');
                // Set the padding-bottom on the wrapper
                const floatingBarHeight = floatingBar.offsetHeight;
                wrapper.style.paddingBottom = `calc(${floatingBarHeight}px - 0.25rem)`;
            } else {
                floatingBar.classList.remove('is-visible');
                wrapper.style.paddingBottom = ''; // Reset padding-bottom when the floating bar is not visible
            }

            // If the floating bar is not visible, ensure the padding-bottom is reset
            if (!floatingBar.classList.contains('is-visible')) {
                wrapper.style.paddingBottom = '';
            }
        },
        resetSelection: function(container) {
            const tdCheck = container.querySelectorAll('tr td:first-child input[type="checkbox"]');
            tdCheck.forEach(el => {
                el.checked = false;
            });
            const thCheck = container.querySelector('tr:first-child th input[type="checkbox"]');
            if (thCheck) {
                thCheck.checked = false;
                thCheck.indeterminate = false;
            }
            // Update the floating bar after resetting the selection
            this.update(container);
        }
    },
    init: function() {
        this.multiCheck.init();
        this.floatingBar.init();
    }
};
