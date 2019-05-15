# Puppeteer Github Scrapper
A basic GitHub Scrapper that logs-in and searches for certain term to the search.

Allows to search and filter specific patterns on the results with an asynchronous function. I use it to search for specific pieces of code or comments. Can be expanded to use many more search types and parameters (for now it includes `Issues`, `Code` and `Commits`).

**Usage**

1. Download the repository.

2. Run `npm install`.

3. Set the environment variables.

3. Run `npm start`.

#### Environment Variables

These variables are required for the program to operate correctly.

**EMAIL** The email to be used to log-in into GitHub

**PASSWORD** The password to be used to log-in into Github

**CHROMIUM_PATH** The path to be used by Puppeteer to open Chromium. Default is `/usr/bin/chromium`

#### Further notes
Base Boilerplate used: `https://github.com/sosmii/puppeteer-typescript-boilerplate.git`