import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {ConfirmationService, MessageService, ConfirmEventType} from 'primeng/api';
import {Restaurant} from '../../../model/restaurant';
import {RestaurantService} from '../../../service/restaurant.service';

@Component({
  selector: 'app-restaurant-detail',
  templateUrl: './restaurant-detail.component.html',
  styleUrls: ['./restaurant-detail.component.css']
})
export class RestaurantDetailComponent implements OnInit {

  editMode = false
  newForm = false
  restaurantLabel = 0

  constructor(private confirmationService: ConfirmationService,
              private messageService: MessageService, private restaurantService: RestaurantService,
              private route: ActivatedRoute, private fb: FormBuilder) {
  }

  restaurantForm = this.fb.group({
    restaurantId: new FormControl('', [Validators.required, Validators.maxLength(30)]),
    restaurantName: new FormControl('', [Validators.required, Validators.maxLength(30)]),
    restaurantLocation: new FormControl('', Validators.required),
    restaurantActive: new FormControl(true)
  });

  formMode = 'update';
  restaurant: Restaurant = {
    restaurantId: '',
    restaurantName: '',
    restaurantLabel: 0,
    restaurantLocation: '',
    restaurantActive: true
  }

  ngOnInit(): void {
    this.route.queryParams
      .subscribe(params => {
        this.restaurantLabel = params.restaurantLabel;
      });
    if (!this.restaurantLabel) {
      this.formMode = 'new'
      this.newForm = true
    } else {
      this.getRestaurantDetail(this.restaurantLabel);
    }
    this.disableEdit()
  }

  disableEdit() {
    this.editMode = false
    this.restaurantForm.disable()
  }

  enableEdit() {
    this.editMode = true
    this.restaurantForm.enable()
  }

  onSubmit(): void {
    if (this.restaurantForm.invalid) {
      return;
    }
    if (this.formMode === 'update') {
      this.updateRestaurant();
    } else {
      this.addRestaurant()
    }
  }

  getRestaurantDetail(restaurantLabel: any ): void {
    this.restaurantService.getRestaurantByLabel(restaurantLabel).subscribe(
      result => {
        this.restaurant = result.payload
        this.restaurantForm.patchValue(this.restaurant)
      }
    );
  }

  updateRestaurant(): void {
    this.restaurant = this.restaurantForm.getRawValue()
    this.restaurant.restaurantLabel = this.restaurantLabel
    this.confirmationService.confirm({
      message: 'Do you want to update this record?',
      header: 'Update Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {

        this.restaurantService.updateRestaurant(this.restaurant)
          .subscribe(result => {
            if (result.status === 'success') {
              this.restaurant = result.payload
              this.messageService.add({severity: 'info', summary: 'Update Success', detail: 'Restaurant updated!'})
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
            this.messageService.add({severity: 'error', summary: 'Rejected', detail: 'You have rejected'});
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({severity: 'warn', summary: 'Cancelled', detail: 'You have cancelled'});
            break;
        }
        this.disableEdit()
      }
    })
  }

  addRestaurant(): void {

    this.restaurant = this.restaurantForm.getRawValue()
    this.confirmationService.confirm({
      message: 'Do you want to add this record?',
      header: 'Update Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.restaurantService.addRestaurant(this.restaurant)
          .subscribe(result => {
            if (result.status === 'success') {
              this.restaurant = result.payload
              this.restaurantLabel = result.payload.restaurantLabel
              console.log(this.restaurant);

              this.messageService.add({severity: 'info', summary: 'Update Success', detail: 'Restaurant added!'})
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
            this.messageService.add({severity: 'error', summary: 'Rejected', detail: 'You have rejected'});
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({severity: 'warn', summary: 'Cancelled', detail: 'You have cancelled'});
            break;
        }
        this.disableEdit()
      }
    })
  }
}
