require('custom-env').env();
const puppeteer = require('puppeteer-extra');
// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin())
async function readGmail() {
    const browser = await puppeteer.launch({
        headless: false,  // Change to true for headless mode,
        executablePath: '/usr/bin/google-chrome'
    });
    const page = await browser.newPage();

    try {
        //goto is used when we want to add redirection
        await page.goto('https://mail.google.com/', { waitUntil: 'networkidle2' });
        // Add your Gmail credentials
        await page.waitForSelector('input[type="email"]');
        //page.type is used when we want to type some keyword
        await page.type('input[type="email"]', '<Your-Email>');
        //page.click is used when we want to click the page
        await page.click('#identifierNext');
        await page.waitForTimeout(2000); // Wait for the next page to load

        await page.waitForSelector('input[type="password"]');
        await page.type('input[type="password"]', '<your-password>'); // Replace with your Gmail password
        await page.click('#passwordNext');

        await page.waitForNavigation();
        await page.click('[data-tooltip="spam"]');

        // Wait for email list to load
        await page.waitForSelector('[role="main"] [role="grid"]');

        // Select all emails (example selector, adapt for your provider)
        let selectAllCheckbox = await page.waitForSelector('[role="button"][data-tooltip="Select"]');
        await selectAllCheckbox.click();

        // Click delete button (example selector, adapt for your provider)
        const deleteButton = await page.$('[aria-label="Delete"]');
        await deleteButton.click();

        // Confirm deletion if necessary
        const confirmDeleteButton = await page.$('[aria-label="Delete"]');
        await confirmDeleteButton.click();
    } catch (error) {
        console.error('An error occurred:', error);
    } finally {
        // await browser.close();
    }
}
/**
 * Function for Scrolling Page Up/Down
 * @param {Number} scrollingRange no of how much scroll
 * @param {Object} page web page instance
 * @returns
 */
const applyScrolling = async (page, scrollingRange) => {
    try {
        console.log("applyScrolling");
        // const scrollingRangeArray = [16, 19, 22];
        // Wait While Scroll Page
        // const scrollingRange = randomValue(scrollingRangeArray);
        for (let index = 0; index < scrollingRange; index++) {
            await page.keyboard.press("ArrowDown", {
                delay: 120,
            });
        }
        const waitDuringScrollUpRangeArray = [
            4000, 4500, 4600, 4700, 4800, 5000,
        ];
        // Get random time to wait for before scroll pageUp.
        const waitDuringScrollUp = randomValue(waitDuringScrollUpRangeArray);
        await page.waitForTimeout(waitDuringScrollUp);
        // Scroll pageUp
        for (let index = 0; index < scrollingRange - 1; index++) {
            await page.keyboard.press("ArrowUp", {
                delay: 120,
            });
        }
        const waitDuringScrollRangeArrayay = [
            2000, 2200, 2400, 2600, 2800, 3000, 3200, 3400,
        ];
        // Get random time to wait.
        const waitDuringScroll = randomValue(waitDuringScrollRangeArrayay);
        await page.waitForTimeout(waitDuringScroll);
    } catch (error) {
        console.log(error);
        console.log(`Error from scrolling page.`);
    }
};

/**
 * Function for Scrolling PageDown
 * @param {Number} scrollingRange range of scroll
 * @param {Object} page enter page instance
 */
const applyScrollingDown = async (page, scrollingRange) => {
    console.log("applyScrollingDown");
    // const scrollingRangeArray = [16, 19, 22];
    // Wait While Scroll Page
    // const scrollingRange = randomValue(scrollingRangeArray);
    for (let index = 0; index < scrollingRange; index++) {
        await page.keyboard.press("ArrowDown", {
            delay: 120,
        });
    }
    // const waitDuringScrollUpRangeArray = [1000, 1500, 2000];
    // Get random time to wait for before scroll pageUp.
    // const waitDuringScrollUp = randomValue(waitDuringScrollUpRangeArray);
    // await page.waitForTimeout(waitDuringScrollUp);
};

/**
 * Function for writeInputField
 * @param {object} page reference of page
 * @param {Object} cursor mouse cursor
 * @param {string} element elementName
 * @param {String} inputValue fieldInputValue
 * @param {boolean} noTypo noTypo
 * @returns
 */
const writeInputField = async (page, cursor, element, inputValue, noTypo) => {
    try {
        console.log(`element =>`, element);
        // Sometimes the script needs to stop, to simulate someone reading the page
        const ratioToHoldOnPage = parseFloat(Math.random().toFixed(1));

        // Check if ratio of hold on page is less than 0.5 then set random wait on input field.
        if (ratioToHoldOnPage <= 0.5) {
            const waitTimeRangeArray = [
                1000, 1200, 1700, 1400, 1500, 1600, 1800, 1900,
            ];
            const waitTime = randomValue(waitTimeRangeArray);
            await page.waitForTimeout(waitTime);
        }
        // wait for the page to finish loading
        await page.waitForSelector(element);
        // Move mouse cursor to passed element.
        await cursor.move(element);
        // Click on a passed element.
        await page.click(element);
        
        // Set passed element instance.
        const elementInstance = await page.$(element);

        const waitForTypingRangeArray = [1000, 1800, 1900, 1600, 2100, 2000];
        // Get random time to wait for before starting actual typing.
        const waitTimeBeforeStartTyping = randomValue(waitForTypingRangeArray);
        await page.waitForTimeout(waitTimeBeforeStartTyping);

        // If element value is not set then return without processing further otherwise process next.
        if (!inputValue || inputValue == "") {
            return;
        }

        // withoutTypo to type
        if (noTypo) {
            await _applyWithOutTypoField(elementInstance, inputValue, page);
            return;
        }
        await _applySingleCharTypo(elementInstance, inputValue, page);
        // need to Wait After Typing field
        const timeToWaitAfterTypingRangeArray = [950, 1000, 1100, 1200, 1250];
        const waitTimeAfterTypingDone = randomValue(
            timeToWaitAfterTypingRangeArray
        );
        await page.waitForTimeout(waitTimeAfterTypingDone);
        return;
    } catch (e) {
        console.log("error from writeInputField =>", e);
        throw e;
    }
};


readGmail();
