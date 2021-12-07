import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class CtaService {

    callToAction(ctaId: string) {
        let cta = document.getElementById(ctaId)
        if (cta) {
            let btn: HTMLElement = cta.getElementsByTagName('a')[0] as HTMLElement;
            btn.click();
        }
    }

    searchProduct(searchText: string) {
        (<HTMLInputElement>document.getElementById('productSearch')).value = searchText;
        let ev = new Event('input');
        (<HTMLInputElement>document.getElementById('productSearch')).dispatchEvent(ev);
        document.getElementsByClassName("header-page-shape-item")[0].scrollIntoView();
    }
}