import { Component, Input, OnInit } from '@angular/core';
import { CurrencyService } from '../service/currency.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-currencyconvertor',
  templateUrl: './currencyconvertor.component.html',
  styleUrls: ['./currencyconvertor.component.scss']
})
export class CurrencyconvertorComponent implements OnInit {

  constructor(private api: CurrencyService, private rForm: FormBuilder) { };

  currencyForm: FormGroup;
  currencySymbols: { key: string; value: string; }[] = [];
  @Input() title!: String;
  result: Number = 0;

  symbol: String = 'USD';

  isLoading = false;

  ngOnInit(): void {
    this.currencyForm = this.rForm.group({
      from: [null, Validators.required],
      to: [null, Validators.required],
      amount: [null, [Validators.required, Validators.pattern('^[0-9]+$')]]
    });


    this.api.getSymbols().subscribe(
      res => {
        this.currencySymbols = Object.keys(res.symbols).map(key => ({ key: key, value: res.symbols[key] }))
      },
      err => {
        console.log(err);
      }
    )
  }

  onSubmit() {
    if (this.currencyForm.valid) {
      const from = this.currencyForm.get('from').value;
      const to = this.currencyForm.get('to').value;
      const amount = this.currencyForm.get('amount').value;

      this.isLoading = true;

      this.api.convertCurrency(to, from, amount).subscribe(
        res => {
          this.result = res.result;
          console.log(res.result);
          this.isLoading = false;
          this.symbol = to;
        },
        err => {
          alert(err);
          console.log(err);
          this.isLoading = false;
        }
      )
    }
  }


}
