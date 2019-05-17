import Scrapper from "./lib/Scrapper";
import { SEARCH_TYPES } from "./lib/enums";
import * as dotenv from 'dotenv'
dotenv.config();

let scrapper = new Scrapper();
scrapper.pagesToScrap = 5;
scrapper.language = "Javascript";
let email = <string>process.env.EMAIL, password = <string>process.env.PASSWORD;

scrapper.setAuth(email,password)

scrapper.extractScrap("Green", undefined, undefined, SEARCH_TYPES.code, async (result:string)=>{
  let matchA = result.match(new RegExp(/\n.*Green.*\n/gi));
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