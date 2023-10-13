var TabUtil = {
  /*
   * Inits tab system
   */
  init: function ($tabWrapper, $rootElement) {
    this.toggleEventName = this.getToggleEventName();
    this.$tabWrapper = $tabWrapper;
    this.$rootElement = $rootElement;

    this.toggleEvent = document.createEvent('Event');
    this.toggleEvent.initEvent(this.toggleEventName, true, true);

    // For easy reference
    this.KEYS = {
      end: 35,
      home: 36,
      left: 37,
      up: 38,
      right: 39,
      down: 40,
      delete: 46,
      enter: 13,
      space: 32,
    };

    // Add or subtract depending on key pressed
    this.DIRECTION = {
      37: -1,
      38: -1,
      39: 1,
      40: 1,
    };

    this.bindEvents();
  },

  getToggleEventName: function () {
    return 'tabtoggle';
  },

  bindEvents: function () {
    this.$tabWrapper.querySelectorAll('[role="tab"]').forEach(($tab, index) => {
      $tab.index = index;
      $tab.addEventListener('click', (e) =>
        this.activateTab(e.currentTarget, false),
      );
      if (this.$tabWrapper.hasAttribute('data-automatic')) {
        $tab.addEventListener('keydown', (e) =>
          this.autoKeydownEventListener(e),
        );
        $tab.addEventListener('keyup', (e) => this.autoKeyupEventListener(e));
        // TODO: essayer d'éviter le double trigger au focus dans certains cas.
        $tab.addEventListener('focus', (e) =>
          this.activateTab(e.currentTarget, false),
        );
      } else {
        $tab.addEventListener('keydown', (e) => this.keydownEventListener(e));
        $tab.addEventListener('keyup', (e) => this.keyupEventListener(e));
      }
    });
  },

  activateTab: function ($tab, setFocus) {
    this.deactivateTabs($tab.closest('[role="tablist"]'));
    $tab.removeAttribute('tabindex');
    $tab.setAttribute('aria-selected', 'true');
    $tab.dispatchEvent(this.toggleEvent);

    this.$rootElement
      .getElementById($tab.getAttribute('aria-controls'))
      .removeAttribute('hidden');

    if (setFocus) {
      $tab.focus();
    }
  },

  deactivateTabs: function ($tabPanel) {
    $tabPanel.querySelectorAll('[role="tab"]').forEach(($tab) => {
      $tab.setAttribute('tabindex', '-1');
      $tab.setAttribute('aria-selected', 'false');
      this.$rootElement
        .getElementById($tab.getAttribute('aria-controls'))
        .setAttribute('hidden', 'hidden');
    });
  },

  autoKeydownEventListener: function (event) {
    var key = event.keyCode;

    switch (key) {
      case this.KEYS.end:
        this.focusLastTab(event.currentTarget, true);
        break;
      case this.KEYS.home:
        event.preventDefault();
        this.focusFirstTab(event.currentTarget, true);
        break;
      case this.KEYS.up:
      case this.KEYS.down:
        this.determineOrientation(event, true);
        break;
    }
  },

  autoKeyupEventListener: function (event) {
    var key = event.keyCode;

    switch (key) {
      case this.KEYS.left:
      case this.KEYS.right:
        this.determineOrientation(event, true);
        break;
      case this.KEYS.delete:
        this.determineDeletable(event);
        break;
    }
  },

  keydownEventListener: function (event) {
    var key = event.keyCode;

    switch (key) {
      case this.KEYS.end:
        // Activate last tab
        event.preventDefault();
        this.focusLastTab(event.currentTarget, false);
        break;
      case this.KEYS.home:
        // Activate first tab
        event.preventDefault();
        this.focusFirstTab(event.currentTarget, false);
        break;
      // Up and down are in keydown because we need to prevent page scroll
      case this.KEYS.up:
      case this.KEYS.down:
        this.determineOrientation(event, false);
        break;
    }
  },

  keyupEventListener: function (event) {
    var key = event.keyCode;

    switch (key) {
      case this.KEYS.left:
      case this.KEYS.right:
        this.determineOrientation(event, false);
        break;
      case this.KEYS.delete:
        this.determineDeletable(event);
        break;
      case this.KEYS.enter:
      case this.KEYS.space:
        this.activateTab(event.target);
        break;
    }
  },

  focusFirstTab: function ($tab, activate) {
    var $firstTab = $tab
      .closest('[role="tablist"]')
      .querySelector('[role="tab"]:first-child');
    $firstTab.focus();
    if (activate) {
      this.activateTab($firstTab);
    }
  },

  focusLastTab: function ($tab, activate) {
    var $lastTab = $tab
      .closest('[role="tablist"]')
      .querySelector('[role="tab"]:last-child');
    $lastTab.focus();
    if (activate) {
      this.activateTab($lastTab);
    }
  },

  // When a tablist aria-orientation is set to vertical, only up and down arrow should function.
  // In all other cases only left and right arrow function.
  determineOrientation: function (event, activate) {
    var key = event.keyCode;
    var $tabWrapper = event.currentTarget.closest('[role="tablist"]');
    var isVertical =
      $tabWrapper.hasAttribute('aria-orientation') &&
      $tabWrapper.getAttribute('aria-orientation') == 'vertical';
    var proceed = false;
    if (isVertical) {
      if (key === this.KEYS.up || key === this.KEYS.down) {
        event.preventDefault();
        proceed = true;
      }
    } else {
      if (key === this.KEYS.left || key === this.KEYS.right) {
        proceed = true;
      }
    }

    if (proceed) {
      this.switchTabOnArrowPress(event, activate);
    }
  },

  switchTabOnArrowPress: function (event, activate) {
    var pressed = event.keyCode;
    if (this.DIRECTION[pressed]) {
      var $tab = event.target;
      if ($tab.index !== undefined) {
        var $tabList = $tab
          .closest('[role="tablist"]')
          .querySelectorAll('[role="tab"]');
        if ($tabList[$tab.index + this.DIRECTION[pressed]]) {
          if (activate) {
            this.activateTab(
              $tabList[$tab.index + this.DIRECTION[pressed]],
              true,
            );
          } else {
            $tabList[$tab.index + this.DIRECTION[pressed]].focus();
          }
        } else if (pressed === this.KEYS.left || pressed === this.KEYS.up) {
          this.focusLastTab($tab, activate);
        } else if (pressed === this.KEYS.right || pressed == this.KEYS.down) {
          this.focusFirstTab($tab, activate);
        }
      }
    }
  },

  determineDeletable: function () {
    // TODO
  },
};

export default TabUtil;
