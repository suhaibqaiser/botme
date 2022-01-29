import {Component, OnInit} from '@angular/core';
import {CartService} from "../../../services/cart.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ToastService} from "../../../services/toast.service";
import {CustomerService} from "../../../services/customer.service";
import {BotmeClientService} from "../../../services/botme-client.service";

declare var $: any;

@Component({
  selector: 'app-checkout-section',
  templateUrl: './checkout-section.component.html',
  styleUrls: ['./checkout-section.component.scss']
})
export class CheckoutSectionComponent implements OnInit {

  loader = false
  customerForm = new FormGroup({
    restaurantId: new FormControl('', Validators.required),
    customerId: new FormControl(''),
    customerLabel: new FormControl(''),
    customerName: new FormControl('', Validators.required),
    customerEmail: new FormControl('', Validators.required),
    customerCountry: new FormControl('', Validators.required),
    customerTown: new FormControl('', Validators.required),
    customerState: new FormControl('', Validators.required),
    customerAddress: new FormControl('', Validators.required),
    orderNotes: new FormControl('', Validators.required),
    customerPhone: new FormControl('', Validators.required),
    customerActive: new FormControl(true, Validators.required),
    customerStreet: new FormControl('', Validators.required)
  })

  constructor(private _clientService: BotmeClientService, private _toastService: ToastService, private _customerService: CustomerService, public _cartService: CartService) {
    this.customerForm.controls['restaurantId'].setValue(this._clientService.getCookie().restaurantId)
    if (this._clientService.getCookie().customerId && this._clientService.getCookie().customerId.length) {
      this.getCustomer()
    }

  }

  ngOnInit(): void {

  }

  addCustomer() {
    this.loader = true
    let customerId = this.customerForm.controls['customerId'].value

    if (!customerId && !customerId.length) {
      this._customerService.addCustomer(this.customerForm.value).subscribe((res: any) => {
        this._toastService.setToast({
          description: res.message,
          type: res.status
        })
        if (res.status === 'success') {
          this._clientService.setCookie('customerId', res.payload.customerId)
          $('#checkout_modal').modal('show')
        }
        this.loader = false
      })
      return
    }

    this._customerService.updateCustomer(this.customerForm.value).subscribe((res: any) => {
      this._toastService.setToast({
        description: res.message,
        type: res.status
      })
      this.loader = false
    })
  }

  getCustomer() {
    this._customerService.getCustomer().subscribe((res: any) => {
      this._toastService.setToast({
        description: res.message,
        type: res.status
      })
      if (res.status === 'success') {
        this._clientService.setCookie('customerId', res.payload.customerId)
        this.populateCustomer(res.payload)
      }
    })
  }

  populateCustomer(obj: any) {
    this.customerForm.controls['restaurantId'].setValue(this._clientService.getCookie().restaurantId)
    this.customerForm.controls['customerId'].setValue(obj.customerId)
    this.customerForm.controls['customerLabel'].setValue(obj.customerLabel)
    this.customerForm.controls['customerName'].setValue(obj.customerName)
    this.customerForm.controls['customerEmail'].setValue(obj.customerEmail)
    this.customerForm.controls['customerCountry'].setValue(obj.customerCountry)
    this.customerForm.controls['customerTown'].setValue(obj.customerTown)
    this.customerForm.controls['customerState'].setValue(obj.customerState)
    this.customerForm.controls['customerAddress'].setValue(obj.customerAddress)
    this.customerForm.controls['orderNotes'].setValue(obj.orderNotes)
    this.customerForm.controls['customerActive'].setValue(obj.customerActive)
    this.customerForm.controls['customerPhone'].setValue(obj.customerPhone)
    this.customerForm.controls['customerStreet'].setValue(obj.customerStreet)
  }

  getOrderType() {
    let id = ''

    if (!this._clientService.getCookie().orderType) {
      return ''
    }

    if (this._clientService.getCookie().orderType && this._clientService.getCookie().orderType === 'dine_in') {
      id = this._clientService.getCookie().reservationLabel ? this._clientService.getCookie().reservationLabel : ''
    } else if (this._clientService.getCookie().orderType) {
      id = this._clientService.getCookie().orderLabel ? this._clientService.getCookie().orderLabel : ''
    }

    return this._clientService.getCookie().orderType.replace(/_/g, " ") + ' id' + ' : ' + id
  }


}
