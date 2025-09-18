export const formModule = {
    indeterminate: {
        init: function() {
            // Select all input elements with the class "indeterminate"
            const inputs = document.querySelectorAll("input.indeterminate");
            for (let i = 0; i < inputs.length; i++) {
                // Set each input element to indeterminate state
                inputs[i].indeterminate = true;
            }
        }
    },
    checkboxBoxedForm: {
        init: function() {
            // Select all checkboxes with the class "js-checkbox-boxed-form"
            const checkboxes = document.querySelectorAll(".js-checkbox-boxed-form");
            checkboxes.forEach(function(checkbox) {
                // Find the closest container of the checkbox
                const container = checkbox.closest('.js-checkbox-boxed-form-container');
                // Select all elements inside the container with the class "disabled"
                const disabledElements = container.querySelectorAll(".disabled");
                // Select all form elements inside the container that are disabled
                const formElements = container.querySelectorAll("[disabled]");

                // Add event listener to toggle disabled state of elements based on checkbox status
                checkbox.addEventListener("change", function() {
                    if (checkbox.checked) {
                        // Enable all elements when the checkbox is checked
                        disabledElements.forEach(function(el) {
                            el.classList.remove("disabled");
                        });
                        formElements.forEach(function(el) {
                            el.removeAttribute("disabled");
                        });
                    } else {
                        // Disable all elements when the checkbox is unchecked
                        disabledElements.forEach(function(el) {
                            el.classList.add("disabled");
                        });
                        formElements.forEach(function(el) {
                            el.setAttribute("disabled", "disabled");
                        });
                    }
                });
            });
        }
    },
    phoneField: {
        init: function() {
            // Select all input fields of type "tel"
            document.querySelectorAll('input[type="tel"]').forEach(phoneFieldsItem => {
                phoneFieldsItem.addEventListener('input', () => {
                    // Remove all spaces and reformat the phone number as it is typed
                    let value = phoneFieldsItem.value.replace(/\s+/g, '');
                    const maxLength = phoneFieldsItem.getAttribute('maxlength');

                    // Add space after the third character if the length is appropriate
                    if (value.length > 3 && value.length <= 5) {
                        value = value.slice(0, 3) + ' ' + value.slice(3);
                    } else if (value.length > 5 && value.length <= 7) {
                        value = value.slice(0, 3) + ' ' + value.slice(3, 5) + ' ' + value.slice(5);
                    } else if (value.length > 7) {
                        value = value.slice(0, 3) + ' ' + value.slice(3, 5) + ' ' + value.slice(5, 7) + ' ' + value.slice(7);
                    }

                    // Ensure the formatted value does not exceed the maximum length
                    if (value.length <= maxLength) {
                        phoneFieldsItem.value = value;
                    }
                });
            });
        }
    },
    currencyField: {
        instances: new Map(),
        init: function() {
            document.querySelectorAll('.js-currency-field').forEach(currencyInput => {
                if (this.instances.has(currencyInput)) {
                    return;
                }
                // Get language from data attribute or HTML lang attribute
                const htmlLang = document.documentElement.lang || 'fr';
                const language = currencyInput.dataset.language || htmlLang.split('-')[0]; // Extract primary language code

                const options = {
                    language: language,
                    autoFormat: currencyInput.dataset.autoFormat !== 'false',
                    allowNegative: currencyInput.dataset.allowNegative === 'true',
                    decimalPlaces: parseInt(currencyInput.dataset.decimalPlaces) || 2,
                    currency: currencyInput.dataset.currency || 'EUR',
                    roundDecimals: currencyInput.dataset.roundDecimals !== 'false',
                    max: currencyInput.dataset.max ? parseFloat(currencyInput.dataset.max) : null,
                    min: currencyInput.dataset.min ? parseFloat(currencyInput.dataset.min) : null
                };
                const instance = new CurrencyField(currencyInput, options);
                this.instances.set(currencyInput, instance);
            });
        },
        destroy: function() {
            this.instances.forEach((instance, input) => {
                instance.destroy();
            });
            this.instances.clear();
        }
    },
    focusField: {
        init: function() {
            // Select all elements with the attribute data-focus-target
            document.querySelectorAll('[data-focus-target]').forEach(function(button) {
                button.addEventListener('click', function() {
                    const targetInputId = button.getAttribute('data-focus-target');
                    const inputToClick = document.getElementById(targetInputId);

                    if (inputToClick) {
                        // Simulate a click on the input to trigger Litepicker or default datepicker
                        inputToClick.click();
                    }
                });
            });
        }
    },
    dropdownForm: {
        init: function() {
            // Select all dropdown items within a form.dropdown-menu
            const dropdownItems = document.querySelectorAll(".dropdown-menu form .dropdown-item");

            dropdownItems.forEach(function(item) {
                // Add event listener to prevent dropdown from closing on click
                item.addEventListener("click", function(event) {
                    event.stopPropagation();
                });
            });
        }
    },
    init: function() {
        this.indeterminate.init();
        this.checkboxBoxedForm.init();
        this.phoneField.init();
        this.currencyField.init();
        this.focusField.init();
        this.dropdownForm.init();
    }
};

