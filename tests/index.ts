import { expect } from 'chai';
import Scrapper from "../src/lib/Scrapper";
import * as dotenv from 'dotenv'
import Auth from '../src/lib/Auth';
import PBrowser from '../src/lib/PBrowser';
import {Page} from 'puppeteer'
import { SEARCH_TYPES } from '../src/lib/enums';


dotenv.config();

let scrapper = new Scrapper();
scrapper.pagesToScrap = 5;
scrapper.language = "Javascript";
let email = <string>process.env.EMAIL, password = <string>process.env.PASSWORD;

scrapper.setAuth(email,password);

describe('Test Scrapping functions', async () => {

    it.skip('Should test the browser initialization', async function () {
        this.timeout(60000);
        const browser = await PBrowser.getBrowser();
        expect(browser).to.be.instanceOf(Object);
        const page = await PBrowser.getPage(browser);
        expect(page).to.be.instanceOf(Object);
        await browser.close();
    })

    it.skip('Should test the log-in', async function () {
        this.timeout(60000);
        const email = < string > process.env.EMAIL, password = < string > process.env.PASSWORD;

        const browser = await PBrowser.getBrowser();
        const page = await PBrowser.getPage(browser);

        const loggedIn = await Auth.logIntoGitHub(page, email, password);

        await browser.close();

        expect(loggedIn).to.equal(true);
    });

    it('Should test the scrapping', function (done) {
        this.timeout(60000);
        const scrapper = new Scrapper();
        scrapper.setAuth(< string > process.env.EMAIL, < string > process.env.PASSWORD);
        scrapper.pagesToScrap = 2;
        scrapper.extractScrap("Damn", undefined, undefined, SEARCH_TYPES.commits, async (result: string) => {
            let matchA = result.match(new RegExp(/\n.*Damn|fuck|hell.*\n/gi));
            if (matchA) {
                return matchA.join("");
            }
            return null;
        })
        .then((data) => {
            console.log("Data from extract scrap: ", data);
            expect(data.length).to.be.greaterThan(0);
            done();
        })
        .catch((err) => {
            console.log("Error scrapping: ", err);
        });
    })
});