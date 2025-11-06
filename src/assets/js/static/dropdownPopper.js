import * as Popper from '@popperjs/core';

export const dropdownPopperModule = {
  dropdownPopper: {
    init: function () {
      // Select all dropdown containers
      const dropdowns = document.querySelectorAll('.js-dropdown-popper-container');

      // Loop through each dropdown container
      dropdowns.forEach((dropdown) => {
        const button = dropdown.querySelector('.js-dropdown-popper-button'); // The button that toggles the dropdown
        const notification = dropdown.querySelector('.js-dropdown-popper-content'); // The content of the notification
        const closeButton = notification.querySelector('.js-dropdown-popper-close-button'); // The close button inside the notification

        // Initialize Popper.js for dynamic positioning
        const popperInstance = Popper.createPopper(button, notification, {
          placement: 'bottom', // Default position: below the button
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, 8], // Add vertical offset of 8px
              },
            },
            {
              name: 'preventOverflow',
              options: {
                boundary: 'viewport', // Ensure the content does not overflow outside the viewport
              },
            },
          ],
        });

        // Set a high z-index and hide the notification by default
        notification.style.zIndex = '1050'; // Ensure the notification is above other elements
        notification.style.display = 'none'; // Hide the notification initially

        // Toggle the visibility of the notification on button click
        button.addEventListener('click', () => {
          const isVisible = notification.style.display === 'flex';

          if (isVisible) {
            notification.style.display = 'none'; // Hide the notification
          } else {
            notification.style.display = 'flex'; // Show the notification
            popperInstance.update(); // Update the position dynamically
          }
        });

        // Close the notification when the close button is clicked
        closeButton.addEventListener('click', () => {
          notification.style.display = 'none'; // Hide the notification
        });

        // Close the notification if the user clicks outside of the dropdown
        document.addEventListener('click', (event) => {
          if (!dropdown.contains(event.target)) {
            notification.style.display = 'none'; // Hide the notification
          }
        });
      });
    },
  },
  init: function () {
    this.dropdownPopper.init();
  },
};
