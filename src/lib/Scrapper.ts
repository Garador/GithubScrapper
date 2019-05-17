import PBrowser from './PBrowser';
import Auth from './Auth';
import { SEARCH_TYPES, DEF_NEXT_PAGE_QSELECTOR, DEF_ELEMENT_QS, SEARCH_ORDER } from './enums';

export default class Scrapper {

    //The number of result pages to scrap.
    public pagesToScrap:number = 0;
    //The language to scrap.
    public language:string = "JavaScript";

    //The email to use to login into github
    private _email:string = "";
    //The password to use to login into github
    private _password:string = "";

    //The selector to use on the GitHub page to get the <a> element for the next GitHub page
    public nextPageQS:DEF_NEXT_PAGE_QSELECTOR = DEF_NEXT_PAGE_QSELECTOR.code;
    //The selector to use for scrapping on the element on GitHub
    public scrapElementsQS:DEF_ELEMENT_QS = DEF_ELEMENT_QS.code;

    /**
     * @description Sets the authentication details to log-in into GitHub
     * @param email Email to use to log-in into GitHub
     * @param password Password to use to log-in into GitHub
     */
    public setAuth(email:string, password:string){
        this._email = email;
        this._password = password;
    }

    constructor(){

    }

    /**
     * @description Constructs the URL for a new page on Github search
     *  */  
    private _getNextPage(nextURL:string){
        return ['https://github.com', nextURL].join("/");
    }

    /**
     * @description Builds the search URL to use into GitHub.
     */
    public getSearchURL = (query: string, language: string = "HTML", order = "desc", type = "Code") => {
        return "https://github.com/search?l=__L__&o=__O__&q=__Q__&s=indexed&type=__TYPE__"
        .replace("__L__", language)
        .replace("__O__", order)
        .replace("__Q__", query)
        .replace("__TYPE__", type);
    }

    /**
     * @description Executes a search on GitHub and returns the results.
     * @param query The query to apply on the search function
     * @param language The language to search into
     * @param order The order of the scrapper
     * @param type The type of search to implement
     */
    public async rawScrap(query:string, 
    language:SEARCH_TYPES = SEARCH_TYPES.code, 
    order:SEARCH_ORDER = SEARCH_ORDER.desc, 
    type:SEARCH_TYPES = SEARCH_TYPES.code){
        const browser = await PBrowser.getBrowser();
        const page = await PBrowser.getPage(browser);
        
        try{
            let loggedIn = await Auth.logIntoGitHub(page, this._email, this._password);
            if(!loggedIn){
                throw "\n\n ERROR: COULD NOT LOG-IN INTO GITHUB. PLEASE CHECK YOUR CREDENTIALS. \n\n"
            }
        }catch(e){
            console.log(e)
            throw "\n\n************* ERROR LOGGING INTO GITHUB: PLEASE REVIEW LOG. **************"
        }


        const accumulatedData: string[] = [];
        let nextPage: string | null = null;
        let hasNextPage = true;
        
        for (let i = 0; (i < this.pagesToScrap) && hasNextPage; i++) {
            
            const newURL = nextPage ? this._getNextPage(nextPage) : this.getSearchURL(query, language, order, type);
            
            await page.goto(newURL, {
                waitUntil: 'domcontentloaded'   //The content doesn't depend on JavaScript, only on DOM content
            });

            let pageData: {
                text: string[],     //The text of the code of the page
                nextPage: string    //The link to the next page
            };

            switch(type){
                case SEARCH_TYPES.code:
                    pageData = await page.evaluate((nextPageQS, scrapElementsQS) => {
                        let texts: string[] = []
                        let pageElements = document.querySelectorAll(scrapElementsQS);

                        pageElements
                        .forEach((element) => {
                            texts.push(( < string > element.textContent));
                        });

                        return {
                            text: texts,
                            nextPage: document.querySelector(nextPageQS) ? ( < any > document.querySelector(nextPageQS)).getAttribute("href") : null
                        };
                    }, DEF_NEXT_PAGE_QSELECTOR.code, DEF_ELEMENT_QS.code);

                    accumulatedData.push(pageData.text.join("\n"));
                    nextPage = pageData.nextPage;
                break;
                case SEARCH_TYPES.commits:
                    pageData = await page.evaluate((nextPageQS, commit_elements, commit_title, commit_description) => {
                        let texts: string[] = []
                        let pageElements = document.querySelectorAll(commit_elements);
                        pageElements
                        .forEach((element) => {
                            try{
                                let title = element.querySelector(commit_title).textContent;
                                let desc = element.querySelector(commit_description);
                                let text = title + (desc ? "\n\nDESCRIPTION:\n"+desc.textContent : "")
                                texts.push(( < string > text));
                            }catch(e){
                                texts.push(e)
                            }
                        });
                        return {
                            text: texts,
                            nextPage: document.querySelector(nextPageQS) ? ( < any > document.querySelector(nextPageQS)).getAttribute("href") : null
                        };
                    }, DEF_NEXT_PAGE_QSELECTOR.commits, DEF_ELEMENT_QS.commit_elements, DEF_ELEMENT_QS.commit_title, DEF_ELEMENT_QS.commit_description);
                   
                    accumulatedData.push(pageData.text.join("\n"));
                    nextPage = pageData.nextPage;
                break;
                case SEARCH_TYPES.issues:
                    pageData = await page.evaluate((nextPageQS, commit_elements, commit_title, commit_description) => {
                        let texts: string[] = []
                        let pageElements = document.querySelectorAll(commit_elements);
                        pageElements
                        .forEach((element) => {
                            try{
                                let title = element.querySelector(commit_title).textContent;
                                let desc = element.querySelector(commit_description);
                                let text = title + (desc ? "\n\nDESCRIPTION:\n"+desc.textContent : "")
                                texts.push(( < string > text));
                            }catch(e){
                                texts.push(e)
                            }
                        });
                        return {
                            text: texts,
                            nextPage: document.querySelector(nextPageQS) ? ( < any > document.querySelector(nextPageQS)).getAttribute("href") : null
                        };
                    }, DEF_NEXT_PAGE_QSELECTOR.issues, DEF_ELEMENT_QS.issue_elements, DEF_ELEMENT_QS.issue_title, DEF_ELEMENT_QS.issue_description);
                    
                    accumulatedData.push(pageData.text.join("\n"));
                    nextPage = pageData.nextPage;
                break;
                default:
                break;
            }
            hasNextPage = !!nextPage;
        }
        await browser.close();
        return accumulatedData;
    }

    /**
     * @description A scrap function that filters the results of the GitHub search based on a function
     * given by it's user.
     * @param query The query to use on the search engine
     * @param language The language to search in
     * @param order The order of the results
     * @param type The type of the results
     * @param filterFunction A function that must return either a value or a null. If a null is returned, the
     * result will be ommited. It will return the raw results from a page, so you can process it.
     */
    public async extractScrap(query:string, 
    language:SEARCH_TYPES = SEARCH_TYPES.code, 
    order:SEARCH_ORDER = SEARCH_ORDER.desc, 
    type:SEARCH_TYPES = SEARCH_TYPES.code, 
    filterFunction:Function){
        let rawResults:string[] = []
        try{
            rawResults = await this.rawScrap(query, language, order, type)
        }catch(e){
            console.log(e);
            throw "\n\nERROR SCRAPPING. CHECK THE LOG.\n\n";
        }
        let resultsB = [];
        for(let i=0;i<rawResults.length;i++){
            let filteredResult = await filterFunction(rawResults[0]);
            if(filteredResult != null){
                resultsB.push(filteredResult);
            }
        }
        return resultsB;
    }
    
}