/**
 * @author David Menger
 */
'use strict';

const GoogleSpreadsheet = require('google-spreadsheet');

const INPUT_FIELD = 'userinputtextorinteraction-path';
const TEXTS_TEST_TITLE = 'NLP test';

/**
 * @typedef {object} TestCaseStep
 * @prop {number} step
 * @prop {number} rowNum
 * @prop {string} action
 * @prop {string} passedAction
 * @prop {string} textContains
 * @prop {string} quickRepliesContains
 * @prop {string} stepDescription
 */

/**
 * @typedef {object} TestCase
 * @prop {string} list
 * @prop {string} name
 * @prop {TestCaseStep[]} steps
 */

/**
 * Google sheets storage for test cases
 */
class TestsGsheet {


    /**
     *
     * @param {string} sheetId
     * @param {object} [googleToken]
     */
    constructor (sheetId, googleToken = null) {
        this._gs = new GoogleSpreadsheet(sheetId);
        this._googleToken = googleToken;
    }

    _authorize () {
        return new Promise((resolve, reject) => {
            this._gs.useServiceAccountAuth(this._googleToken, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            });
        });
    }

    _getInfo () {
        return new Promise((resolve, reject) => {
            this._gs.getInfo((err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            });
        });
    }

    _getRows (ws) {
        return new Promise((resolve, reject) => {
            ws.getRows({
                offset: 0,
                limit: ws.rowCount
            }, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            });
        });
    }

    /**
     * @returns {Promise<TestCase[]>}
     */
    async getTestCases () {
        if (this._googleToken) {
            await this._authorize();
        }
        const { worksheets } = await this._getInfo();

        const lists = await Promise.all(worksheets
            .map((ws) => this._getRows(ws)));

        const testCases = [];

        lists.forEach((rows, i) => {
            const sheet = worksheets[i];
            let testCase;
            let rowNum = 1;
            for (const row of rows) {
                rowNum++;
                if (row.text) {
                    if (!testCase || testCase.list !== sheet.title) {
                        testCase = testCases
                            .find((t) => t.list === sheet.title && t.name === TEXTS_TEST_TITLE);

                        if (!testCase) {
                            testCase = {
                                list: sheet.title,
                                name: TEXTS_TEST_TITLE,
                                texts: []
                            };
                            testCases.push(testCase);
                        }
                    }

                    testCase.texts.push({
                        text: row.text,
                        intent: row.intent || null,
                        action: row.action || null,
                        appId: row.appid || null
                    });
                } else if (!testCase || (row.testcase && !row[INPUT_FIELD])) {
                    testCase = {
                        list: sheet.title,
                        name: row.testcase,
                        steps: []
                    };
                    testCases.push(testCase);
                } else {
                    const action = row[INPUT_FIELD];
                    const {
                        firstinteractionpathofchatbotresponse: passedAction = '',
                        chatbottextreactionscontains: textContains = '',
                        quickrepliestextscontains: quickRepliesContains = '',
                        inputdescription: stepDescription = ''
                    } = row;
                    testCase.steps.push({
                        step: testCase.steps.length + 1,
                        rowNum,
                        action,
                        passedAction,
                        textContains,
                        quickRepliesContains,
                        stepDescription
                    });
                }
            }
        });

        return testCases;
    }
}

module.exports = TestsGsheet;
