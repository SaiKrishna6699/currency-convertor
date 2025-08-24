import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { SelectDropDownModule } from 'ngx-select-dropdown';



import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CurrencyconvertorComponent } from './currencyconvertor/currencyconvertor.component';
import { NumericOnlyDirective } from './numeric-only.directive';

@NgModule({
  declarations: [
    AppComponent,
    CurrencyconvertorComponent,
    NumericOnlyDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    SelectDropDownModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
