export const dismissibleModule = {
    dismissible: {
        init: function() {
            document.querySelectorAll('[data-dismiss]').forEach((el) => {
                el.addEventListener('click', (ev) => {
                    let dismissTarget = ev.target.getAttribute('data-dismiss');
                    ev.target.closest('.' + dismissTarget).remove();
                });
            });
        }
    },
    init: function() {
        this.dismissible.init();
    }
};
