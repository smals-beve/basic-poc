export const litepickerModule = {
    // Retrieves the language defined in the <html> tag and limits it to supported languages
    getSupportedLang: function() {
        const langMap = {
            'en': 'en-US',
            'fr': 'fr-FR',
            'nl': 'nl-NL',
            'de': 'de-DE',
        };

        // Get the lang attribute from the <html> tag
        let htmlLang = document.documentElement.lang || 'en';

        // Ensure lang is lowercase and fallback to 'en-US' if not supported
        htmlLang = htmlLang.toLowerCase();

        // Return the corresponding language or 'en-US' if not found
        return langMap[htmlLang] || 'en-US';
    },

    // Returns the translation of the word "days" based on the language
    getDaysText: function(lang) {
        const translations = {
            'en-US': { one: 'day', other: 'days' },
            'fr-FR': { one: 'jour', other: 'jours' },
            'nl-NL': { one: 'dag', other: 'dagen' },
            'de-DE': { one: 'Tag', other: 'Tage' },
        };

        return translations[lang] || translations['en-US'];
    },

    // Simple datepicker initialization
    datepicker: {
        init: function() {
            const datepickerElem = document.querySelectorAll('input[data-datepicker="true"]');
            const lang = litepickerModule.getSupportedLang(); // Get supported language

            this.datepickerList = [...datepickerElem].map(inputEl => {
                const lockBeforeToday = inputEl.getAttribute('data-lock-before-today') === 'true';
                const offsetDays = parseInt(inputEl.getAttribute('data-lock-offset-days')) || 0;
                const minDate = new Date();
                if (lockBeforeToday) {
                    minDate.setDate(minDate.getDate() + offsetDays);
                }

                return new window.Litepicker({
                    element: inputEl,
                    singleMode: true,
                    format: 'DD/MM/YYYY',
                    autoApply: true,
                    minDate: lockBeforeToday ? minDate : null,
                    lang: lang, // Use supported language
                    plugins: ['keyboardnav']
                });
            });
        }
    },

    // Date range picker initialization
    datepickerRange: {
        init: function() {
            const dateRangeElem = document.querySelectorAll('input[data-datepicker-range="true"]');
            const lang = litepickerModule.getSupportedLang(); // Get supported language
            const daysText = litepickerModule.getDaysText(lang); // Get translation for days

            const getColumnsByScreenWidth = (inputEl) => {
                const screenWidth = window.innerWidth;
                const defaultColumns = parseInt(inputEl.getAttribute('data-months')) || 3;

                if (screenWidth < 768) {
                    return { months: 1, columns: 1 };
                } else if (screenWidth < 1300) {
                    return { months: 2, columns: 2 };
                } else {
                    return { months: defaultColumns, columns: defaultColumns };
                }
            };

            this.dateRangeList = [...dateRangeElem].map(inputEl => {
                const { months, columns } = getColumnsByScreenWidth(inputEl);
                const lockBeforeToday = inputEl.getAttribute('data-lock-before-today') === 'true';
                const offsetDays = parseInt(inputEl.getAttribute('data-lock-offset-days')) || 0;
                const minDate = new Date();
                if (lockBeforeToday) {
                    minDate.setDate(minDate.getDate() + offsetDays);
                }

                return new window.Litepicker({
                    element: inputEl,
                    singleMode: false,
                    format: 'DD/MM/YYYY',
                    numberOfMonths: months,
                    numberOfColumns: columns,
                    autoApply: true,
                    minDate: lockBeforeToday ? minDate : null,
                    lang: lang, // Use supported language
                    tooltipText: {
                        // Custom tooltip, we simply translate "day" and "days"
                        one: daysText.one,
                        other: daysText.other,
                    },
                    plugins: ['keyboardnav']
                });
            });

            window.addEventListener('resize', () => {
                this.dateRangeList.forEach(picker => {
                    const inputEl = picker.options.element;
                    const { months, columns } = getColumnsByScreenWidth(inputEl);
                    picker.setOptions({
                        numberOfMonths: months,
                        numberOfColumns: columns
                    });
                });
            });
        }
    },

    // Method to add permanent calendars based on a `data-datepicker-permanent="true"` attribute
    permanentCalendars: function() {
        const permanentCalendars = document.querySelectorAll('[data-datepicker-permanent="true"]');
        const lang = this.getSupportedLang(); // Retrieve the supported language

        permanentCalendars.forEach(container => {
            const isRange = container.getAttribute('data-datepicker-range') === 'true'; // Check if it's a range picker
            const lockBeforeToday = container.getAttribute('data-lock-before-today') === 'true'; // Check if dates before today are locked
            const offsetDays = parseInt(container.getAttribute('data-lock-offset-days')) || 0; // Get the offset days
            const months = parseInt(container.getAttribute('data-months')) || 1; // Get the number of months to display, default to 1
            const minDate = new Date();

            // If locking dates before today, apply the offset
            if (lockBeforeToday) {
                minDate.setDate(minDate.getDate() + offsetDays);
            }

            // Initialize Litepicker with all the parameters from data attributes
            new window.Litepicker({
                element: container,
                singleMode: !isRange, // If `isRange` is true, allow range date selection
                format: 'DD/MM/YYYY',
                autoApply: true,
                minDate: lockBeforeToday ? minDate : null,
                lang: lang, // Use the supported language
                numberOfMonths: months, // Set number of months
                numberOfColumns: months, // Set number of columns (same as months for simplicity)
                inlineMode: true, // Inline mode to display the calendar permanently
                tooltipText: {
                    one: this.getDaysText(lang).one,
                    other: this.getDaysText(lang).other
                },
                plugins: ['keyboardnav']
            });
        });
    },

    // Main method to initialize the entire datepicker module
    init: function() {
        this.datepicker.init();
        this.datepickerRange.init();
        this.permanentCalendars();
    }
};
