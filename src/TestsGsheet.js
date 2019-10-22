/**
 * @author David Menger
 */
'use strict';

const GoogleSpreadsheet = require('google-spreadsheet');

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
     * @param {object} googleToken
     */
    constructor (sheetId, googleToken) {
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
                if (!testCase || (row.testcase && !row['userinputtextorinteraction-path'])) {
                    testCase = {
                        list: sheet.title,
                        name: row.testcase,
                        steps: []
                    };
                    testCases.push(testCase);
                } else {
                    const action = row['userinputtextorinteraction-path'];
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
