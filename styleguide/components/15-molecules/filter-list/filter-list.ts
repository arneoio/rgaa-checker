export default class FilterList {
  $wrapper: HTMLElement;
  $element: HTMLElement;
  $toogleButtonList: NodeListOf<Element>;

  constructor($wrapper: HTMLElement, $element: HTMLElement) {
    this.$wrapper = $wrapper;
    this.$element = $element;
    this.$toogleButtonList = this.$element.querySelectorAll('.js-filterList__toggleButton');

    this.init();
  }

  init() {
    this.$toogleButtonList.forEach(($toogleButton) => {
      $toogleButton.addEventListener('click', this.toggleFilter.bind(this));
    });
  }

  toggleFilter(event: Event) {
    const $target = event.currentTarget as HTMLElement;

    let $criteriaCardList = this.$wrapper.querySelectorAll(`.js-criteriaCard[data-status="${$target.dataset.status}"]`);
    $criteriaCardList.forEach(($criteriaCard: HTMLElement) => {
      if($target.dataset.active === 'true') {
        $criteriaCard.classList.add('-hidden');
      } else {
        $criteriaCard.classList.remove('-hidden');
      }
    });

    $target.dataset.active = $target.dataset.active === 'true' ? 'false' : 'true';
  }
}
