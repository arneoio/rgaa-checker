/*
 * draggable.js - Copyright (c) 2023-2024 - Arneo
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
export default class Draggable {
  domNode: HTMLElement;
  handleElementList: HTMLElement[];
  initialMousePosition: { x: number; y: number };
  mouseMoveHandler: (e: MouseEvent) => void;
  mouseUpHandler: (e: MouseEvent) => void;

  constructor(domNode: HTMLElement) {
    this.domNode = domNode;
    this.handleElementList = Array.from(
      this.domNode.querySelectorAll('.js-draggable__handle')
    );
    this.initialMousePosition = { x: 0, y: 0 };
    this.mouseMoveHandler = this.handleMouseMove.bind(this);
    this.mouseUpHandler = this.handleMouseUp.bind(this);

    this.bindEvents();
  }

  bindEvents() {
    this.handleElementList.forEach((handleElement) => {
      handleElement.addEventListener('mousedown', this.handleMouseDown.bind(this));
    });
  }

  handleMouseDown(e: MouseEvent) {
    this.initialMousePosition = {
      x: this.domNode.offsetLeft - e.clientX,
      y: this.domNode.offsetTop - e.clientY,
    };

    document.addEventListener('mousemove', this.mouseMoveHandler);
    document.addEventListener('mouseup', this.mouseUpHandler);
  }

  handleMouseMove(e: MouseEvent) {
    this.domNode.style.left = `${this.initialMousePosition.x + e.clientX}px`;
    this.domNode.style.top = `${this.initialMousePosition.y + e.clientY}px`;
  }

  handleMouseUp() {
    document.removeEventListener('mousemove', this.mouseMoveHandler);
    document.removeEventListener('mouseup', this.mouseUpHandler);
  }
}
