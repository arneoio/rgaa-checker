/*
  * Inits tab system
  */
export default class TabUtil {
  toggleEventName: string;
  $tabWrapper: HTMLElement;
  toggleEvent: Event;
  KEYS: { end: string; home: string; left: string; up: string; right: string; down: string; delete: string; enter: string; space: string; };
  DIRECTION: { [x: string]: number; };

  constructor($tabWrapper: HTMLElement) {
    this.toggleEventName = this.getToggleEventName();
    this.$tabWrapper = $tabWrapper;

    this.toggleEvent = document.createEvent('Event');
    this.toggleEvent.initEvent(this.toggleEventName, true, true);

    // For easy reference
    this.KEYS = {
      end: 'End',
      home: 'Home',
      left: 'ArrowLeft',
      up: 'ArrowUp',
      right: 'ArrowRight',
      down: 'ArrowDown',
      delete: 'Delete',
      enter: 'Enter',
      space: 'Space',
    }

    // Add or subtract depending on key pressed
    this.DIRECTION = {
      [this.KEYS.left]: -1,
      [this.KEYS.up]: -1,
      [this.KEYS.right]: 1,
      [this.KEYS.down]: 1,
    }

    this.bindEvents();
  }

  getToggleEventName() {
    return 'tabtoggle';
  }

  bindEvents() {
    this.$tabWrapper.querySelectorAll('[role="tab"]').forEach(($tab: HTMLElement, index) => {
      $tab.dataset.index = index.toString();
      $tab.addEventListener('click', (e: Event) =>
        this.activateTab(e.currentTarget as HTMLElement, true),
      );
      if (this.$tabWrapper.hasAttribute('data-automatic')) {
        $tab.addEventListener('keydown', (e) =>
          this.autoKeydownEventListener(e),
        );
        $tab.addEventListener('keyup', (e) => this.autoKeyupEventListener(e));
        // TODO: essayer d'éviter le double trigger au focus dans certains cas.
        $tab.addEventListener('focus', (e) =>
          this.activateTab(e.currentTarget as HTMLElement, false),
        );
      } else {
        $tab.addEventListener('keydown', (e) => this.keydownEventListener(e));
        $tab.addEventListener('keyup', (e) => this.keyupEventListener(e));
      }
    });
  }

  activateTab($tab: HTMLElement, setFocus: boolean = false) {
    this.deactivateTabs($tab.closest('[role="tablist"]'));
    $tab.removeAttribute('tabindex');
    $tab.setAttribute('aria-selected', 'true');
    $tab.dispatchEvent(this.toggleEvent);

    document?.querySelector(`#${$tab.getAttribute('aria-controls')}`)?.removeAttribute('hidden');

    if (setFocus) {
      $tab.focus();
    }
  }

  deactivateTabs($tabPanel: HTMLElement) {
    $tabPanel.querySelectorAll('[role="tab"]').forEach(($tab) => {
      $tab.setAttribute('tabindex', '-1');
      $tab.setAttribute('aria-selected', 'false');
      document?.querySelector(`#${$tab.getAttribute('aria-controls')}`)?.setAttribute('hidden', 'hidden');
    });
  }

  autoKeydownEventListener(event: KeyboardEvent) {
    var key = event.key;

    switch (key) {
      case this.KEYS.end:
        this.focusLastTab(event.currentTarget as HTMLElement, true);
        break;
      case this.KEYS.home:
        event.preventDefault();
        this.focusFirstTab(event.currentTarget as HTMLElement, true);
        break;
      case this.KEYS.up:
      case this.KEYS.down:
        this.determineOrientation(event, true);
        break;
    }
  }

  autoKeyupEventListener(event: KeyboardEvent) {
    var key = event.key;

    switch (key) {
      case this.KEYS.left:
      case this.KEYS.right:
        this.determineOrientation(event, true);
        break;
      case this.KEYS.delete:
        this.determineDeletable(event);
        break;
    }
  }

  keydownEventListener(event: KeyboardEvent) {
    var key = event.key;

    switch (key) {
      case this.KEYS.end:
        // Activate last tab
        event.preventDefault();
        this.focusLastTab(event.currentTarget as HTMLElement, false);
        break;
      case this.KEYS.home:
        // Activate first tab
        event.preventDefault();
        this.focusFirstTab(event.currentTarget as HTMLElement, false);
        break;
      // Up and down are in keydown because we need to prevent page scroll
      case this.KEYS.up:
      case this.KEYS.down:
        this.determineOrientation(event, false);
        break;
    }
  }

  keyupEventListener(event: KeyboardEvent) {
    var key = event.key;

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
        this.activateTab(event.target as HTMLElement);
        break;
    }
  }

  focusFirstTab($tab: HTMLElement, activate: boolean) {
    var $firstTab = $tab?.closest('[role="tablist"]')?.querySelector('[role="tab"]:first-child') as HTMLElement;
    $firstTab.focus();
    if (activate) {
      this.activateTab($firstTab);
    }
  }

  focusLastTab($tab: HTMLElement, activate: boolean) {
    var $lastTab = $tab?.closest('[role="tablist"]')?.querySelector('[role="tab"]:last-child') as HTMLElement;
    if (!$lastTab) {
      return;
    }
    $lastTab.focus();
    if (activate) {
      this.activateTab($lastTab);
    }
  }

  // When a tablist aria-orientation is set to vertical, only up and down arrow should function.
  // In all other cases only left and right arrow function.
  determineOrientation(event: KeyboardEvent, activate: boolean) {
    var key = event.key;
    var $tabWrapper = (event.currentTarget as HTMLElement).closest('[role="tablist"]');
    if (!$tabWrapper) {
      return;
    }
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
  }

  switchTabOnArrowPress(event: KeyboardEvent, activate: boolean) {
    var pressed = event.key;
    if (this.DIRECTION[pressed]) {
      var $tab = event.target as HTMLElement;
      const index = parseInt($tab.dataset.index);
      if (typeof index !== 'undefined') {
        var $tabList = $tab?.closest('[role="tablist"]')?.querySelectorAll('[role="tab"]');
        if (!$tabList) {
          return;
        }
        if ($tabList[index + this.DIRECTION[pressed]]) {
          if (activate) {
            this.activateTab(
              $tabList[index + this.DIRECTION[pressed]] as HTMLElement,
              true,
            );
          } else {
            ($tabList[index + this.DIRECTION[pressed]] as HTMLElement).focus();
          }
        } else if (pressed === this.KEYS.left || pressed === this.KEYS.up) {
          this.focusLastTab($tab, activate);
        } else if (pressed === this.KEYS.right || pressed == this.KEYS.down) {
          this.focusFirstTab($tab, activate);
        }
      }
    }
  }

  determineDeletable(event: KeyboardEvent) {
    // TODO
  }
};
