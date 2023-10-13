export default class Header {
  $wrapper: HTMLElement;
  $element: HTMLElement;
  $closeButton: HTMLElement;

  constructor($wrapper: HTMLElement, $element: HTMLElement) {
    this.$wrapper = $wrapper;
    this.$element = $element;
    this.$closeButton = this.$element.querySelector('.js-header__closeButton');

    this.init();
  }

  init() {
    this.$closeButton.addEventListener('click', this.closeHeader.bind(this));
  }

  closeHeader(event: Event) {
    this.$wrapper.classList.toggle('-closed');
  }
}
