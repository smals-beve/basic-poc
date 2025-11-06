export const togglePasswordModule = {
    togglePassword: {
        init: function() {
            const togglePasswordButtons = document.querySelectorAll('.btn-toggle-password');

            togglePasswordButtons.forEach(button => {
                button.addEventListener('click', function () {
                    const passwordContainer = this.closest('.input-group');
                    const passwordField = passwordContainer.querySelector('input[type="password"], input[type="text"]');
                    const icon = this.querySelector('.material-symbols-rounded');
                    const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
                    passwordField.setAttribute('type', type);
                    icon.innerText = (icon.innerText === 'visibility') ? 'visibility_off' : 'visibility';
                    this.setAttribute('aria-label', type === 'password' ? this.getAttribute('data-show') : this.getAttribute('data-hide'));
                });
            });
        }
    },
    init: function() {
        this.togglePassword.init();
    }
};