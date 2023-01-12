/*
 * @author David Menger
 */
'use strict';

// const assert = require('assert');
const { TestsGsheet } = require('../src/main');
// @ts-ignore
const googleToken = require('../google-token.json');

describe('<TestsGsheet>', function () {

    describe('#getTestCases()', () => {

        it('works', async () => {

            const tg = new TestsGsheet('1Tl1-NvGO0buR1z1YoB0eYutJ9EdpcXr-DFPuiUxg3Fg', googleToken);

            tg.getTestCases();

        });

    });

});
