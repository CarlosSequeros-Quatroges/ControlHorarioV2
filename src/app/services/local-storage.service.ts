import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private isLocalStorageAvailable: boolean;
  constructor() {
    this.isLocalStorageAvailable = typeof localStorage !== 'undefined';
    console.log('LocalStorageService is ready: '+this.isLocalStorageAvailable);
  }
  // Set item in local storage
  setItem(key: string, value: any): void {
    try {
      if (this.isLocalStorageAvailable) {
        const jsonValue = JSON.stringify(value);
        localStorage.setItem(key, jsonValue);
        } else {
        console.error('localStorage is not available.');
      }
      } catch (error) {
      console.error('Error saving to local storage', error);
    }

  }
  // Get item from local storage
  getItem<T>(key: string): T | null {
    try {
      if (this.isLocalStorageAvailable) {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : null;
        } else {
        console.error('localStorage is not available.');
        return null;
      }

    } catch (error) {
      console.error('Error reading from local storage', error);
      return null;
    }
  }
  // Remove item from local storage
  removeItem(key: string): void {
    localStorage.removeItem(key);
  }
  // Clear all local storage
  clear(): void {
    localStorage.clear();
  }
}
