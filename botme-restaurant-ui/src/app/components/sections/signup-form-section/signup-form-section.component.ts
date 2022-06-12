import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {HelperService} from "../../../services/helper.service";
import {ToastService} from "../../../services/toast.service";
import {BotmeClientService} from "../../../services/botme-client.service";
import {Router} from "@angular/router";
import {debounceTime, tap, switchMap, finalize} from 'rxjs/operators';

@Component({
  selector: 'app-signup-form-section',
  templateUrl: './signup-form-section.component.html',
  styleUrls: ['./signup-form-section.component.scss']
})
export class SignupFormSectionComponent implements OnInit {

  signupForm = new FormGroup({
    deviceName: new FormControl('', Validators.required),
    clientID: new FormControl('', Validators.required),
    clientType: new FormControl('device'),
    clientSecretHint: new FormControl('', Validators.required),
    deviceEmail: new FormControl('', [Validators.required, this._helperService.checkEmailRegex]),
    confirmDeviceEmail: new FormControl('', [Validators.required, this._helperService.checkEmailRegex]),
    clientSecret: new FormControl('', Validators.required),
    confirmClientSecret: new FormControl('', Validators.required),
    restaurantId: new FormControl('', Validators.required)
  })

  loader: Boolean = false
  checkDeviceIdLoader: Boolean = false
  isDeviceVerified: Boolean = false

  constructor(private router: Router, private _botMeClientService: BotmeClientService, public _helperService: HelperService, private _toastService: ToastService) {
    this.signupForm.get('restaurantId')?.setValue(this._helperService.getRestaurantIdOnAuthBasis())
  }

  ngOnInit(): void {
    this.checkDeviceId()
  }

  signUp() {

    if (!this.signupForm.controls['deviceName'].value) {
      this._toastService.setToast({
        description: 'Device name is required!',
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

    if (!this.signupForm.controls['clientSecretHint'].value) {
      this._toastService.setToast({
        description: 'Client secret hint is required!',
        type: 'danger'
      })
      return
    }

    if (!this.signupForm.controls['deviceEmail'].value) {
      this._toastService.setToast({
        description: 'Device email is required!',
        type: 'danger'
      })
      return
    }

    if (!this.signupForm.controls['confirmDeviceEmail'].value) {
      this._toastService.setToast({
        description: 'Confirm device email is required!',
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

    if (this.signupForm.controls['deviceName'].value && this.signupForm.controls['deviceName'].value.length < 3) {
      this._toastService.setToast({
        description: 'Device name should be greater than 3.',
        type: 'danger'
      })
      return
    }


    const emailRegex = new RegExp('^(([^<>()[\\]\\\\.,;:\\s@"]+(\\.[^<>()[\\]\\\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$');
    if ((this.signupForm.controls['confirmDeviceEmail'].value && !emailRegex.test(this.signupForm.controls['confirmDeviceEmail'].value)) || (this.signupForm.controls['confirmDeviceEmail'].value && !emailRegex.test(this.signupForm.controls['confirmDeviceEmail'].value))) {
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

    if (this.signupForm.controls['deviceEmail'].value !== this.signupForm.controls['confirmDeviceEmail'].value) {
      this._toastService.setToast({
        description: 'Your confirm client email mismatched.',
        type: 'danger'
      })
      return
    }

    if (!this.isDeviceVerified) {
      this._toastService.setToast({
        description: 'Oops your device id is ot verified.',
        type: 'danger'
      })
      return;
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
            this.router.navigate(['/login']).then(() => {
              window.location.reload();
            });
          }
        }, 1000)

        this.loader = false
      })
  }

  checkDeviceId() {
    this.signupForm.get('clientDeviceId')?.valueChanges
      .pipe(
        debounceTime(500),
        tap(() => {
          this.checkDeviceIdLoader = true
        }),
        switchMap(value => this._botMeClientService.getDeviceById(value)
          .pipe(
            finalize(() => {
              this.checkDeviceIdLoader = false
            })
          )
        )
      ).subscribe(
      (res => {
        this._toastService.setToast({
          description: res.message,
          type: res.status
        })
        this.isDeviceVerified = res.status === 'success'
      })
    )
  }

}
