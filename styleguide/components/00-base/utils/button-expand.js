const TOGGLE_EVENT_NAME = 'buttonexpandtoggle';

export default class ButtonExpand {
  constructor(domNode) {
    this.toggleEventName = TOGGLE_EVENT_NAME;
    this.domNode = domNode;
    this.keyCode = Object.freeze({
      RETURN: 13,
    });
    this.toggleEvent = document.createEvent('Event');
    this.toggleEvent.initEvent(this.toggleEventName, true, true);
  }

  static get toggleEventName() {
    return TOGGLE_EVENT_NAME;
  }

  init($rootElement) {
    this.controlledNode = false;

    var id = this.domNode.getAttribute('aria-controls');
    if (id) {
      this.controlledNode = $rootElement.getElementById(id);
    }

    this.domNode.addEventListener('keydown', this.handleKeydown.bind(this));
    this.domNode.addEventListener('click', this.handleClick.bind(this));
    this.domNode.addEventListener('focus', this.handleFocus.bind(this));
    this.domNode.addEventListener('blur', this.handleBlur.bind(this));
  }

  showContent() {
    if (this.controlledNode) {
      this.controlledNode.classList.add('-expanded');
    }
  }

  hideContent() {
    if (this.controlledNode) {
      this.controlledNode.classList.remove('-expanded');
    }
  }

  toggleExpand() {
    if (this.domNode.getAttribute('aria-expanded') === 'true') {
      this.domNode.setAttribute('aria-expanded', 'false');
      this.hideContent();
    } else {
      this.domNode.setAttribute('aria-expanded', 'true');
      this.showContent();
    }
    this.domNode.dispatchEvent(this.toggleEvent);
  }

  handleKeydown(event) {
    switch (event.keyCode) {
      case this.keyCode.RETURN:
        this.toggleExpand();
        event.stopPropagation();
        event.preventDefault();
        break;
      default:
        break;
    }
  }

  handleClick() {
    this.toggleExpand();
  }

  handleFocus() {
    this.domNode.classList.add('-focus');
  }

  handleBlur() {
    this.domNode.classList.remove('-focus');
  }
}
