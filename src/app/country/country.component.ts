import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CountryDataService } from '../../assets/countryData.service';
import { countryEntry } from '../../assets/countryData.data';

import * as d3 from 'd3';
import * as d3Scale from 'd3';
import * as d3Shape from 'd3';
import * as d3Array from 'd3';
import * as d3Axis from 'd3';
import { element } from 'protractor';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.css']
})
export class CountryComponent implements OnInit {
  countryData : countryEntry[];
  countryCode : string;
  mostRecent : countryEntry;

  private margin = {top: 20, right: 20, bottom: 30, left: 150};
  private width: number;
  private height: number;
  private x: any;
  private y: any;
  private x2 : any;
  private y2 : any;
  private svg: any;
  private svg2 : any;
  private line: d3Shape.Line<[number, number]>; // this is line definition

  constructor(private route : ActivatedRoute, public CountryDataService : CountryDataService) {
    this.countryCode = this.route.snapshot.paramMap.get('countryCode');
    this.width = 960 - this.margin.left - this.margin.right;
    this.height = 500 - this.margin.top - this.margin.bottom;
   }

  async ngOnInit(): Promise<void> {
    this.countryData = await this.CountryDataService.getData(this.countryCode);
    this.mostRecent = this.countryData[this.countryData.length - 1]

    this.buildSvg();
    this.addXandYAxis();
    this.drawLineAndPath();
  }

  private drawLineAndPath() {
    this.line = d3Shape.line()
        .x( (d: any) => this.x(new Date(d.Date)) )
        .y( (d: any) => this.y(d.Recovered) );
    // Configuring line path
    this.svg.append('path')
        .datum(this.countryData)
        .attr('d', this.line)
        .attr('stroke', 'green')
        .attr('stroke-width', 2)
        .attr('fill', 'none');

    this.line = d3Shape.line()
        .x( (d: any) => this.x(new Date(d.Date)) )
        .y( (d: any) => this.y(d.Confirmed) );
    // Configuring line path
    this.svg.append('path')
        .datum(this.countryData)
        .attr('d', this.line)
        .attr('stroke', 'orange')
        .attr('stroke-width', 2)
        .attr('fill', 'none');

    this.line = d3Shape.line()
        .x( (d: any) => this.x(new Date(d.Date)) )
        .y( (d: any) => this.y(d.Deaths) );
    // Configuring line path
    this.svg.append('path')
        .datum(this.countryData)
        .attr('d', this.line)
        .attr('stroke', 'black')
        .attr('stroke-width', 2)
        .attr('fill', 'none');

    
    // Lines for SVG2 below

    this.line = d3Shape.line()
        .x((d: any) => this.x(new Date(d.Date)) )
        // .y((d: any) => this.y(d.Confirmed))
        .y((d: any, i : number) => {
          if (i == 0){
            return this.y2(d.Confirmed)
          } else {
            var val = d.Confirmed - this.countryData[i - 1].Confirmed;
            if (val < 0){
              return this.y2(0)
            } else {
              return this.y2(val);
            }
            
          }
        });
    // Configuring line path
    this.svg2.append('path')
        .datum(this.countryData)
        .attr('d', this.line)
        .attr('stroke', 'orange')
        .attr('stroke-width', 2)
        .attr('fill', 'none');

    this.line = d3Shape.line()
        .x( (d: any) => this.x(new Date(d.Date)) )
        .y( (d: any, i : number) => {
          if (i == 0){
            return this.y2(d.Recovered)
          } else {
            var val = d.Recovered - this.countryData[i - 1].Recovered
            if (val < 0) {
              console.log("WAS A NEGATIVE");
              console.log("Today: " + d.Recovered + "    and yesterdays: " + this.countryData[i - 1].Recovered);
              console.log("Val is : " + val);
              console.log("Date is : " + d.Date)
              return this.y2(0);
            } else {
              return this.y2(val);
            }
          }
        }); 
    // Configuring line path
    this.svg2.append('path')
        .datum(this.countryData)
        .attr('d', this.line)
        .attr('stroke', 'green')
        .attr('stroke-width', 2)
        .attr('fill', 'none');

    this.line = d3Shape.line()
        .x( (d: any) => this.x(new Date(d.Date)) )
        .y( (d: any, i : number) => {
          if (i == 0){
            return this.y2(d.Deaths)
          } else {
            var val = d.Deaths - this.countryData[i - 1].Deaths;
            if (val < 0) {
              return this.y2(0);
            } else {
              return this.y2(val);
            }
          }
        }); 
    // Configuring line path
    this.svg2.append('path')
        .datum(this.countryData)
        .attr('d', this.line)
        .attr('stroke', 'black')
        .attr('stroke-width', 2)
        .attr('fill', 'none');
  }

  private addXandYAxis() {
    // range of data configuring
    this.x = d3Scale.scaleTime().range([0, this.width]);
    this.y = d3Scale.scaleLinear().range([this.height, 0]);
    this.x2 = d3Scale.scaleTime().range([0, this.width]);
    this.y2 = d3Scale.scaleLinear().range([this.height, 0]);
    this.x.domain(d3Array.extent(this.countryData, (d) => new Date(d.Date)));
    this.y.domain(d3Array.extent(this.countryData, (d) => d.Confirmed ));
    // Configure the X Axis
    this.svg.append('g')
        .attr('transform', 'translate(0,' + this.height + ')')
        .call(d3Axis.axisBottom(this.x));
    // Configure the Y Axis
    this.svg.append('g')
        .attr('class', 'axis axis--y')
        .call(d3Axis.axisLeft(this.y));

    this.x2.domain(d3Array.extent(this.countryData, (d) => new Date(d.Date)));
    this.y2.domain(d3Array.extent(this.countryData, (d, i) => {
      if (i == 0){
        return d.Confirmed
      } else {
        var val = d.Confirmed - this.countryData[i - 1].Confirmed
        if (val < 0) {
          return 0
        } else {
          return val;
        }
      }
    }));
    this.svg2.append('g')
        .attr('transform', 'translate(0,' + this.height + ')')
        .call(d3Axis.axisBottom(this.x2));
    // Configure the Y Axis
    this.svg2.append('g')
        .attr('class', 'axis axis--y')
        .call(d3Axis.axisLeft(this.y2));
  }

  private buildSvg() {
    this.svg = d3.select("#first") // svg element from html
      .append('g')   // appends 'g' element for graph design
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

    this.svg2 = d3.select("#second")
      .append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');
  }
}
