/*
 * local-storage.ts - Copyright (c) 2023-2024 - Arneo
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
import { StorageData } from '../../00-base/types/storage';

export default class LocalStorage {
  private static STORAGE_KEY: string = 'rgaachecker-results';

  private static getStorageData(): Promise<any> {
    if (typeof browser !== 'undefined' && browser) {
      return browser.storage.local.get(this.STORAGE_KEY).then((data: StorageData) => {
        return data['rgaachecker-results'] || {};
      });
    } else {
      return chrome.storage.local.get(this.STORAGE_KEY).then((data: StorageData) => {
        return data['rgaachecker-results'] || {};
      });
    }
  }

  private static saveStorageData(data: any): Promise<any> {
    if (typeof browser !== 'undefined' && browser) {
      return browser.storage.local.set({ 'rgaachecker-results': data });
    } else {
      return chrome.storage.local.set({ 'rgaachecker-results': data });
    }
  }

  static getUserData(host: string, url: string): Promise<any> {
    return this.getStorageData().then((data: any) => {
      if(!data[host] || !data[host][url]) {
        return {};
      }

      let userResults = {};
      try {
        userResults = JSON.parse(data[host][url]['user'] || '{}');
      }
      catch (e) {} // in case of invalid JSON

      return userResults;
    });
  }

  static saveUserData(host: string, url: string, topicNumber: number, criteriaNumber: number, status: string): Promise<any> {
    return this.getStorageData().then((data: any) => {
      if(!data[host]) {
        data[host] = {};
      }

      if(!data[host][url]) {
        data[host][url] = {};
      }

      if(!data[host][url]['user']) {
        data[host][url]['user'] = {};
      }

      let userResults: any = {};
      try {
        userResults = JSON.parse(data[host][url]['user']);
      }
      catch (e) {} // in case of invalid JSON

      userResults[`${topicNumber}.${criteriaNumber}`] = status;

      data[host][url]['user'] = JSON.stringify(userResults);

      return this.saveStorageData(data);
    });
  }

  static getRunnerData(host: string, url: string): Promise<any> {
    return this.getStorageData().then((data: any) => {
      if(!data[host] || !data[host][url]) {
        return {};
      }

      let runnerResults = {};
      try {
        runnerResults = JSON.parse(data[host][url]['runner'] || '{}');
      }
      catch (e) {} // in case of invalid JSON

      return runnerResults;
    });
  }

  static saveRunnerData(host: string, url: string, criteriaList: any): Promise<any> {
    return this.getStorageData().then((data: any) => {
      if(!host || !url) {
        return;
      }

      // Save the new results
      let resultList: any = {};
      Object.keys(criteriaList).forEach((key: string) => {
        resultList[key] = criteriaList[key]['status'];
      });

      if(!data[host]) {
        data[host] = {};
      }
      if(!data[host][url]) {
        data[host][url] = {};
      }

      data[host][url]['runner'] = JSON.stringify(resultList);

      this.saveStorageData(data);
    });
  }


  // static async getSynthesis(): StorageData {
  //   let storageData = {}
  //   const storedData = await this.getStorageData('rgaachecker-synthesis') as StorageData;
  //   if (storedData) {
  //     storageData = storedData;
  //   }

  //   return storageData;
  // }
}
