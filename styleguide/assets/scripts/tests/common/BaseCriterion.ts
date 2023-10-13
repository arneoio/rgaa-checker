import { Criterion } from "./Criterion";

export default abstract class BaseCriterion implements Criterion {
  $wrapper: HTMLElement;

  constructor($wrapper: HTMLElement) {
    this.$wrapper = $wrapper;
  }

  updateCriteria(criteriaNumber: string, status: string, verification?: string) {
    let $criteriaCard = this.$wrapper.querySelector(`.js-criteriaCard[data-criteria="${criteriaNumber}"]`) as HTMLElement;
    if(!$criteriaCard) {
      return;
    }
    $criteriaCard.dataset.status = status;

    if(verification) {
      let $criteriaVerification = $criteriaCard.querySelector('.js-criteriaCard__verification') as HTMLElement;
      $criteriaVerification.innerHTML = verification;
    }

    let $criteriaSelector = $criteriaCard.querySelector(`.js-criteriaSelector__link[data-status="${status}"]`) as HTMLElement;
    // Trigger click on criteriaSelector to update its status
    $criteriaSelector.click();
  }

  updateTest(testNumber: string, status: string) {
    let $criteriaTest = this.$wrapper.querySelector(`.js-criteriaCard__test__number[data-test="${testNumber}"]`) as HTMLElement;
    if(!$criteriaTest) {
      return;
    }

    $criteriaTest.dataset.status = status;
  }

  abstract runTest(): void;

  logResults(title: string, log: any): void {
    console.groupCollapsed(title);
    console.log(log);
    console.groupEnd();
  };
}
