import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  robotsToggleObj: any
  restaurantToggleObj: any
  dictionaryToggleObj: any

  constructor() {
  }

  ngOnInit(): void {
    this.robotsToggleObj = {
      key: 'robots',
      check: false,
      addClass: ''
    }
    this.restaurantToggleObj = {
      key: 'restaurant',
      check: false,
      addClass: ''
    }
    this.dictionaryToggleObj = {
      key: 'dictionary',
      check: false,
      addClass: ''
    }
  }

  robotsDropdownToggle() {
    this.robotsToggleObj.check = !this.robotsToggleObj.check
    this.robotsToggleObj.addClass = this.robotsToggleObj.check ? 'open' : ''
    this.closeOtherDropdowns(this.robotsToggleObj)
  }

  restaurantDropdownToggle() {
    this.restaurantToggleObj.check = !this.restaurantToggleObj.check
    this.restaurantToggleObj.addClass = this.restaurantToggleObj.check ? 'open' : ''
    this.closeOtherDropdowns(this.restaurantToggleObj)
  }

  dictionaryDropdownToggle() {
    this.dictionaryToggleObj.check = !this.dictionaryToggleObj.check
    this.dictionaryToggleObj.addClass = this.dictionaryToggleObj.check ? 'open' : ''
    this.closeOtherDropdowns(this.dictionaryToggleObj)
  }

  closeOtherDropdowns(obj: any) {
    if (obj.key == 'robots') {
      this.restaurantToggleObj = {key: 'restaurant',check: false, addClass: ''}
      this.dictionaryToggleObj = {key: 'dictionary',check: false, addClass: ''}
    } else
    if (obj.key == 'restaurant') {
      this.robotsToggleObj = {key: 'robots',check: false, addClass: ''}
      this.dictionaryToggleObj = {key: 'dictionary',check: false, addClass: ''}
    } else
    if (obj.key == 'dictionary') {
      this.robotsToggleObj = {key: 'robots',check: false, addClass: ''}
      this.restaurantToggleObj = {key: 'restaurant',check: false, addClass: ''}
    }
  }
}
