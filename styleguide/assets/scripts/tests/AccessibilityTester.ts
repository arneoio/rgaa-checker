import Criterion1_1 from "./criteria/Criterion1_1";
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
import Criterion9_2 from "./criteria/Criterion9_2";

export default class AccessibilityTester {
  $wrapper: HTMLElement;
  criterionList: any;

  constructor($wrapper: HTMLElement) {
    this.$wrapper = $wrapper;

    this.criterionList = {
      "1.1": new Criterion1_1(this.$wrapper),
      "2.1": new Criterion2_1(this.$wrapper),
      "2.2": new Criterion2_2(this.$wrapper),
      "5.1": new Criterion5_1(this.$wrapper),
      "5.2": new Criterion5_2(this.$wrapper),
      "5.3": new Criterion5_3(this.$wrapper),
      "6.2": new Criterion6_2(this.$wrapper),
      "8.1": new Criterion8_1(this.$wrapper),
      "8.3": new Criterion8_3(this.$wrapper),
      "8.4": new Criterion8_4(this.$wrapper),
      "8.5": new Criterion8_5(this.$wrapper),
      "8.6": new Criterion8_6(this.$wrapper),
      "9.1": new Criterion9_1(this.$wrapper),
      "9.2": new Criterion9_2(this.$wrapper),
    }
  }

  runTests() {
    Object.keys(this.criterionList).forEach((key: string) => {
      const criterion = this.criterionList[key];
      criterion.runTest();
    });
  }
}
