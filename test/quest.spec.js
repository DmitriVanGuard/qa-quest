const puppeteer = require('puppeteer');
const { expect } = require('chai');

const opts = {
	headless: true,
	timeout: 10000
};

describe('Requirements section suite', function() {
	let page;
	let browser;

	beforeEach(async function() {
		browser = await puppeteer.launch(opts);
		page = await browser.newPage();
		await page.goto('http://blog.csssr.ru/qa-engineer/', { waitUntil: 'load' });
	});

	afterEach(async () => await browser.close());

	it('Requirement checkboxes should remain checked after double-clicking on them', async function() {
		const infoSection = await page.$('.info');

		const couldBeUnchecked = await infoSection.$$eval(
			'[type="checkbox"]',
			checkboxes =>
				checkboxes.some(
					checkbox => checkbox.click() && checkbox.click() && checkbox.checked
				)
		);

		expect(couldBeUnchecked).to.be.true;
	});

	it('Double click on menu tab should not change information display style to "none"', async function() {
		const TAB = 'errors';

		const currentTab = await page.$(`.graphs-${TAB} a`);
		await currentTab.click();
		await page.waitFor(1000);
		await currentTab.click();
		await page.waitFor(1000);

		const displayStyle = await page.$eval(
			`.info-${TAB}`,
			tab => tab.style.display
		);

		expect(displayStyle).to.equal('block');
	});

	it('Software link should redirect to correct URL', async function() {
		const CORRECT_URL = new RegExp('^http://monosnap.com');

		const href = await page.$eval('label[for="soft"] a', link => link.href);

		expect(href).to.match(CORRECT_URL);
	});
});
