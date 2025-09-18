export const popoverModule = {
    popover: {
        init: function() {
            const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
            this.popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl));
        }
    },
    init: function() {
        this.popover.init();
    }
};

