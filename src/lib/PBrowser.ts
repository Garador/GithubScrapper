import puppeteer from 'puppeteer';

import path from 'path'
export class PBrowser {
    private static _instance:PBrowser = new PBrowser();

    public width = 1480;
    public height = 1024;
    public headless = false;
    public executablePath:string = path.relative('./', process.env.CHROMIUM_PATH || '/usr/bin/chromium');
    
    private constructor(){

    }

    public async getBrowser():Promise<puppeteer.Browser>{
        const browser = await puppeteer.launch({
            executablePath: this.executablePath,
            headless: this.headless,
            defaultViewport: {
                width: this.width,
                height: this.height
            }
        });
        return browser;
    }

    public async getPage(browser:puppeteer.Browser){
        return await browser.newPage();
    }

    public static get Instance():PBrowser {
        return this._instance;
    }
}

export default PBrowser.Instance;