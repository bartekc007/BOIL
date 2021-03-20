import { summaryFileName } from '@angular/compiler/src/aot/util';
import { Component, OnInit } from '@angular/core';
import { coordinates, Provider } from 'src/app/models/provider'

@Component({
  selector: 'app-mediator',
  templateUrl: './mediator.component.html',
  styleUrls: ['./mediator.component.css']
})
export class MediatorComponent implements OnInit {
  providers: number[] = new Array(2);
  providersSales: number[] = new Array(2);
  customers: number[] = new Array(4);
  customersCosts: number[] = new Array(4);
  transport: number[][] = new Array(2).fill(0).map(x => new Array(4))
  isPPEqual: boolean = true;

  result: number;

  constructor() {}

  ngOnInit(): void {}

  submitData (){
    console.log('providers supply: ' + this.providers);
    console.log('providers sales: ' + this.providersSales);
    console.log('customers demand: ' + this.customers);
    console.log('customers costs: ' + this.customersCosts);
    console.log('transport: ' + this.transport);

    let totalSupply = this.providers.reduce((a,b)=> (Number(a)+Number(b)));
    let totalDemand = this.customers.reduce((a,b)=> (Number(a)+Number(b)));
    console.log('Total supply: ' + totalSupply)
    console.log('Total demand: ' + totalDemand)

    this.isPPEqual = totalSupply == totalDemand ? true : false;
    console.log('Flaga P = P? ' + this.isPPEqual);

    let oneRoutProfit: number[][] = new Array(2).fill(0).map(x => new Array(4))
    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < 4; j++) {
        oneRoutProfit[i][j] = this.customersCosts[j] - this.providersSales[i] - this.transport[i][j];
      }
    }
    console.log('oneRouteProfit: ' + oneRoutProfit);
    
    
    
    const tempProviders = [...this.providers]
    const tempCustomers = [...this.customers]
    let routsValues: number[][] = new Array(this.providers.length)
      .fill(0).map(x => new Array(this.customers.length));
    
    let MaxProfitCooardinates = this.getMaxBubble(oneRoutProfit);

    for (let i = 0; i < MaxProfitCooardinates.length; i++) {
      if(tempProviders[MaxProfitCooardinates[i].i] > 0 || tempCustomers[MaxProfitCooardinates[i].j] > 0) {
        if(tempProviders[MaxProfitCooardinates[i].i] > tempCustomers[MaxProfitCooardinates[i].j])
        {
          routsValues[MaxProfitCooardinates[i].i][MaxProfitCooardinates[i].j] = tempCustomers[MaxProfitCooardinates[i].j];
          tempProviders[MaxProfitCooardinates[i].i] -= tempCustomers[MaxProfitCooardinates[i].j];
          tempCustomers[MaxProfitCooardinates[i].j] -= tempCustomers[MaxProfitCooardinates[i].j];
        } else {
          routsValues[MaxProfitCooardinates[i].i][MaxProfitCooardinates[i].j] = tempProviders[MaxProfitCooardinates[i].i];
          tempProviders[MaxProfitCooardinates[i].i] -= tempProviders[MaxProfitCooardinates[i].i];
          tempCustomers[MaxProfitCooardinates[i].j] -= tempProviders[MaxProfitCooardinates[i].i];
        }
      }
    }

    console.log(routsValues);
  }  

  getMaxBubble(array: number[][]){
    let result: coordinates[] = [];

    result = array.flatMap((row, i) => row.map((val, j) => ({i, j, v: val})))    
    .sort((a, b) => b.v - a.v)

    for (let i = 0; i < result.length; i++) {
      console.log('result value: ' + result[i].v);  
    }
    return result;
  }

}

