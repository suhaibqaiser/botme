import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {HelperService} from "../../../services/helper.service";
import {ToastService} from "../../../services/toast.service";
import {Router} from "@angular/router";
import {BotmeClientService} from "../../../services/botme-client.service";

@Component({
  selector: 'app-customer-signup-section',
  templateUrl: './customer-signup-section.component.html',
  styleUrls: ['./customer-signup-section.component.scss']
})
export class CustomerSignupSectionComponent implements OnInit {

  signupForm = new FormGroup({
    clientActive: new FormControl(false, [Validators.required]),
    clientComment: new FormControl('restaurant ui', [Validators.required]),
    clientCreated: new FormControl(new Date(), Validators.required),
    clientDebug: new FormControl(false, Validators.required),
    clientDeviceId: new FormControl(''),
    clientType: new FormControl('customer'),
    clientID: new FormControl('', Validators.required),
    clientName: new FormControl('', Validators.required),
    clientSecret: new FormControl('', Validators.required),
    confirmClientSecret: new FormControl('', Validators.required),
    clientUpdated: new FormControl(new Date(), Validators.required),
    clientVoiceEnabled: new FormControl(false, Validators.required),
    clientVoiceTimeout: new FormControl(3000, Validators.required),
    restaurantId: new FormControl('', Validators.required),
    clientEmail: new FormControl('', [Validators.required, this._helperService.checkEmailRegex]),
    confirmClientEmail: new FormControl('', [Validators.required, this._helperService.checkEmailRegex]),
    clientSecretHint: new FormControl('', Validators.required)
  })
  loader: Boolean = false

  constructor(private _botMeClientService: BotmeClientService, private router: Router, private _toastService: ToastService, public _helperService: HelperService) {

  }

  ngOnInit(): void {
  }

  signUp() {
    this.signupForm.get('restaurantId')?.setValue(this._helperService.getRestaurantIdOnAuthBasis())
    if (!this.signupForm.controls['clientName'].value) {
      this._toastService.setToast({
        description: 'Client name is required!',
        type: 'danger'
      })
      return
    }

    if (!this.signupForm.controls['clientID'].value) {
      this._toastService.setToast({
        description: 'Client id is required!',
        type: 'danger'
      })
      return
    }

    if (!this.signupForm.controls['clientSecret'].value) {
      this._toastService.setToast({
        description: 'Client secret is required!',
        type: 'danger'
      })
      return
    }

    if (!this.signupForm.controls['clientEmail'].value) {
      this._toastService.setToast({
        description: 'Client email is required!',
        type: 'danger'
      })
      return
    }

    if (!this.signupForm.controls['clientSecretHint'].value) {
      this._toastService.setToast({
        description: 'Client secret hint is required!',
        type: 'danger'
      })
      return
    }

    if (this.signupForm.controls['clientName'].value && this.signupForm.controls['clientName'].value.length < 3) {
      this._toastService.setToast({
        description: 'Client name should be greater than 3.',
        type: 'danger'
      })
      return
    }

    if (this.signupForm.controls['clientID'].value && this.signupForm.controls['clientID'].value.length < 3) {
      this._toastService.setToast({
        description: 'Client id should be greater than 3.',
        type: 'danger'
      })
      return
    }

    if (this.signupForm.controls['clientDeviceId'].value && this.signupForm.controls['clientDeviceId'].value.length < 3) {
      this._toastService.setToast({
        description: 'Client device id is required!',
        type: 'danger'
      })
      return
    }

    if (this.signupForm.controls['clientSecret'].value && this.signupForm.controls['clientSecret'].value.length < 3) {
      this._toastService.setToast({
        description: 'Client should be greater than 3.',
        type: 'danger'
      })
      return
    }

    if (this.signupForm.controls['clientSecretHint'].value && this.signupForm.controls['clientSecretHint'].value.length < 3) {
      this._toastService.setToast({
        description: 'Client should be greater than 3.',
        type: 'danger'
      })
      return
    }

    const emailRegex = new RegExp('^(([^<>()[\\]\\\\.,;:\\s@"]+(\\.[^<>()[\\]\\\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$');
    if ((this.signupForm.controls['confirmClientEmail'].value && !emailRegex.test(this.signupForm.controls['confirmClientEmail'].value)) || (this.signupForm.controls['confirmClientEmail'].value && !emailRegex.test(this.signupForm.controls['confirmClientEmail'].value))) {
      this._toastService.setToast({
        description: 'Please enter valid email xyz@gmail.com',
        type: 'danger'
      })
      return
    }

    if (this.signupForm.controls['clientSecret'].value !== this.signupForm.controls['confirmClientSecret'].value) {
      this._toastService.setToast({
        description: 'Your confirm client secret mismatched.',
        type: 'danger'
      })
      return
    }

    if (this.signupForm.controls['clientEmail'].value !== this.signupForm.controls['confirmClientEmail'].value) {
      this._toastService.setToast({
        description: 'Your confirm client email mismatched.',
        type: 'danger'
      })
      return
    }

    this.loader = true

    this._botMeClientService.signupBotMeClientApi(this.signupForm.value).subscribe(
      (res: any) => {
        this._toastService.setToast({
          description: res.message,
          type: res.status
        })
        setTimeout(() => {
          if (res.status === 'success') {
            this._helperService.navigateTo('customer-login')
          }
        }, 1000)

        this.loader = false
      })
  }
}
