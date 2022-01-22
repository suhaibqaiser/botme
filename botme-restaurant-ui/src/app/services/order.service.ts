import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  selectedOrderButtons = {
    'dine_in': false,
    'pick_up': false,
    'delivery': false
  }
  constructor() { }


}
