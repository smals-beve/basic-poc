export const topNavModule = {
    navigations: [], // Array to store multiple navigation instances

    createNavigationInstance: function(headerElement) {
        return {
            header: headerElement,
            main: null,
            burger: null,
            html: document.querySelector("html"),
            navItems: null,
            lastScrollTop: 0,
            scrollThreshold: 80,
            resizeObserver: null,
            rightNav: null,
            navBackup: null,
            isCondensed: false,
            resizeDebouncer: null,

            events: function() {
                if (this.burger) {
                    this.burger.addEventListener("click", () => {
                        this.handleBurgerClick();
                    });

                    if (this.navItems.length > 0) {
                        this.navItems.forEach((item) => {
                            item.addEventListener("click", () => {
                                this.navItems.forEach((navItem) => {
                                    if (!item.classList.contains("is-active") && navItem.classList.contains("is-active")) {
                                        navItem.classList.remove("is-active");
                                    }
                                });
                                if (!item.classList.contains("is-active")) {
                                    item.classList.add("is-active");
                                }
                                if (window.matchMedia("(max-width: 1400px)").matches) {
                                    this.handleBurgerClick();
                                }
                            });
                        });
                    }
                }
            },

            handleBurgerClick: function() {
                if (this.burger.classList.contains("active")) {
                    this.html.style.overflow = "auto";
                    this.burger.classList.remove("active");
                    this.burger.setAttribute('aria-expanded', 'false');
                    this.main.classList.remove("active");
                } else {
                    this.html.style.overflow = "hidden";
                    this.burger.classList.add("active");
                    this.burger.setAttribute('aria-expanded', 'true');
                    this.main.classList.add("active");
                }
            },

            handleScroll: function() {
                const currentScroll = window.scrollY;

                if (currentScroll > 0) {
                    this.header.classList.add("scroll-events");
                } else {
                    this.header.classList.remove("scroll-events");
                }

                if (Math.abs(currentScroll - this.lastScrollTop) > this.scrollThreshold) {
                    if (currentScroll > this.lastScrollTop) {
                        this.header.classList.add("is-hidden");
                        if (this.rightNav && window.matchMedia("(max-width: 767.98px)").matches) {
                            this.rightNav.classList.add("push-top");
                        }
                    } else {
                        this.header.classList.remove("is-hidden");
                        if (this.rightNav && window.matchMedia("(max-width: 767.98px)").matches) {
                            this.rightNav.classList.remove("push-top");
                        }
                    }
                    this.lastScrollTop = currentScroll;
                }
            },

            updateLayoutContentPadding: function() {
                // Find the layout-content related to this specific header
                const layoutContent = this.header.parentElement?.querySelector(".layout-content") ||
                    document.querySelector(".layout-content");
                const headerElement = this.getHeaderElement();

                if (headerElement && layoutContent) {
                    let headerHeight = headerElement.offsetHeight;

                    if (window.matchMedia("(max-width: 767.98px)").matches && this.rightNav) {
                        const rightNavBtn = this.rightNav.querySelector(".right-nav-btn");
                        if (rightNavBtn) {
                            const rightNavBtnHeight = rightNavBtn.offsetHeight;
                            headerHeight += rightNavBtnHeight;
                        }
                    }

                    layoutContent.style.paddingTop = `${headerHeight}px`;
                }
            },

            getHeaderElement: function() {
                return window.matchMedia("(max-width: 991.98px)").matches
                    ? this.header.querySelector(".header-main-nav-top")
                    : this.header.querySelector(".header-content");
            },

            observeHeaderResize: function() {
                const headerElement = this.getHeaderElement();
                if (headerElement) {
                    if (this.resizeObserver) {
                        this.resizeObserver.disconnect();
                    }

                    this.resizeObserver = new ResizeObserver(() => {
                        this.updateLayoutContentPadding();
                    });
                    this.resizeObserver.observe(headerElement);
                }
            },

            updateObservedElement: function() {
                this.observeHeaderResize();
            },

            checkNavOverflow: function() {
                // Do not execute on mobile (< 992px)
                if (window.matchMedia("(max-width: 991.98px)").matches) {
                    if (this.isCondensed) {
                        this.restoreFullNav();
                    }
                    return;
                }

                const mainNavContainer = this.header.querySelector("#main-nav");
                const headerMainNav = this.header.querySelector(".header-main-nav");
                const headerMainActions = this.header.querySelector(".header-main-actions");

                if (!mainNavContainer || !headerMainNav || !headerMainActions) {
                    return;
                }

                // Calculate widths
                const containerWidth = mainNavContainer.offsetWidth;
                const navWidth = headerMainNav.scrollWidth;
                const actionsWidth = headerMainActions.scrollWidth;
                const totalWidth = navWidth + actionsWidth;

                // Add a safety margin of 50px
                const needsCondensing = totalWidth > (containerWidth - 50);

                if (needsCondensing && !this.isCondensed) {
                    this.createCondensedMenu();
                } else if (!needsCondensing && this.isCondensed) {
                    this.restoreFullNav();
                }
            },

            createCondensedMenu: function() {
                const nav = this.header.querySelector(".header-main-nav .nav");
                if (!nav || this.isCondensed) return;

                // Save the original structure
                this.navBackup = nav.innerHTML;

                // Get all existing nav-items
                const navItems = nav.querySelectorAll(".nav-item");
                const dropdownItems = [];
                const regularItems = [];

                navItems.forEach(item => {
                    const dropdown = item.querySelector(".dropdown");
                    if (dropdown) {
                        // Already a dropdown, retrieve its content
                        const button = dropdown.querySelector(".dropdown-toggle");
                        const menu = dropdown.querySelector(".dropdown-menu");

                        if (button && menu) {
                            const buttonText = button.textContent.trim();
                            const menuItems = menu.querySelectorAll(".dropdown-item");

                            // Create a menu item with submenu
                            const listItem = document.createElement("li");
                            const collapseId = `collapse-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

                            listItem.innerHTML = `
                                <button class="btn btn-toggle dropdown-item" type="button" 
                                    data-bs-toggle="collapse" data-bs-target="#${collapseId}" 
                                    aria-expanded="false" aria-controls="${collapseId}">
                                    ${buttonText}
                                </button>
                                <div class="collapse" id="${collapseId}">
                                    <ul class="toggle-nav list-unstyled">
                                        ${Array.from(menuItems).map(item =>
                                `<li>${item.outerHTML}</li>`
                            ).join('')}
                                    </ul>
                                </div>
                            `;
                            dropdownItems.push(listItem);
                        }
                    } else {
                        // Simple link
                        const link = item.querySelector("a");
                        if (link) {
                            const listItem = document.createElement("li");
                            const newLink = link.cloneNode(true);
                            newLink.classList.remove("nav-link", "btn");
                            newLink.classList.add("dropdown-item");
                            newLink.classList.add("nav-link");
                            listItem.appendChild(newLink);
                            regularItems.push(listItem);
                        }
                    }
                });

                // Create the new condensed menu
                const condensedHTML = `
                    <li class="nav-item">
                        <div class="dropdown">
                            <button type="button" class="btn dropdown-toggle" role="button" 
                                data-bs-toggle="dropdown" aria-expanded="false" data-bs-auto-close="outside">
                                <span class="material-symbols-rounded pe-3" aria-hidden="true" role="img">menu</span> Menu
                            </button>
                            <div class="dropdown-menu">
                                <ul class="overflow-hidden list-unstyled">
                                    ${dropdownItems.map(item => item.outerHTML).join('')}
                                    ${regularItems.map(item => item.outerHTML).join('')}
                                </ul>
                            </div>
                        </div>
                    </li>
                `;

                nav.innerHTML = condensedHTML;
                this.isCondensed = true;

                // Reinitialize Bootstrap dropdowns for this specific header
                this.reinitializeBootstrapComponents();
            },

            restoreFullNav: function() {
                if (!this.navBackup || !this.isCondensed) return;

                const nav = this.header.querySelector(".header-main-nav .nav");
                if (nav) {
                    nav.innerHTML = this.navBackup;
                    this.isCondensed = false;

                    // Reattach events to the new elements
                    this.navItems = this.header.querySelectorAll(".nav__items a");
                    if (this.navItems.length > 0) {
                        this.navItems.forEach((item) => {
                            item.addEventListener("click", () => {
                                this.navItems.forEach((navItem) => {
                                    if (!item.classList.contains("is-active") && navItem.classList.contains("is-active")) {
                                        navItem.classList.remove("is-active");
                                    }
                                });
                                if (!item.classList.contains("is-active")) {
                                    item.classList.add("is-active");
                                }
                                if (window.matchMedia("(max-width: 1400px)").matches) {
                                    this.handleBurgerClick();
                                }
                            });
                        });
                    }

                    // Reinitialize Bootstrap dropdowns for this specific header
                    this.reinitializeBootstrapComponents();
                }
            },

            reinitializeBootstrapComponents: function() {
                // Reinitialize Bootstrap dropdowns for this specific header only
                if (typeof bootstrap !== 'undefined' && bootstrap.Dropdown) {
                    const dropdownElements = this.header.querySelectorAll('[data-bs-toggle="dropdown"]');
                    dropdownElements.forEach(el => {
                        new bootstrap.Dropdown(el);
                    });
                }

                // Reinitialize Bootstrap collapses for this specific header only
                if (typeof bootstrap !== 'undefined' && bootstrap.Collapse) {
                    const collapseElements = this.header.querySelectorAll('[data-bs-toggle="collapse"]');
                    collapseElements.forEach(el => {
                        new bootstrap.Collapse(el, {
                            toggle: false
                        });
                    });
                }
            },

            init: function() {
                this.main = this.header.querySelector(".header-content");
                this.burger = this.header.querySelector("#js-burger-trigger-topnav");
                this.navItems = this.header.querySelectorAll(".nav__items a");
                this.rightNav = this.header.parentElement?.querySelector(".js-right-nav") ||
                    document.querySelector(".js-right-nav");
                this.lastScrollTop = window.scrollY;

                if (!this.main) return false;

                this.events();
                this.updateLayoutContentPadding();
                this.observeHeaderResize();

                // Check overflow after a short delay to ensure everything is rendered
                setTimeout(() => {
                    this.checkNavOverflow();
                }, 100);

                return true;
            }
        };
    },

    handleGlobalResize: function() {
        // Handle global resize for all headers
        this.navigations.forEach(nav => {
            if (nav.burger && nav.burger.classList.contains("active") && window.matchMedia("(min-width: 992px)").matches) {
                nav.html.style.overflow = "auto";
                nav.burger.classList.remove("active");
                nav.burger.setAttribute('aria-expanded', 'false');
                nav.main.classList.remove("active");
            }
            nav.updateObservedElement();
            nav.updateLayoutContentPadding();

            // Debounce checkNavOverflow for each header
            clearTimeout(nav.resizeDebouncer);
            nav.resizeDebouncer = setTimeout(() => {
                nav.checkNavOverflow();
            }, 150);
        });
    },

    handleGlobalScroll: function() {
        // Handle global scroll for all headers
        this.navigations.forEach(nav => {
            nav.handleScroll();
        });
    },

    init: function() {
        // Retrieve all headers with the js-header class
        const headers = document.querySelectorAll(".js-header");

        if (headers.length === 0) return;

        // Create a navigation instance for each header
        headers.forEach(headerElement => {
            const navInstance = this.createNavigationInstance(headerElement);
            if (navInstance.init()) {
                this.navigations.push(navInstance);
            }
        });

        // Add global events once
        if (this.navigations.length > 0) {
            window.addEventListener('resize', this.handleGlobalResize.bind(this));
            window.addEventListener('scroll', this.handleGlobalScroll.bind(this));
        }
    }
};
