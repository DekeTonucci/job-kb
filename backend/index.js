const puppeteer = require('puppeteer');
const { getLinks, getPageData } = require('./helpers');
const keyword = 'web'; // Job title or category ect...
const minSalary = '$30,000'; // Job title or category ect...
const zipcode = '18974'; // 5 digit code
const radius = '5'; // 5 - 10 - 15 - 25 - 50 - 100
const experienceLevel = 'entry_level'; // entry_level - mid_level - senior_level

// For testing different indeed urls and parameters for now
const indeedURL = `https://www.indeed.com/jobs?q=${keyword}+${minSalary}&l=${zipcode}&radius=${radius}&explvl=${experienceLevel}&sort=date`;
const indeedRemoteURL = `https://www.indeed.com/jobs?q=${keyword}+${minSalary}&l=${zipcode}&explvl=${experienceLevel}&sort=date`;

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  const url = indeedRemoteURL;
  console.log('Indeed Link: ', url);
  const allLinks = await getLinks(url, page);

  const scrapedData = [];

  for (let link of allLinks) {
    // console.log('Getting data for: ');
    // console.log({ link });
    const data = await getPageData(link, page);
    data.url = link.toString();
    scrapedData.push(data);
  }

  console.log({ scrapedData });

  // Find users list of jobs
  // Search to see if any of the jobs are currently already included in the Board
  // Search each list for each job
  // If not found on the board, save each job as a New Job in the New Jobs list

  await browser.close();
})();
