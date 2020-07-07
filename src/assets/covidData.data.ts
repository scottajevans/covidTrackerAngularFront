export interface global {
    NewConfirmed : number,
    NewDeaths : number,
    NewRecovered : number,
    TotalConfirmed : number,
    TotalDeaths : number,
    TotalRecovered : number
  }
  
export interface countries {
    Country: String,
    CountryCode: String,
    Date: String,
    NewConfirmed: number,
    NewDeaths: number,
    NewRecovered: number,
    Slug: String,
    TotalConfirmed: number,
    TotalDeaths: number,
    TotalRecovered: number
  }
  
export  interface covidData {
    Global : global,
    Countries : countries[]
  }