// CurrencyField class definition
class CurrencyField {
    constructor(inputElement, options = {}) {
        this.input = inputElement;

        // Get default language from HTML lang attribute
        const htmlLang = document.documentElement.lang || 'fr';
        const defaultLanguage = htmlLang.split('-')[0]; // Extract primary language code

        this.options = {
            language: options.language || defaultLanguage,
            autoFormat: options.autoFormat !== false,
            allowNegative: options.allowNegative || false,
            decimalPlaces: options.decimalPlaces || 2,
            currency: options.currency || 'EUR',
            roundDecimals: options.roundDecimals !== false,
            max: options.max !== null ? options.max : null,
            min: options.min !== null ? options.min : null
        };

        // Validate min/max configuration
        this.validateMinMaxConfig();

        // Format settings per language
        this.formats = {
            fr: { decimal: ',', thousand: '\u00A0' },
            nl: { decimal: ',', thousand: '.' },
            de: { decimal: ',', thousand: '.' },
            en: { decimal: '.', thousand: ',' }
        };

        // Store bound event handlers for cleanup
        this.handleInput = this._handleInput.bind(this);
        this.handleBlur = this._handleBlur.bind(this);
        this.handleFocus = this._handleFocus.bind(this);
        this.handleKeydown = this._handleKeydown.bind(this);

        this.init();
    }

    validateMinMaxConfig() {
        // If negative values are not allowed, ensure min is at least 0
        if (!this.options.allowNegative && this.options.min !== null && this.options.min < 0) {
            console.warn('CurrencyField: min value cannot be negative when allowNegative is false. Setting min to 0.');
            this.options.min = 0;
        }

        // Ensure min <= max
        if (this.options.min !== null && this.options.max !== null && this.options.min > this.options.max) {
            console.warn('CurrencyField: min value cannot be greater than max value. Swapping values.');
            [this.options.min, this.options.max] = [this.options.max, this.options.min];
        }

        // If allowNegative is false and max is less than 0, set max to null
        if (!this.options.allowNegative && this.options.max !== null && this.options.max < 0) {
            console.warn('CurrencyField: max value cannot be negative when allowNegative is false. Removing max constraint.');
            this.options.max = null;
        }
    }

    init() {
        // Event listeners
        this.input.addEventListener('input', this.handleInput);
        this.input.addEventListener('blur', this.handleBlur);
        this.input.addEventListener('focus', this.handleFocus);
        this.input.addEventListener('keydown', this.handleKeydown);

        // Store normalized value as data attribute
        if (this.input.value) {
            const normalized = this.getNormalizedValue();
            const validated = this.validateAndClampValue(normalized);
            if (validated !== normalized) {
                this.input.value = this.formatValue(validated);
            }
            this.input.dataset.normalizedValue = validated;
        }

        // Add visual feedback attributes
        this.updateValidationAttributes();
    }

