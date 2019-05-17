import Scrapper from "./lib/Scrapper";
import { SEARCH_TYPES } from "./lib/enums";
import * as dotenv from 'dotenv'
dotenv.config();

let scrapper = new Scrapper();
scrapper.pagesToScrap = 2;
scrapper.language = "Javascript";
let email = <string>process.env.EMAIL, password = <string>process.env.PASSWORD;

scrapper.setAuth(email,password)

scrapper.extractScrap("Fired", undefined, undefined, SEARCH_TYPES.commits, async (result:string)=>{
  let matchA = result.match(new RegExp(/\n.*fired.*\n/gi));
  if(matchA){
    return matchA.join("");
  }
  return null;
})
.then((data)=>{
  console.log("Data from extract scrap: ",data);
})
.catch((err)=>{
  console.log("Error scrapping: ",err);
});