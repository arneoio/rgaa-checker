/*
 * button-expand.js - Copyright (c) 2023-2024 - Arneo
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
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

  init() {
    var id = this.domNode.getAttribute('aria-controls');
    if (id) {
      this.controlledNode = document.querySelector(`#${id}`) as HTMLElement;
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