    destroy() {
        // Remove event listeners
        this.input.removeEventListener('input', this.handleInput);
        this.input.removeEventListener('blur', this.handleBlur);
        this.input.removeEventListener('focus', this.handleFocus);
        this.input.removeEventListener('keydown', this.handleKeydown);
    }

    _handleKeydown(e) {
        // Allow: backspace, delete, tab, escape, enter
        if ([46, 8, 9, 27, 13].indexOf(e.keyCode) !== -1 ||
            // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
            (e.keyCode === 65 && e.ctrlKey === true) ||
            (e.keyCode === 67 && e.ctrlKey === true) ||
            (e.keyCode === 86 && e.ctrlKey === true) ||
            (e.keyCode === 88 && e.ctrlKey === true) ||
            // Allow: home, end, left, right
            (e.keyCode >= 35 && e.keyCode <= 39)) {
            return;
        }

        // Allow minus at the beginning if negative allowed
        if (this.options.allowNegative && e.key === '-' && this.input.selectionStart === 0) {
            return;
        }

        // Allow decimal separator
        if ((e.key === '.' || e.key === ',') && this.options.decimalPlaces > 0) {
            return;
        }

        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    }

    _handleInput(e) {
        let value = e.target.value;

        // Clean the value but keep structure for real-time feedback
        value = this.cleanValue(value, true);

        // Update display
        e.target.value = value;

        // Store normalized value
        const normalized = this.getNormalizedValue();
        this.input.dataset.normalizedValue = normalized;

        // Update validation attributes
        this.updateValidationAttributes();

        // Dispatch custom event
        this.input.dispatchEvent(new CustomEvent('currencychange', {
            detail: this.getValue()
        }));
    }

    _handleBlur(e) {
        if (this.options.autoFormat) {
            const normalized = this.getNormalizedValue();
            const validated = this.validateAndClampValue(normalized);
            const formatted = this.formatValue(validated);
            e.target.value = formatted;
            this.input.dataset.normalizedValue = validated;

            // Update validation attributes after validation
            this.updateValidationAttributes();

            // Dispatch event if value was clamped
            if (validated !== normalized) {
                this.input.dispatchEvent(new CustomEvent('currencyclamped', {
                    detail: {
                        original: parseFloat(normalized) || 0,
                        clamped: parseFloat(validated) || 0,
                        min: this.options.min,
                        max: this.options.max
                    }
                }));
            }
        }
    }

    _handleFocus(e) {
        // Optionally remove formatting on focus for easier editing
        if (this.options.autoFormat) {
            const normalized = this.getNormalizedValue();
            if (normalized && normalized !== '0') {
                e.target.value = normalized.replace('.', this.formats[this.options.language].decimal);
            }
        }
    }

    cleanValue(value, preserveStructure = false) {
        const format = this.formats[this.options.language];

        // Remove all non-numeric except minus, decimal separators
        let cleaned = value.replace(/[^\d\-.,]/g, '');

        // Handle negative sign
        if (!this.options.allowNegative) {
            cleaned = cleaned.replace(/-/g, '');
        } else {
            // Keep only first minus at the beginning
            const isNegative = cleaned.charAt(0) === '-';
            cleaned = cleaned.replace(/-/g, '');
            if (isNegative) cleaned = '-' + cleaned;
        }

        if (!preserveStructure) {
            // Remove thousand separators for normalized value
            cleaned = cleaned.replace(/[.,]/g, (match, offset) => {
                // Keep last separator as decimal
                const lastComma = cleaned.lastIndexOf(',');
                const lastDot = cleaned.lastIndexOf('.');
                const lastSeparator = Math.max(lastComma, lastDot);
                return offset === lastSeparator ? '.' : '';
            });
        }

        return cleaned;
    }

