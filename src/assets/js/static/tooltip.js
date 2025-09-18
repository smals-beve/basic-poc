export const tooltipModule = {
    tooltip: {
        init: function() {
            const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
            this.tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
        }
    },
    init: function() {
        this.tooltip.init();
    }
};

