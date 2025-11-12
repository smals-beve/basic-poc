export const notificationModule = {
    unread: {
        /**
         * Handles filtering of unread notifications
         * @param {HTMLElement} container - The notification container
         * @param {boolean} showOnlyUnread - Show only unread notifications
         */
        filterNotifications: function(container, showOnlyUnread) {
            const notificationItems = container.querySelectorAll('.notification-item');

            if (!notificationItems.length) return;

            notificationItems.forEach(item => {
                if (showOnlyUnread) {
                    // If we want to see only unread
                    if (item.classList.contains('unread')) {
                        item.classList.remove('d-none');
                    } else {
                        item.classList.add('d-none');
                    }
                } else {
                    // Otherwise, show everything
                    item.classList.remove('d-none');
                }
            });

            // Check if there are visible elements after filtering
            this.checkEmptyState(container, showOnlyUnread);
        },

        /**
         * Checks if the list is empty after filtering and displays a message if necessary
         * @param {HTMLElement} container - The notification container
         * @param {boolean} isFiltered - Whether a filter is active
         */
        checkEmptyState: function(container, isFiltered) {
            const notificationList = container.querySelector('.notification-list');
            if (!notificationList) return;

            const visibleItems = notificationList.querySelectorAll('.notification-item:not(.d-none)');
            const emptyStateExists = notificationList.querySelector('.notification-empty-state');

            if (visibleItems.length === 0 && isFiltered) {
                // No unread notifications, show a message
                if (!emptyStateExists) {
                    const emptyState = document.createElement('div');
                    emptyState.className = 'notification-empty-state text-center py-5';
                    emptyState.innerHTML = `
                        <span class="h6 text-muted lh-sm">
                            No unread notifications
                        </span>
                    `;
                    notificationList.appendChild(emptyState);
                }
            } else if (emptyStateExists) {
                // Remove the message if elements are visible
                emptyStateExists.remove();
            }
        },

        /**
         * Attaches event listeners to unread switches
         * @param {HTMLElement} container - The notification container
         */
        attachSwitchListener: function(container) {
            const switchInput = container.querySelector('.form-switch input[type="checkbox"]');

            if (!switchInput) return;

            // Remove old listeners to avoid duplicates
            const newSwitch = switchInput.cloneNode(true);
            switchInput.parentNode.replaceChild(newSwitch, switchInput);

            // Add the new listener
            newSwitch.addEventListener('change', (e) => {
                this.filterNotifications(container, e.target.checked);
            });
        },

        /**
         * Initializes the unread module for all notification containers
         */
        init: function() {
            // Select all notification containers
            const notificationContainers = document.querySelectorAll('.notification');

            // Check that there is at least one container
            if (!notificationContainers.length) {
                console.log('No notification container found');
                return;
            }

            // Loop through each container
            notificationContainers.forEach(container => {
                // Check that the container exists and contains at least one notification-item
                const hasNotificationItems = container.querySelector('.notification-item');

                if (!hasNotificationItems) {
                    console.log('No notification-item found in this container');
                    return;
                }

                // Attach event listeners for this container
                this.attachSwitchListener(container);

                // Check the initial state of the switch
                const switchInput = container.querySelector('.form-switch input[type="checkbox"]');
                if (switchInput && switchInput.checked) {
                    this.filterNotifications(container, true);
                }
            });
        }
    },

    /**
     * Initializes the complete notification module
     */
    init: function() {
        // Wait for DOM to be fully loaded if necessary
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.unread.init();
            });
        } else {
            this.unread.init();
        }
    }
};