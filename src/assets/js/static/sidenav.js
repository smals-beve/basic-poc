export const sidenavModule = {
    sidenav: {
        burger: null,
        sidenavElement: null,
        html: null,
        handleBurgerClick: function() {
            if (this.burger.classList.contains("active")) {
                this.closeSidenav();
            } else {
                this.openSidenav();
            }
        },
        closeSidenav: function() {
            this.html.style.overflow = "auto";
            this.burger.classList.remove("active");
            this.sidenavElement.classList.remove("active");
        },
        openSidenav: function() {
            this.html.style.overflow = "hidden";
            this.burger.classList.add("active");
            this.sidenavElement.classList.add("active");
        },
        init: function() {
            this.burger = document.querySelector("#js-burger-trigger-sidenav");
            this.sidenavElement = document.querySelector("#sidenav");
            this.html = document.querySelector("html");

            if (!this.burger || !this.sidenavElement) return false;

            this.burger.addEventListener("click", () => {
                this.handleBurgerClick();
            });

            // Adding the event handler for the close button or element
            const closeBg = this.sidenavElement.querySelector('.sidenav-close-bg');
            if (closeBg) {
                closeBg.addEventListener("click", () => {
                    this.closeSidenav();
                });
            }
        }
    },
    init: function() {
        this.sidenav.init();
    }
};
