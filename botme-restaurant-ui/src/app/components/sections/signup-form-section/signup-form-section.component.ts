import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {HelperService} from "../../../services/helper.service";
import {ToastService} from "../../../services/toast.service";
import {BotmeClientService} from "../../../services/botme-client.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-signup-form-section',
  templateUrl: './signup-form-section.component.html',
  styleUrls: ['./signup-form-section.component.scss']
})
export class SignupFormSectionComponent implements OnInit {

  signupForm = new FormGroup({
    clientActive: new FormControl(false, [Validators.required]),
    clientComment: new FormControl('restaurant ui', [Validators.required]),
    clientCreated: new FormControl(new Date(), Validators.required),
    clientDebug: new FormControl(false, Validators.required),
    clientDeviceId: new FormControl('', Validators.required),
    clientID: new FormControl('', Validators.required),
    clientName: new FormControl('', Validators.required),
    clientSecret: new FormControl('', Validators.required),
    clientUpdated: new FormControl(new Date(), Validators.required),
    clientVoiceEnabled: new FormControl(false, Validators.required),
    clientVoiceTimeout: new FormControl(3000, Validators.required),
    restaurantId: new FormControl('', Validators.required),
    clientEmail: new FormControl('', [Validators.required,this._helperService.checkEmailRegex]),
    clientSecretHint: new FormControl('', Validators.required)
  })

  loader: Boolean = false

  constructor(private router: Router, private _botMeClientService: BotmeClientService, public _helperService: HelperService, private _toastService: ToastService) {
    this.signupForm.get('restaurantId')?.setValue(this._helperService.getRestaurantIdOnAuthBasis())
  }

  ngOnInit(): void {
  }

  signUp() {

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

    if (!this.signupForm.controls['clientDeviceId'].value) {
      this._toastService.setToast({
        description: 'Client device id is required!',
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

    if (this.signupForm.controls['clientID'].value  && this.signupForm.controls['clientID'].value.length < 3) {
      this._toastService.setToast({
        description: 'Client id should be greater than 3.',
        type: 'danger'
      })
      return
    }

    if (this.signupForm.controls['clientDeviceId'].value  && this.signupForm.controls['clientDeviceId'].value.length < 3) {
      this._toastService.setToast({
        description: 'Client device id is required!',
        type: 'danger'
      })
      return
    }

    if (this.signupForm.controls['clientSecret'].value  && this.signupForm.controls['clientSecret'].value.length < 3) {
      this._toastService.setToast({
        description: 'Client should be greater than 3.',
        type: 'danger'
      })
      return
    }

    if (this.signupForm.controls['clientSecretHint'].value  && this.signupForm.controls['clientSecretHint'].value.length < 3) {
      this._toastService.setToast({
        description: 'Client should be greater than 3.',
        type: 'danger'
      })
      return
    }

    const emailRegex = new RegExp('^(([^<>()[\\]\\\\.,;:\\s@"]+(\\.[^<>()[\\]\\\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$');
    if (this.signupForm.controls['clientEmail'].value  && !emailRegex.test(this.signupForm.controls['clientEmail'].value)) {
      this._toastService.setToast({
        description: 'Please enter valid email xyz@gmail.com',
        type: 'danger'
      })
      return
    }

    this.loader = true

    this._botMeClientService.signupBotMeClientApi(this.signupForm.value).subscribe(
      (res: any) => {
        this._toastService.setToast({
          description: res.statusMessage,
          type: res.status
        })
        if (res.status === 'success') {
          this.router.navigate(['/login']).then(() => {
            window.location.reload();
          });
        }
        this.loader = false
      })
  }

}
