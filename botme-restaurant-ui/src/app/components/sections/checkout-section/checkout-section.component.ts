import {Component, OnInit} from '@angular/core';
import {CartService} from "../../../services/cart.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ToastService} from "../../../services/toast.service";
import {CustomerService} from "../../../services/customer.service";
import {BotmeClientService} from "../../../services/botme-client.service";
import {HelperService} from "../../../services/helper.service";
import {Router} from "@angular/router";
import {MenuService} from "../../../services/menu.service";

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

    reservationSeats: new FormControl(''),
    reservationDate: new FormControl(''),
    reservationTime: new FormControl(''),

    customerEmail: new FormControl('', Validators.required),
    customerCountry: new FormControl('', Validators.required),
    customerCity: new FormControl('', Validators.required),
    customerPostalCode: new FormControl('', Validators.required),
    customerState: new FormControl('', Validators.required),
    customerAddress: new FormControl('', Validators.required),
    orderNotes: new FormControl('', Validators.required),
    customerPhone: new FormControl('', Validators.required),
    customerActive: new FormControl(true, Validators.required),
    customerStreet: new FormControl('', Validators.required)
  })

  countryList: any = [
    'Saint Kitts And Nevis',
    'Dominica',
    'Antigua And Barbuda',
    'Saint Vincent And the Grenadines',
    'Grenada',
    'Saint Lucia',
    'Barbados',
    'Bahamas',
    'Belize',
    'Trinidad And Tobago',
    'Jamaica',
    'Panama',
    'Costa Rica',
    'El Salvador',
    'Honduras',
    'Dominican Republic'
  ]

  stateList: any = [
    'Alaska',
    'Alabama',
    'Arizona',
    'Arkansas',
    'California',
    'Colorado',
    'Connecticut',
    'Delaware',
    'District of Columbia',
    'Florida',
    'Georgia',
    'Guam',
    'Hawaii',
    'Idaho',
    'Illinois',
    'Indiana',
    'Iowa',
    'Kansas',
    'Kentucky',
    'Louisiana',
    'Marshall Islands',
    'Maryland',
    'Massachusetts',
    'Michigan',
    'Minnesota',
    'Mississippi',
    'Missouri',
    'Montana',
    'Nebraska',
    'Nevada',
    'New Hampshire',
    'New Jersey',
    'New Mexico',
    'New York',
    'North Carolina',
    'North Dakota',
    'Ohio',
    'Oklahoma',
    'Oregon',
    'Palau',
    'Pennsylvania',
    'Puerto Rico',
    'Rhode Island',
    'South Carolina',
    'South Dakota',
    'Tennessee',
  ]

  constructor(private _menuService: MenuService, private _router: Router, public _helperService: HelperService, public _clientService: BotmeClientService, private _toastService: ToastService, private _customerService: CustomerService, public _cartService: CartService) {
    this.customerForm.controls['restaurantId'].setValue(this._helperService.getRestaurantIdOnAuthBasis())
    if (this._clientService.getCookie().customerId && this._clientService.getCookie().customerId.length) {
      this.getCustomer()
    }

  }

  ngOnInit(): void {

  }

  async addCustomer() {
    if (this._clientService.getCookie().orderType === 'dine_in') {
      if (this.customerForm.controls['reservationSeats'].value <= 0) {
        this._toastService.setToast({
          description: 'Minimum one seat is required!',
          type: 'danger'
        })
        return;
      }

      const date = this.customerForm.controls['reservationDate'].value
      if (!date) {
        this._toastService.setToast({
          description: 'Date is required!',
          type: 'danger'
        })
        return;
      }

      const time = this.customerForm.controls['reservationTime'].value
      if (!time) {
        this._toastService.setToast({
          description: 'Time is required!',
          type: 'danger'
        })
        return;
      }

      const reservationTimeCheck = new RegExp('^(0?[1-9]|1[0-2]):([0-5]\\d)\\s?((?:[Aa]|[Pp])\\.?[Mm]\\.?)$');
      if (!reservationTimeCheck.test(time)) {
        this._toastService.setToast({
          description: 'Please enter valid time!',
          type: 'danger'
        })
        return;
      }
    }

    this.loader = true
    let customerId = this.customerForm.controls['customerId'].value
    if (!customerId && !customerId.length) {
      await this._customerService.addCustomer(this.customerForm.value).subscribe((res: any) => {
        this._toastService.setToast({
          description: res.message,
          type: res.status
        })
        if (res.status === 'success') {
          this._clientService.setCookie('customerId', res.payload.customerId)
          $('#checkout_modal').modal('show')
          // this._cartService.addToCart(this._cartService.cartProduct, 'add_db')
          setTimeout(async () => {

           await this._menuService.updateOrderStatus(this._helperService.getOrderStatus('notified')).subscribe((res: any) => {
              this._toastService.setToast({
                description: res.message,
                type: res.status
              })
            })

            let obj = {
              customerName: res.payload.customerName,
              orderId: this._clientService.getCookie().orderLabel,
              total: this._cartService.getSubTotal(),
              orderType: this._clientService.getCookie().orderType
            }
           await this._menuService.pushNotification(obj).subscribe((res: any) => {
              console.log('notification pushed =>', res)
            })
          }, 2000)
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
      // this._cartService.addToCart(this._cartService.cartProduct, 'edit_db')
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
    this.customerForm.controls['restaurantId'].setValue(this._helperService.getRestaurantIdOnAuthBasis())
    this.customerForm.controls['customerId'].setValue(obj.customerId)
    this.customerForm.controls['customerLabel'].setValue(obj.customerLabel)
    this.customerForm.controls['customerName'].setValue(obj.customerName)
    this.customerForm.controls['customerEmail'].setValue(obj.customerEmail)
    this.customerForm.controls['customerCountry'].setValue(obj.customerCountry)
    this.customerForm.controls['customerCity'].setValue(obj.customerCity)
    this.customerForm.controls['customerPostalCode'].setValue(obj.customerPostalCode)
    this.customerForm.controls['customerState'].setValue(obj.customerState)
    this.customerForm.controls['customerAddress'].setValue(obj.customerAddress)
    this.customerForm.controls['orderNotes'].setValue(obj.orderNotes)
    this.customerForm.controls['customerActive'].setValue(obj.customerActive)
    this.customerForm.controls['customerPhone'].setValue(obj.customerPhone)
    this.customerForm.controls['customerStreet'].setValue(obj.customerStreet)
    this.customerForm.controls['reservationSeats'].setValue(obj.reservationSeats)
    this.customerForm.controls['reservationDate'].setValue(obj.reservationDate)
    this.customerForm.controls['reservationTime'].setValue(obj.reservationTime)
  }

  getOrderType() {
    let id = ''

    if (!this._helperService.getOrderTypeOnAuthBasis()) {
      return ''
    }

    // if (this._helperService.getOrderTypeOnAuthBasis() && this._helperService.getOrderTypeOnAuthBasis() === 'dine_in') {
    //   id = this._clientService.getCookie().reservationLabel ? this._clientService.getCookie().reservationLabel : ''
    // } else if (this._helperService.getOrderTypeOnAuthBasis()) {
    id = this._clientService.getCookie().orderLabel ? this._clientService.getCookie().orderLabel : ''
    // }

    return this._helperService.getOrderTypeOnAuthBasis().replace(/_/g, " ") + ' id' + ' : ' + id
  }

  close() {
    this._clientService.getCookie().orderType = ""
    this._clientService.getCookie().orderLabel = ""
    localStorage.clear()
    $('#checkout_modal').modal('hide')
    this._router.navigate(['/home'])
  }

}