    getNormalizedValue() {
        const value = this.input.value;
        if (!value) return '';

        // Clean and normalize to standard format (1234.56)
        let normalized = this.cleanValue(value, false);

        // Parse to float
        const parsed = parseFloat(normalized);
        if (isNaN(parsed)) return '';

        // Apply rounding based on roundDecimals option
        if (this.options.roundDecimals) {
            return parsed.toFixed(this.options.decimalPlaces);
        } else {
            // Keep full precision, but limit to specified decimal places
            const parts = normalized.split('.');
            if (parts[1] && parts[1].length > this.options.decimalPlaces) {
                parts[1] = parts[1].slice(0, this.options.decimalPlaces);
                return parts.join('.');
            }
            return normalized;
        }
    }

    validateAndClampValue(normalizedValue) {
        if (!normalizedValue || normalizedValue === '') return '';

        const numericValue = parseFloat(normalizedValue);
        if (isNaN(numericValue)) return '';

        let clampedValue = numericValue;

        // Apply min constraint
        if (this.options.min !== null && numericValue < this.options.min) {
            clampedValue = this.options.min;
        }

        // Apply max constraint
        if (this.options.max !== null && numericValue > this.options.max) {
            clampedValue = this.options.max;
        }

        // Return as string with proper decimal places
        if (this.options.roundDecimals) {
            return clampedValue.toFixed(this.options.decimalPlaces);
        } else {
            // Preserve original decimal places if not rounding
            const originalDecimals = normalizedValue.split('.')[1];
            if (originalDecimals) {
                const decimals = Math.min(originalDecimals.length, this.options.decimalPlaces);
                return clampedValue.toFixed(decimals);
            }
            return clampedValue.toString();
        }
    }

    formatValue(normalizedValue) {
        if (!normalizedValue || normalizedValue === '') return '';

        const format = this.formats[this.options.language];
        const parts = normalizedValue.split('.');
        let integerPart = parts[0];
        const decimalPart = parts[1] || '';

        // Add thousand separators
        if (this.options.autoFormat) {
            integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, format.thousand);
        }

        // Combine with proper decimal separator
        if (this.options.decimalPlaces > 0 && decimalPart) {
            return integerPart + format.decimal + decimalPart;
        }

        return integerPart;
    }

    updateValidationAttributes() {
        const numericValue = parseFloat(this.getNormalizedValue()) || 0;

        // Remove existing validation classes
        this.input.classList.remove('currency-min-reached', 'currency-max-reached');

        // Add validation classes if at limits
        if (this.options.min !== null && numericValue <= this.options.min) {
            this.input.classList.add('currency-min-reached');
        }
        if (this.options.max !== null && numericValue >= this.options.max) {
            this.input.classList.add('currency-max-reached');
        }

        // Update data attributes for CSS styling
        this.input.dataset.currencyValid = 'true';
        if ((this.options.min !== null && numericValue < this.options.min) ||
            (this.options.max !== null && numericValue > this.options.max)) {
            this.input.dataset.currencyValid = 'false';
        }
    }

    setLanguage(language) {
        this.options.language = language;

        // Reformat current value
        if (this.input.value) {
            const normalized = this.getNormalizedValue();
            this.input.value = this.formatValue(normalized);
        }
    }

    setOptions(newOptions) {
        Object.assign(this.options, newOptions);

        // Revalidate min/max configuration
        this.validateMinMaxConfig();

        // Reformat if needed
        if (this.input.value) {
            const normalized = this.getNormalizedValue();
            const validated = this.validateAndClampValue(normalized);
            this.input.value = this.formatValue(validated);
            this.input.dataset.normalizedValue = validated;
            this.updateValidationAttributes();
        }
    }

    getValue() {
        const normalized = this.getNormalizedValue();
        const numericValue = parseFloat(normalized) || 0;

        return {
            display: this.input.value,
            normalized: normalized,
            numeric: numericValue,
            isValid: (this.options.min === null || numericValue >= this.options.min) &&
                (this.options.max === null || numericValue <= this.options.max),
            min: this.options.min,
            max: this.options.max
        };
    }
}