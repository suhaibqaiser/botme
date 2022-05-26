import { Component, OnInit } from '@angular/core';
import { SignupService } from '../../services/signup.service';
import { ConfirmationService, MessageService, ConfirmEventType } from 'primeng/api';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Signup } from '../../model/signup';
import { Md5 } from 'ts-md5';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  formMode = 'update';

  constructor(private confirmationService: ConfirmationService,
    private messageService: MessageService,private userService: SignupService,
    private route: ActivatedRoute, private fb: FormBuilder) {
  }

  userForm = this.fb.group({
    userId: new FormControl(''),
    userName: new FormControl('', [Validators.required, Validators.maxLength(60)]),
    userSecret: new FormControl('', [Validators.required, Validators.maxLength(120)]),
    userFullName: new FormControl(''),
    userEmail: new FormControl(''),
    userCreated: new FormControl(''),
    restaurantId: new FormControl('', [Validators.required, Validators.maxLength(120)]),
  });

  userId = '';
  user: Signup = {
    userId: '',
    userName: '',
    userSecret: '',
    userFullName: '',
    userEmail: '',
    userToken: '',
    userCreated: new Date(),
    restaurantId: ''
  }

  ngOnInit(): void {
    this.route.queryParams
    .subscribe(params => {
      this.userId = params.userId;
    });
  }



}
