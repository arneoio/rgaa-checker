/*
 * ColorUtils.ts - Copyright (c) 2023-2024 - Arneo
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

export default class ColorUtils {
  static getRealBackgroundColor($element: HTMLElement): string {
    const style = window.getComputedStyle($element);
    let backgroundColor = style.backgroundColor;

    // Si le fond est transparent, on remonte dans l'arbre DOM
    if (backgroundColor === 'rgba(0, 0, 0, 0)' || backgroundColor === 'transparent') {
      const parent = $element.parentElement;
      if (parent) {
        return this.getRealBackgroundColor(parent);
      } else {
        return 'rgb(255, 255, 255)';
      }
    }

    return backgroundColor;
  }

  static getLuminance(r: number, g: number, b: number): number {
    // Convert RGB to a 0-1 range
    const a = [r, g, b].map(function (v) {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });

    // Get the luminance of the color
    return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
  }

  static getRgba(color: string): number[] {
    // if color is in the format #RRGGBB
    if (color.length === 7) {
      var r = parseInt(color.substring(1, 3), 16);
      var g = parseInt(color.substring(3, 5), 16);
      var b = parseInt(color.substring(5, 7), 16);
      var a = 255;
    } else {
      // if color is in the format rgb(R, G, B) or rgba(R, G, B, A)
      var rgb = color.match(/\d+/g);
      var r = parseInt(rgb[0]);
      var g = parseInt(rgb[1]);
      var b = parseInt(rgb[2]);
      var a = rgb[3] ? parseInt(rgb[3]) : 255;
    }

    return [r, g, b, a];
  }

  static getContrast(color1: string, color2: string): number {
    // Get the RGB values
    const rgb1: number[]  = ColorUtils.getRgba(color1);
    const rgb2: number[] = ColorUtils.getRgba(color2);

    // Get the luminance of the colors
    const luminance1 = ColorUtils.getLuminance(rgb1[0], rgb1[1], rgb1[2] * (rgb1[3] / 255));
    const luminance2 = ColorUtils.getLuminance(rgb2[0], rgb2[1], rgb2[2] * (rgb1[3] / 255));

    // Calculate the contrast ratio
    const light = Math.max(luminance1, luminance2);
    const dark = Math.min(luminance1, luminance2);
    const ratio = (light + 0.05) / (dark + 0.05);

    return ratio;
  }

  static isValidContrast(hex1: string, hex2: string): boolean {
    const ratio = ColorUtils.getContrast(hex1, hex2);

    if (ratio >= 4.5) {
      return true;
    } else {
      return false;
    }
  }
}
