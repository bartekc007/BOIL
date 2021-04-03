import { summaryFileName } from '@angular/compiler/src/aot/util';
import { Component, ComponentFactoryResolver, HostListener, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { coordinates, Provider } from 'src/app/models/provider'

@Component({
  selector: 'app-mediator',
  templateUrl: './mediator.component.html',
  styleUrls: ['./mediator.component.css']
})
export class MediatorComponent implements OnInit {

  // providers: number[] = new Array(2);
  // providersSales: number[] = new Array(2);
  // customers: number[] = new Array(4);
  // customersCosts: number[] = new Array(4);
  // transport: number[][] = new Array(2).fill(0).map(x => new Array(4))
  // isPPEqual: boolean = true;

  providers: number[] = [25,35];
  providersSales: number[] = [10,12];
  customers: number[] = [12,18,14,16];
  customersCosts: number[] = [20,22,25,30];
  transport: number[][] = [[1,3,2,4],[6,5,8,7]];
  finalResultRoutesValue: number[][] = new Array(2).fill(0).map(x=> new Array(4));

  result: number=0;
  income: number=0;
  outcome: number=0;

  isPPEqual: boolean = true;
  isResultVisible:boolean = false;
  isResetVisible:boolean = false;

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
          tempCustomers[MaxProfitCooardinates[i].j] -= tempProviders[MaxProfitCooardinates[i].i];
          tempProviders[MaxProfitCooardinates[i].i] -= tempProviders[MaxProfitCooardinates[i].i];
        }
      }
    }
    console.log(routsValues);
    console.log('___________________');

    let flag :boolean;
    let counter = 0;

    do {
      let alphaBeta = this.getAlphaBeta(routsValues,oneRoutProfit);
      console.log('alpha: ' + alphaBeta.alpha);
      console.log('beta: ' + alphaBeta.beta);

      const criteriaValues = this.getCriteriaValues(routsValues,oneRoutProfit,alphaBeta.alpha,alphaBeta.beta);
      console.log('criteria values: ' + criteriaValues);
    
      let isOptimalSolution = this.isOptimalSolution(criteriaValues)
      flag = isOptimalSolution.isOptimalSolution;
      console.log('isOptimalSolution: ' +isOptimalSolution.i + ' ' + isOptimalSolution.j + ' ' + isOptimalSolution.isOptimalSolution);

      if(!isOptimalSolution.isOptimalSolution)
      {
        this.getCycle(isOptimalSolution.i,isOptimalSolution.j,routsValues,criteriaValues);
      
      }

    console.log('after cycle: ' + routsValues);
      counter++;
    } while (!flag);
    
    
    for (let i = 0; i < routsValues.length; i++) {
      for (let j = 0; j < routsValues[i].length; j++) {
        this.result += routsValues[i][j] * oneRoutProfit[i][j];
        this.income += this.customersCosts[j] * routsValues[i][j];
         
      }  
    }
  this.outcome += this.income - this.result;
  this.finalResultRoutesValue = [...routsValues];
  this.isResultVisible = true;
  this.isResetVisible = true;
  }  

  resetForm() {
    this.providers = new Array(2);
    this.providersSales = new Array(2);
    this.customers = new Array(4);
    this.customersCosts = new Array(4);
    this.transport = new Array(2).fill(0).map(x => new Array(4))
    this.isResetVisible = false;
    this.isResultVisible = false;
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

  getAlphaBeta(routsValues: number[][], oneRoutProfit: number[][]) {
    const alpha = new Array<number>(2);
    const beta = new Array<number>(4);

    alpha[0] = 0;

    for (let i = 0; i < beta.length; i++) {
      if(routsValues[0][i]!=0)
      {
        beta[i]= oneRoutProfit[0][i];
      }  
    }

    for (let i = 0; i < beta.length; i++) {
      if(routsValues[1][i]!=0 && beta[i]!=undefined)
      {
        alpha[1] = oneRoutProfit[1][i] - beta[i];
      }
    }

    
    for (let j = 0; j < beta.length; j++) {
      if(routsValues[0][j]!=0)
        beta[j]= oneRoutProfit[0][j];
      else
        beta[j]= oneRoutProfit[1][j]-alpha[1];
    }

    return {
      alpha,beta
    }
  }

  getCriteriaValues(routsValues:number[][],oneRoutProfit:number[][],alpha:number[],beta:number[]) {
    const temp :number[][] = new Array(2).fill(0).map(x => new Array(4))
    
    for (let i = 0; i < routsValues.length; i++) {
      for (let j = 0; j < routsValues[i].length; j++) {
        if(routsValues[i][j]==0)
        {
          temp[i][j]=oneRoutProfit[i][j]-alpha[i]-beta[j]
        }
      }
    }
    
    return temp;
  }

  isOptimalSolution(criteriaValues:number[][])
  {
    console.log('to jest to: ' , criteriaValues);
    let isOptimalSolution :boolean = true;
    let tempi=0,tempj=0;
    for (let i = 0; i < criteriaValues.length; i++) {
      for (let j = 0; j < criteriaValues[i].length; j++) {
        if(criteriaValues[i][j]>0)
        {
          isOptimalSolution = false;
          tempi = i;
          tempj = j;
        } 
      }   
    }
    
    return {isOptimalSolution, i:tempi,j:tempj}

  }

  getCycle(tempI:number,tempJ:number,routsValues:number[][],criteriaValues:number[][])
  {

    if(tempI>0){
      let column :number = 0;
      for (let i = 0; i < criteriaValues[tempI].length; i++) {
        
        if(criteriaValues[tempI-1][i] == undefined && criteriaValues[tempI][i] == undefined)
        {
          column = i;
          break;
        }
      }

      let tempValue :number =0;
      if(routsValues[tempI-1][tempJ]<routsValues[tempI][column])
      {
        tempValue = routsValues[tempI-1][tempJ]
      }
      else{
        tempValue = routsValues[tempI][column]
      }

      routsValues[tempI][tempJ] += tempValue;
      routsValues[tempI-1][column] += tempValue;
      routsValues[tempI-1][tempJ] -= tempValue;
      routsValues[tempI][column] -= tempValue;


    }
    else{
      let column :number = 0;
      for (let i = 0; i < criteriaValues[tempI].length; i++) {
        
        if(criteriaValues[tempI+1][i] == undefined && criteriaValues[tempI][i] == undefined)
        {
          column = i;
          break;
        }
      }

      let tempValue :number =0;
      if(routsValues[tempI+1][tempJ]<routsValues[tempI][column])
      {
        tempValue = routsValues[tempI+1][tempJ]
      }
      else{
        tempValue = routsValues[tempI][column]
      }

      routsValues[tempI][tempJ] += tempValue;
      routsValues[tempI+1][column] += tempValue;
      routsValues[tempI+1][tempJ] -= tempValue;
      routsValues[tempI][column] -= tempValue;
    }
  }

}