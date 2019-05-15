import puppeteer from 'puppeteer';
export class Auth {
    private static _instance:Auth = new Auth();
    private constructor(){

    }

    static get Instance():Auth {
        return this._instance;
    }
    
    async logIntoGitHub(page:puppeteer.Page, email:string, password:string){
        await page.goto('https://github.com/login', {
            timeout: 60000,
            waitUntil: 'domcontentloaded'
        });

        await page.evaluate((a, b) => {
            ( < any > document.querySelector('#login_field')).value = a;
            ( < any > document.querySelector('#password')).value = b;
        }, email, password);

        await page.click("#login > form > div.auth-form-body.mt-3 > input.btn.btn-primary.btn-block");
        await new Promise((accept)=>{
            page.once('load', ()=>{
                accept();
            });
        });
        return page.url().indexOf("/session")<0;
    }
}


export default Auth.Instance;