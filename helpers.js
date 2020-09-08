async function getLinks(url, page) {
  await page.goto(url, page);

  // Get link of each job
  const links = await page.$$eval(
    '.jobsearch-SerpJobCard > h2.title > a',
    (options) => options.map((link) => link.href)
  );

  // Constuct an array of arrays with those job links found
  const aoaLinks = links.map((link) => [link]);
  return aoaLinks;
}

async function getPageData(url, page) {
  await page.goto(url[0]);

  // Look for job by date of 'just posted' or 'today'
  // This will hopefully represent the most recent jobs
  let findDate;
  try {
    findDate = await page.$eval(
      'div.jobsearch-JobTab-content > div.jobsearch-JobMetadataFooter',
      (date) => date.textContent
    );
  } catch (error) {
    console.log('Error finding date: ', error);
  }
  // console.log({ findDate });
  let date;
  if (findDate.includes('Just posted') || findDate.includes('Today')) {
    date = Date.now();
  } else {
    date = 'old';
  }

  // Get title of the job position
  const title = await page.$eval(
    'h1.jobsearch-JobInfoHeader-title',
    (title) => title.textContent
  );
  const modifiedTitle = title.replace(/(\r\n|\n|\r)/gm, '').trim();

  // Get the company name for position
  let companyName;
  try {
    companyName = await page.$eval(
      '.jobsearch-InlineCompanyRating > div > a',
      (link) => link.textContent
    );
  } catch (error) {
    companyName = await page.$eval(
      '.jobsearch-InlineCompanyRating > div',
      (link) => link.textContent
    );
  }

  // Get the company location
  let location;
  try {
    location = await page.$eval(
      'div.jobsearch-CompanyInfoWithoutHeaderImage.jobsearch-CompanyInfoWithReview > div > div > div > div:nth-child(4)',
      (link) => link.textContent
    );
  } catch (error) {
    location = await page.$eval(
      '.jobsearch-InlineCompanyRating > div:nth-child(3)',
      (link) => link.textContent
    );
  }

  return {
    title: modifiedTitle,
    name: companyName,
    location,
    date,
  };
}

module.exports = {
  getLinks,
  getPageData,
};
