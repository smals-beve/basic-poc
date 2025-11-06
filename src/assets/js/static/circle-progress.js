export const circleProgressModule = {
  circleProgress: {
    init: function () {
      const progressContainers = document.querySelectorAll('.progress-circle');

      progressContainers.forEach((container) => {
        const ignoreThick = container.getAttribute('data-ignore-thick') === 'true';
        const scrollAnimation = container.getAttribute('data-scroll-animation') === 'true';
        this.addBackgroundCircle(container);

        const bars = Array.from(container.querySelectorAll('.progress-circle-bar'));
        const maxBar = bars.reduce(
          (max, bar) => {
            const valueNow = parseFloat(bar.getAttribute('aria-valuenow')) || 0;
            return valueNow > max.value ? { bar, value: valueNow } : max;
          },
          { bar: null, value: -Infinity }
        ).bar;

        // Read data-center-percentage and data-center-subtext attributes
        let percentageValue = parseFloat(container.getAttribute('data-center-percentage'));
        const subtext = container.getAttribute('data-center-subtext') || '';

        // Use maxBar's value if data-center-percentage is not defined
        if (isNaN(percentageValue)) {
          percentageValue = parseFloat(maxBar.getAttribute('aria-valuenow')) || 0;
        }

        // Create the parent element for percentage and subtext
        const textContainer = document.createElement('div');
        textContainer.classList.add('progress-circle-text');

        // Create the element for the percentage
        const percentageElement = document.createElement('div');
        percentageElement.classList.add('progress-circle-percentage');
        percentageElement.textContent = '0%'; // Starts at 0%

        // Create the element for the subtext
        const subtextElement = document.createElement('div');
        subtextElement.classList.add('progress-circle-subtext');
        subtextElement.textContent = subtext;

        // Add percentage and subtext to the text container
        textContainer.appendChild(percentageElement);
        textContainer.appendChild(subtextElement);

        // Add the text container to the main container
        container.appendChild(textContainer);

        // If scroll animation is enabled
        if (scrollAnimation) {
          const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1, // Trigger when 10% of the element is visible
          };

          const observerCallback = (entries, observer) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                // Start animations
                this.animateBars(bars, ignoreThick, maxBar);
                this.animateValue(percentageElement, 0, percentageValue, 1000); // Duration of 1 second
                // Stop observing after the animation is triggered
                observer.unobserve(container);
              }
            });
          };

          const observer = new IntersectionObserver(observerCallback.bind(this), observerOptions);
          observer.observe(container);
        } else {
          // No animation, display final values immediately
          this.setBarsImmediately(bars, ignoreThick, maxBar);
          percentageElement.textContent = percentageValue + '%';
        }
      });
    },

    // Function to add the background circle
    addBackgroundCircle: function (container) {
      const radius = 44;
      const circumference = 2 * Math.PI * radius;

      const svgNS = 'http://www.w3.org/2000/svg';
      const svg = document.createElementNS(svgNS, 'svg');
      svg.setAttribute('width', '110');
      svg.setAttribute('height', '110');
      svg.setAttribute('viewBox', '0 0 110 110');
      svg.setAttribute('class', 'background-circle');

      const backgroundCircle = document.createElementNS(svgNS, 'circle');
      backgroundCircle.setAttribute('cx', '55');
      backgroundCircle.setAttribute('cy', '55');
      backgroundCircle.setAttribute('r', radius.toString());
      backgroundCircle.setAttribute('fill', 'none');
      backgroundCircle.setAttribute('stroke', 'rgba(4,16,40,0.06)');
      backgroundCircle.setAttribute('stroke-width', '7');
      backgroundCircle.setAttribute('stroke-dasharray', circumference.toString());
      backgroundCircle.setAttribute('stroke-dashoffset', '0');

      svg.appendChild(backgroundCircle);
      container.appendChild(svg);
    },

    // Function to animate the bars
    animateBars: function (bars, ignoreThick, maxBar) {
      bars.forEach((bar, index) => {
        let valueNow = parseFloat(bar.getAttribute('aria-valuenow')) || 0;
        const valueMin = parseFloat(bar.getAttribute('aria-valuemin')) || 0;
        const valueMax = parseFloat(bar.getAttribute('aria-valuemax')) || 100;
        const color = bar.getAttribute('data-color') || '#000';
        const striped = bar.getAttribute('data-striped') === 'true';
        const stripedColor = bar.getAttribute('data-striped-color') || 'rgba(0,0,0,0.2)';

        // Apply valueMin and valueMax limits
        if (valueNow < valueMin) valueNow = valueMin;
        if (valueNow > valueMax) valueNow = valueMax;

        const percentage = valueNow;
        const thick = !ignoreThick && bar !== maxBar;
        bar.style.zIndex = bars.length - index;

        const svg = this.createCircleProgress(percentage, color, striped, thick, stripedColor, true);
        bar.appendChild(svg);
      });
    },

    // Function to set bars to their final state without animation
    setBarsImmediately: function (bars, ignoreThick, maxBar) {
      bars.forEach((bar, index) => {
        let valueNow = parseFloat(bar.getAttribute('aria-valuenow')) || 0;
        const valueMin = parseFloat(bar.getAttribute('aria-valuemin')) || 0;
        const valueMax = parseFloat(bar.getAttribute('aria-valuemax')) || 100;
        const color = bar.getAttribute('data-color') || '#000';
        const striped = bar.getAttribute('data-striped') === 'true';
        const stripedColor = bar.getAttribute('data-striped-color') || 'rgba(0,0,0,0.2)';

        // Apply valueMin and valueMax limits
        if (valueNow < valueMin) valueNow = valueMin;
        if (valueNow > valueMax) valueNow = valueMax;

        const percentage = valueNow;
        const thick = !ignoreThick && bar !== maxBar;
        bar.style.zIndex = bars.length - index;

        const svg = this.createCircleProgress(percentage, color, striped, thick, stripedColor, false);
        bar.appendChild(svg);
      });
    },

    // Function to create the progress circle
    createCircleProgress: function (percentage, color, striped, thick, stripedColor, animate = true) {
      const radius = 44;
      const circumference = 2 * Math.PI * radius;
      const strokeWidth = thick ? 12 : 7;

      const svgNS = 'http://www.w3.org/2000/svg';
      const svg = document.createElementNS(svgNS, 'svg');
      svg.setAttribute('width', '110');
      svg.setAttribute('height', '110');
      svg.setAttribute('viewBox', '0 0 110 110');

      const backgroundCircle = document.createElementNS(svgNS, 'circle');
      backgroundCircle.setAttribute('cx', '55');
      backgroundCircle.setAttribute('cy', '55');
      backgroundCircle.setAttribute('r', radius.toString());
      backgroundCircle.setAttribute('fill', 'none');
      backgroundCircle.setAttribute('stroke-width', strokeWidth.toString());
      backgroundCircle.setAttribute('stroke-linecap', 'round');
      backgroundCircle.setAttribute('stroke-dasharray', circumference.toString());
      backgroundCircle.setAttribute('stroke-dashoffset', circumference.toString());
      backgroundCircle.setAttribute('transform', 'rotate(-90 55 55)');

      // Check if 'color' is a CSS variable
      if (color.startsWith('--')) {
        backgroundCircle.style.stroke = `var(${color})`;
      } else {
        backgroundCircle.setAttribute('stroke', color);
      }

      svg.appendChild(backgroundCircle);

      const animateCircle = () => {
        const offset = circumference - (percentage / 100) * circumference;
        backgroundCircle.style.transition = 'stroke-dashoffset 1s ease-in-out';
        backgroundCircle.setAttribute('stroke-dashoffset', offset.toString());
      };

      if (animate) {
        setTimeout(animateCircle, 100);
      } else {
        // Set final state immediately
        const offset = circumference - (percentage / 100) * circumference;
        backgroundCircle.setAttribute('stroke-dashoffset', offset.toString());
      }

      // Handle striped pattern
      if (striped) {
        const defs = document.createElementNS(svgNS, 'defs');
        const patternId = `striped-${Math.random().toString(36).substring(2, 9)}`;
        const pattern = document.createElementNS(svgNS, 'pattern');
        pattern.setAttribute('id', patternId);
        pattern.setAttribute('width', '10');
        pattern.setAttribute('height', '10');
        pattern.setAttribute('patternUnits', 'userSpaceOnUse');
        pattern.setAttribute('patternTransform', 'rotate(45)');

        const rect1 = document.createElementNS(svgNS, 'rect');
        rect1.setAttribute('width', '5');
        rect1.setAttribute('height', '10');

        // Handle the fill color of the striped pattern
        if (stripedColor.startsWith('--')) {
          rect1.style.fill = `var(${stripedColor})`;
        } else {
          rect1.style.fill = stripedColor;
        }

        const rect2 = document.createElementNS(svgNS, 'rect');
        rect2.setAttribute('x', '5');
        rect2.setAttribute('width', '5');
        rect2.setAttribute('height', '10');
        rect2.setAttribute('fill', 'transparent');

        pattern.appendChild(rect1);
        pattern.appendChild(rect2);
        defs.appendChild(pattern);
        svg.appendChild(defs);

        const stripedCircle = document.createElementNS(svgNS, 'circle');
        stripedCircle.setAttribute('cx', '55');
        stripedCircle.setAttribute('cy', '55');
        stripedCircle.setAttribute('r', radius.toString());
        stripedCircle.setAttribute('fill', 'none');
        stripedCircle.setAttribute('stroke', `url(#${patternId})`);
        stripedCircle.setAttribute('stroke-width', strokeWidth.toString());
        stripedCircle.setAttribute('stroke-linecap', 'round');
        stripedCircle.setAttribute('stroke-dasharray', circumference.toString());
        stripedCircle.setAttribute('stroke-dashoffset', circumference.toString());
        stripedCircle.setAttribute('transform', 'rotate(-90 55 55)');

        svg.appendChild(stripedCircle);

        const animateStripedCircle = () => {
          const offset = circumference - (percentage / 100) * circumference;
          stripedCircle.style.transition = 'stroke-dashoffset 1s ease-in-out';
          stripedCircle.setAttribute('stroke-dashoffset', offset.toString());
        };

        if (animate) {
          setTimeout(animateStripedCircle, 100);
        } else {
          // Set final state immediately
          const offset = circumference - (percentage / 100) * circumference;
          stripedCircle.setAttribute('stroke-dashoffset', offset.toString());
        }
      }

      return svg;
    },

    // Function to animate the percentage value
    animateValue: function (element, start, end, duration) {
      const startTime = performance.now();
      const step = () => {
        const currentTime = performance.now();
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const value = Math.floor(start + (end - start) * progress);
        element.textContent = value + '%';
        if (progress < 1) {
          requestAnimationFrame(step);
        }
      };
      requestAnimationFrame(step);
    },
  },

  init: function () {
    this.circleProgress.init();
  },
};
