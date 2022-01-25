import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  type: any = {
    'warning': 'warning',
    'info': 'info',
    'danger': 'danger',
    'success': 'success'
  }

  toastBGColor: any = {
    'warning': 'bg-warning',
    'info': 'bg-info',
    'danger': 'bg-danger',
    'success': 'bg-success'
  }

  toastTextColor: any = {
    'warning': 'text-black',
    'info': 'text-black',
    'danger': 'text-white',
    'success': 'text-white',
  }

  toastObj = {
    type: '',
    description: '',
    bgColor: '',
    textColor: ''
  }

  constructor() {
    this.setToast()
  }

  /**
   * Setting the toast obj
   */
  setToast(obj: any = {}) {
    this.toastObj = {
      type: (obj && obj.type && this.type[obj.type].length) ? this.type[obj.type] : this.type['info'],
      description: (obj && obj.description) ? obj.description : 'No description',
      bgColor: this.toastBGColor[(this.type[obj.type] && this.type[obj.type].length) ? this.type[obj.type] : 'info'],
      textColor: this.toastTextColor[(this.type[obj.type] && this.type[obj.type].length) ? this.type[obj.type] : 'black']
    }
  }

  getToast() {
    return this.toastObj
  }
}
