import Criterion2_1 from "./criteria/Criterion2_1";
import Criterion2_2 from "./criteria/Criterion2_2";
import Criterion5_1 from "./criteria/Criterion5_1";
import Criterion5_2 from "./criteria/Criterion5_2";
import Criterion5_3 from "./criteria/Criterion5_3";
import Criterion6_2 from "./criteria/Criterion6_2";
import Criterion8_1 from "./criteria/Criterion8_1";
import Criterion8_3 from "./criteria/Criterion8_3";
import Criterion8_4 from "./criteria/Criterion8_4";
import Criterion8_5 from "./criteria/Criterion8_5";
import Criterion8_6 from "./criteria/Criterion8_6";
import Criterion9_1 from "./criteria/Criterion9_1";

export default class AccessibilityTester {
  $wrapper: HTMLElement;
  criterionList: any[];

  constructor($wrapper: HTMLElement) {
    this.$wrapper = $wrapper;

    this.criterionList = [
      new Criterion2_1(this.$wrapper),
      new Criterion2_2(this.$wrapper),
      new Criterion5_1(this.$wrapper),
      new Criterion5_2(this.$wrapper),
      new Criterion5_3(this.$wrapper),
      new Criterion6_2(this.$wrapper),
      new Criterion8_1(this.$wrapper),
      new Criterion8_3(this.$wrapper),
      new Criterion8_4(this.$wrapper),
      new Criterion8_5(this.$wrapper),
      new Criterion8_6(this.$wrapper),
      new Criterion9_1(this.$wrapper),
    ];
  }

  runTests() {
    for (const criterion of this.criterionList) {
      criterion.runTest();
    }
  }
}
