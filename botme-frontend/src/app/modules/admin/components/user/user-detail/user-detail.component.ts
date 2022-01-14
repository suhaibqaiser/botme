import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationService, MessageService, ConfirmEventType } from 'primeng/api';
import { Md5 } from 'ts-md5';
import { User } from '../../../model/user';
import { UserService } from '../../../service/user.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {


  editMode = false
  newForm = false
  formMode = 'update';

  constructor(private confirmationService: ConfirmationService,
    private messageService: MessageService, private userService: UserService,
    private route: ActivatedRoute, private fb: FormBuilder) {
  }

  userForm = this.fb.group({
    userId: new FormControl('', [Validators.required, Validators.maxLength(30)]),
    userName: new FormControl('', [Validators.required, Validators.maxLength(60)]),
    userSecret: new FormControl('', [Validators.required, Validators.maxLength(120)]),
    userFullName: new FormControl(''),
    userEmail: new FormControl(''),
    userToken: new FormControl(''),
    userCreated: new FormControl(''),
    userUpdated: new FormControl(''),
    userActive: new FormControl(true),
    userComment: new FormControl(''),
    restaurantId: new FormControl([Validators.required, Validators.maxLength(120)]),
  });

  userId = '';
  user: User = {
    userId: '',
    userName: '',
    userSecret: '',
    userFullName: '',
    userEmail: '',
    userToken: '',
    userCreated: new Date(),
    userUpdated: null,
    userActive: true,
    userComment: '',
    restaurantId: ''
  }
  restaurantList = new Array

  ngOnInit(): void {
    this.route.queryParams
      .subscribe(params => {
        this.userId = params.userId;
      });
    if (!this.userId) {
      this.formMode = 'new'
      this.newForm = true
      this.enableEdit()
    } else {
      this.getUserDetails(this.userId);
    }
    this.disableEdit()

    this.userService.getRestaurants().subscribe(res => {
      this.restaurantList = res.payload
    })
  }

  disableEdit() {
    this.editMode = false
    this.userForm.disable()
  }

  enableEdit() {
    this.editMode = true
    this.userForm.enable()
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.messageService.add({ severity: 'error', summary: 'Validation Error', detail: 'Please fill all the required fields' })
    }
    if (this.formMode === 'update') {
      this.updateUser();
    } else {
      this.adduser()
    }
  }

  getUserDetails(userId: string): void {
    this.userService.getUserDetails(userId).subscribe(
      result => {
        this.user = result.payload
        this.userForm.patchValue(this.user)
      }
    );
  }

  updateUser(): void {
    this.user = this.userForm.getRawValue()
    this.user.userId = this.userId
    this.user.userSecret = Md5.hashStr(this.user.userSecret);
    this.confirmationService.confirm({
      message: 'Do you want to update this record?',
      header: 'Update Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {

        this.userService.updateUser(this.user)
          .subscribe(result => {
            if (result.status === 'success') {
              this.user = result.payload
              this.messageService.add({ severity: 'info', summary: 'Update Success', detail: 'User updated!' })
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Update Failed',
                detail: `Reason: ${result.payload}`
              })
            }
            this.disableEdit()
          });
      },
      reject: (type: any) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({ severity: 'warn', summary: 'Cancelled', detail: 'You have cancelled' });
            break;
        }
        this.disableEdit()
      }
    })
  }

  adduser(): void {

    this.user = this.userForm.getRawValue()
    this.confirmationService.confirm({
      message: 'Do you want to add this record?',
      header: 'Update Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.userService.addUser(this.user)
          .subscribe(result => {
            if (result.status === 'success') {
              this.user = result.payload
              this.userId = result.payload.userId
              this.messageService.add({ severity: 'info', summary: 'Update Success', detail: 'User added!' })
              this.formMode = 'update'
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Add Failed',
                detail: `Reason: ${result.payload}`
              })
            }
            this.disableEdit()
          })
      },
      reject: (type: any) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({ severity: 'warn', summary: 'Cancelled', detail: 'You have cancelled' });
            break;
        }
        this.disableEdit()
      }
    })
  }

}
