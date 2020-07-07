import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Sort } from '@angular/material/sort';
import { CovidDataService } from '../../assets/covidData.service';

import { global, countries, covidData } from '../../assets/covidData.data';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  covidData : covidData;
  sortedData : countries[];
  searchString: string = "";
  displayedColumns = ["country", "newRecovered", "newConfirmed", "newDeaths", "totalRecovered", "totalConfirmed", "totalDeaths"]

  constructor(private router: Router, public CovidDataService : CovidDataService) {
    
  }

  goToPage(countryCode): void{
    console.log("navigating to: ", countryCode)
      this.router.navigate(['/country/', countryCode]);
  }

  sortData(sort: Sort) {
    const data = this.covidData.Countries.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }

    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'country': return compare(a.Country, b.Country, isAsc);
        case 'newRecovered': return compare(a.NewRecovered, b.NewRecovered, isAsc);
        case 'newConfirmed': return compare(a.NewConfirmed, b.NewConfirmed, isAsc);
        case 'newDeaths': return compare(a.NewDeaths, b.NewDeaths, isAsc);
        case 'totalRecovered': return compare(a.TotalRecovered, b.TotalRecovered, isAsc);
        case 'totalConfirmed': return compare(a.TotalConfirmed, b.TotalConfirmed, isAsc);
        case 'totalDeaths': return compare(a.TotalDeaths, b.TotalDeaths, isAsc);
        default: return 0;
      }
    });
  }

  async ngOnInit(): Promise<void> {
      this.covidData = await this.CovidDataService.getData();
      this.sortedData = this.covidData.Countries.sort((a, b) => {
        return (compare(a.TotalConfirmed, b.TotalConfirmed, false))
      })
  }

}


function compare(a: number | String, b: number | String, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
