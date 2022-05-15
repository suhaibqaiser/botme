import {Injectable} from '@angular/core';
import {HelperService} from "./helper.service";

@Injectable({
  providedIn: 'root'
})
export class ContextService {

  // lists of context which we are sending to server to get response against current context
  currentContextList = [
    {
      currentRoute: '/online-shop',
      pageId: 'pageId-order-online',
      sectionId: 'sectionId-product-list'
    },
    {
      currentRoute: '/product-detail',
      pageId: 'pageId-product-detial-page',
      sectionId: 'sectionId-product-detial-page'
    },
    {
      currentRoute: '/home',
      pageId: 'pageId-home',
      sectionId: 'sectionId-product-list'
    },
    {
      currentRoute: '/cart',
      pageId: 'pageId-cart',
      sectionId: 'sectionId-product-list'
    },
    {
      currentRoute: '/reservations',
      pageId: 'pageId-reservation',
      sectionId: 'sectionId-reservation-form'
    },
    {
      currentRoute: '/contact-us',
      pageId: 'pageId-contact-us',
      sectionId: 'sectionId-message-form'
    },
    {
      currentRoute: '/product-suggestions',
      pageId: 'pageId-product-suggestions',
      sectionId: 'sectionId-product-suggestions'
    }
  ]

  // finding the context from 'currentContextList' then populating it.
  currentContextObj = {
    currentRoute: '',
    pageId: '',
    sectionId: ''
  }

  constructor(public _helperService: HelperService) {
  }

  /**
   * getting the current context on the bases of 'productId' from server side or current route.
   * @param serverPageId
   */
  getCurrentContext(serverPageId = '') {
    let currentRoute = this._helperService.getCurrentRouteName()
    if (currentRoute.indexOf('?') > 0) {
      currentRoute = currentRoute.substr(0, currentRoute.indexOf('?'))
    }
    this.currentContextList.filter((item: any) => {
      if (item.currentRoute === currentRoute) {
        this.currentContextObj = JSON.parse(JSON.stringify(item))
      }
    })
  }

  /**
   * getting the route name from server page id
   * @param serverPageId
   */
  getPageRoute(serverPageId = '') {
    return this.currentContextList.find((item: any) =>
       (item.pageId === serverPageId) ? item.currentRoute : null)
  }
}
