import { Component, OnInit } from '@angular/core';
import { Provider } from 'src/app/models/provider'

@Component({
  selector: 'app-mediator',
  templateUrl: './mediator.component.html',
  styleUrls: ['./mediator.component.css']
})
export class MediatorComponent implements OnInit {
  providers: number[]=[,];
  customers: number[]=[,,,];
  transport: number[][]=[[,,,],[,,,]];

  result: number;

  constructor() {}

  ngOnInit(): void {

  }

  submitData (){
    console.log('providers: ' + this.providers);
    console.log('customers: ' + this.customers);
    console.log('transport: ' + this.transport);
    this.result = Number(this.providers[0]) + Number(this.providers[1]);
  }
}
