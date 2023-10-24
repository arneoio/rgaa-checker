import Criterion1_1 from "./criteria/Criterion1_1";
import Criterion2_1 from "./criteria/Criterion2_1";
import Criterion2_2 from "./criteria/Criterion2_2";
import Criterion4_1 from "./criteria/Criterion4_1";
import Criterion4_2 from "./criteria/Criterion4_2";
import Criterion4_3 from "./criteria/Criterion4_3";
import Criterion4_4 from "./criteria/Criterion4_4";
import Criterion4_5 from "./criteria/Criterion4_5";
import Criterion4_6 from "./criteria/Criterion4_6";
import Criterion4_7 from "./criteria/Criterion4_7";
import Criterion5_1 from "./criteria/Criterion5_1";
import Criterion5_2 from "./criteria/Criterion5_2";
import Criterion5_3 from "./criteria/Criterion5_3";
import Criterion6_1 from "./criteria/Criterion6_1";
import Criterion6_2 from "./criteria/Criterion6_2";
import Criterion8_1 from "./criteria/Criterion8_1";
import Criterion8_10 from "./criteria/Criterion8_10";
import Criterion8_2 from "./criteria/Criterion8_2";
import Criterion8_3 from "./criteria/Criterion8_3";
import Criterion8_4 from "./criteria/Criterion8_4";
import Criterion8_5 from "./criteria/Criterion8_5";
import Criterion8_6 from "./criteria/Criterion8_6";
import Criterion8_7 from "./criteria/Criterion8_7";
import Criterion8_8 from "./criteria/Criterion8_8";
import Criterion9_1 from "./criteria/Criterion9_1";
import Criterion9_2 from "./criteria/Criterion9_2";
import Criterion9_3 from "./criteria/Criterion9_3";
import Criterion9_4 from "./criteria/Criterion9_4";
import Criterion10_2 from "./criteria/Criterion10_2";
import Criterion11_1 from "./criteria/Criterion11_1";
import Criterion11_2 from "./criteria/Criterion11_2";
import Criterion10_1 from "./criteria/Criterion10_1";

export default class AccessibilityTester {
  $wrapper: HTMLElement;
  $highlightWrapper: HTMLElement;
  criterionList: any;

  constructor($wrapper: HTMLElement, $highlightWrapper: HTMLElement) {
    this.$wrapper = $wrapper;
    this.$highlightWrapper = $highlightWrapper;

    this.criterionList = {
      "1.1": new Criterion1_1(this.$wrapper, this.$highlightWrapper),
      "2.1": new Criterion2_1(this.$wrapper, this.$highlightWrapper),
      "2.2": new Criterion2_2(this.$wrapper, this.$highlightWrapper),
      "4.1": new Criterion4_1(this.$wrapper, this.$highlightWrapper),
      "4.2": new Criterion4_2(this.$wrapper, this.$highlightWrapper),
      "4.3": new Criterion4_3(this.$wrapper, this.$highlightWrapper),
      "4.4": new Criterion4_4(this.$wrapper, this.$highlightWrapper),
      "4.5": new Criterion4_5(this.$wrapper, this.$highlightWrapper),
      "4.6": new Criterion4_6(this.$wrapper, this.$highlightWrapper),
      "4.7": new Criterion4_7(this.$wrapper, this.$highlightWrapper),
      "5.1": new Criterion5_1(this.$wrapper, this.$highlightWrapper),
      "5.2": new Criterion5_2(this.$wrapper, this.$highlightWrapper),
      "5.3": new Criterion5_3(this.$wrapper, this.$highlightWrapper),
      "6.1": new Criterion6_1(this.$wrapper, this.$highlightWrapper),
      "6.2": new Criterion6_2(this.$wrapper, this.$highlightWrapper),
      "8.1": new Criterion8_1(this.$wrapper, this.$highlightWrapper),
      "8.2": new Criterion8_2(this.$wrapper, this.$highlightWrapper),
      "8.3": new Criterion8_3(this.$wrapper, this.$highlightWrapper),
      "8.4": new Criterion8_4(this.$wrapper, this.$highlightWrapper),
      "8.5": new Criterion8_5(this.$wrapper, this.$highlightWrapper),
      "8.6": new Criterion8_6(this.$wrapper, this.$highlightWrapper),
      "8.7": new Criterion8_7(this.$wrapper, this.$highlightWrapper),
      "8.8": new Criterion8_8(this.$wrapper, this.$highlightWrapper),
      "8.10": new Criterion8_10(this.$wrapper, this.$highlightWrapper),
      "9.1": new Criterion9_1(this.$wrapper, this.$highlightWrapper),
      "9.2": new Criterion9_2(this.$wrapper, this.$highlightWrapper),
      "9.3": new Criterion9_3(this.$wrapper, this.$highlightWrapper),
      "9.4": new Criterion9_4(this.$wrapper, this.$highlightWrapper),
      "10.1": new Criterion10_1(this.$wrapper, this.$highlightWrapper),
      "10.2": new Criterion10_2(this.$wrapper, this.$highlightWrapper),
      "11.1": new Criterion11_1(this.$wrapper, this.$highlightWrapper),
      "11.2": new Criterion11_2(this.$wrapper, this.$highlightWrapper),
    }
  }

  runTests() {
    Object.keys(this.criterionList).forEach((key: string) => {
      const criterion = this.criterionList[key];
      criterion.runTest();
    });
  }
}
