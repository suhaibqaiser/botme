import {Component, OnInit} from '@angular/core';
import {ProductSuggestionService} from "../../../services/product-suggestion.service";
import {MenuService} from "../../../services/menu.service";
import {HelperService} from "../../../services/helper.service";
import {FormControl} from "@angular/forms";
import {SocketService} from "../../../services/socket.service";
import {BotmeClientService} from "../../../services/botme-client.service";
import {ToastService} from "../../../services/toast.service";

@Component({
  selector: 'app-sugestion-section',
  templateUrl: './sugestion-section.component.html',
  styleUrls: ['./sugestion-section.component.scss']
})
export class SugestionSectionComponent implements OnInit {

  suggestionControl = new FormControl('')

  constructor(private _toastService: ToastService, public _clientService: BotmeClientService, private _socketService: SocketService, public _productSuggestionService: ProductSuggestionService, private menuservice: MenuService, public _helperService: HelperService) {
  }


  async ngOnInit() {
    this.getProducts()
  }

  async getProducts() {
    this._productSuggestionService.loader = true
    this.menuservice.getProducts()
      .subscribe(result => {
        this._productSuggestionService.products = result.payload
        this._productSuggestionService.loader = false
      });
  }

  sendSuggestion() {
    console.log(this.suggestionControl.value)
    if (!this.suggestionControl.value) {
      this._toastService.setToast({
        description: 'Suggestion is required.',
        type: 'danger'
      })
      return
    }
    this._productSuggestionService.suggestedProductList = []
    const isVoiceToggleOn = (this._clientService.getCookie() && this._clientService.getCookie().isVoiceToggleOn === 'false') ? false : true
    if (!isVoiceToggleOn) {
      this._productSuggestionService.loader = true
      this._socketService.sendMessage('communication', this.suggestionControl.value)
    }
  }

  isVoiceToggleOn() {
    return (this._clientService.getCookie() && this._clientService.getCookie().isVoiceToggleOn === 'false') ? false : true
  }
}
