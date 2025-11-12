export const rightNavModule = {
    navigation: {
        header: null,
        rightNav: null,
        resizeObserver: null,

        updateRightNavTop: function() {
            const headerElement = this.getHeaderElement();
            if (headerElement && this.rightNav) {
                const headerHeight = headerElement.offsetHeight;

                // Apply additional 42px offset for desktop screens
                const additionalOffset = window.matchMedia("(min-width: 768px)").matches ? 45 : 46;
                this.rightNav.style.top = `${headerHeight + additionalOffset}px`;
            }
        },

        getHeaderElement: function() {
            // Return the appropriate header element based on screen size
            return window.matchMedia("(max-width: 767.98px)").matches
                ? document.querySelector(".js-header .header-main-nav-top")
                : document.querySelector(".js-header .header-content");
        },

        observeHeaderResize: function() {
            const headerElement = this.getHeaderElement();
            if (headerElement) {
                // Clear any existing observer before creating a new one
                if (this.resizeObserver) {
                    this.resizeObserver.disconnect();
                }

                // Create and observe changes in the header element's size
                this.resizeObserver = new ResizeObserver(() => {
                    this.updateRightNavTop();
                });
                this.resizeObserver.observe(headerElement);
            }
        },

        updateObservedElement: function() {
            // Update the observed element based on screen size changes
            this.observeHeaderResize();
        },

        init: function() {
            this.header = document.querySelector(".js-header");
            this.rightNav = document.querySelector(".js-right-nav");

            if (this.header && this.rightNav) {
                this.updateRightNavTop(); // Initial top position
                this.observeHeaderResize(); // Start observing for header size changes
                window.addEventListener("resize", () => {
                    this.updateObservedElement(); // Update observed element on resize
                });
            }
        }
    },
    init: function() {
        this.navigation.init();
    }
};