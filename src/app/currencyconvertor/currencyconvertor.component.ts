import { Component, Input, OnInit } from '@angular/core';
import { CurrencyService } from '../service/currency.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-currencyconvertor',
  templateUrl: './currencyconvertor.component.html',
  styleUrls: ['./currencyconvertor.component.scss'],
})
export class CurrencyconvertorComponent implements OnInit {
  constructor(private api: CurrencyService, private rForm: FormBuilder) {}

  private extractCode(raw: any): string {
    return typeof raw === 'string' ? raw : raw?.key ?? raw?.id ?? '';
  }

  dropdownConfig: any = {
    displayKey: 'key',
    idField: 'key',
    search: true,
    height: '200px',
    placeholder: 'Select',
    // must return number: -1, 0, 1
    customComparator: (a: any, b: any): number => {
      const va =
        a && a.key ? String(a.key).toLowerCase() : String(a).toLowerCase();
      const vb =
        b && b.key ? String(b.key).toLowerCase() : String(b).toLowerCase();
      if (va < vb) return -1;
      if (va > vb) return 1;
      return 0;
    },
    limitTo: 0,
    moreText: 'more',
    noResultsFound: 'No results found!',
    searchPlaceholder: 'Search...',
    clearOnSelection: false,
    inputDirection: 'ltr',
  };

  currencyForm: FormGroup;
  currencySymbols: { key: string; value: string }[] = [];
  @Input() title!: String;
  result: Number = 0;

  symbol: String = 'USD';

  isLoading = false;

  ngOnInit(): void {
    this.currencyForm = this.rForm.group({
      from: [null, Validators.required],
      to: [null, Validators.required],
      amount: [null, [Validators.required, Validators.pattern('^[0-9]+$')]],
    });

    this.api.getSymbols().subscribe(
      (res) => {
        this.currencySymbols = Object.keys(res.symbols).map((key) => ({
          key: key,
          value: res.symbols[key],
        }));
      },
      (err) => {
        console.log(err);
      }
    );
  }

  onSubmit() {
    if (this.currencyForm.valid) {
      const rawFrom = this.currencyForm.get('from').value;
      const rawTo = this.currencyForm.get('to').value;
      const amount = this.currencyForm.get('amount').value;

      const from =
        typeof rawFrom === 'string'
          ? rawFrom
          : rawFrom?.key ?? rawFrom?.id ?? '';
      const to =
        typeof rawTo === 'string' ? rawTo : rawTo?.key ?? rawTo?.id ?? '';

      this.isLoading = true;

      this.api.convertCurrency(to, from, amount).subscribe(
        (res) => {
          this.result = res.result;
          console.log(res.result);
          this.isLoading = false;
          this.symbol = to;
        },
        (err) => {
          alert(err);
          console.log(err);
          this.isLoading = false;
        }
      );
    }
  }

  swapCurrencies() {
    const rawFrom = this.currencyForm.get('from')!.value;
    const rawTo = this.currencyForm.get('to')!.value;

    // require both selected
    if (!rawFrom || !rawTo) {
      return;
    }

    const fromCode = this.extractCode(rawFrom); // old from
    const toCode = this.extractCode(rawTo);     // old to

    // swap form values (the dropdown uses idField:'key' so strings are fine)
    this.currencyForm.patchValue({ from: toCode, to: fromCode });

    // if amount present and valid, perform conversion immediately with swapped pair
    const amount = this.currencyForm.get('amount')!.value;
    if (amount && /^[0-9]+$/.test(String(amount))) {
      this.isLoading = true;
      // newFrom = toCode (old to), newTo = fromCode (old from)
      this.api.convertCurrency(fromCode, toCode, amount).subscribe(
        (res) => {
          this.result = res.result;
          this.symbol = fromCode; // show the currency that was requested as 'to' previously
          this.isLoading = false;
        },
        (err) => {
          console.error(err);
          this.isLoading = false;
        }
      );
    }
  }
}
