export default class ButtonExpand {
  toggleEventName: string;
  domNode: HTMLElement;
  controlledNode: HTMLElement;
  keyCode: { RETURN: string };
  toggleEvent: Event;

  constructor(domNode: HTMLElement) {
    this.toggleEventName = 'buttonexpandtoggle';
    this.domNode = domNode;
    this.keyCode = Object.freeze({
      RETURN: 'Enter',
    });
    this.toggleEvent = document.createEvent('Event');
    this.toggleEvent = new Event(this.toggleEventName, {
      bubbles: true,
      cancelable: true,
    });
  }

  static get toggleEventName() {
    return 'buttonexpandtoggle';
  }

  init($rootElement: HTMLElement) {
    var id = this.domNode.getAttribute('aria-controls');
    if (id) {
      this.controlledNode = $rootElement.querySelector(`#${id}`) as HTMLElement;
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

  handleKeydown(event: KeyboardEvent) {
    switch (event.key) {
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
