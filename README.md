# Google Sheet Storage for Test Cases

Fast solution for automated conversation tests

*Example testing sheet: https://docs.google.com/spreadsheets/d/1Tl1-NvGO0buR1z1YoB0eYutJ9EdpcXr-DFPuiUxg3Fg/edit#gid=0*

## Usage

```javascript
const { ConversationTester } = require('wingbot');
const { TestsGsheet } = require('wingbot-jwt');
const googleToken = require('./my-google-token.json');

function botFactory (forTests = false) {
    const bot = new Router();

    // your bot here

    return bot;
}

const testsStorage = new TestsGsheet('sheet-id', googleToken);
const tester = new ConversationTester(testsStorage, botFactory);

tester.test()
    .then((res) => console.log(res.output))
    .catch((e) => console.error(e));
```

-----------------

# API
## Classes

<dl>
<dt><a href="#TestsGsheet">TestsGsheet</a></dt>
<dd><p>Google sheets storage for test cases</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#TestCaseStep">TestCaseStep</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#TestCase">TestCase</a> : <code>object</code></dt>
<dd></dd>
</dl>

<a name="TestsGsheet"></a>

## TestsGsheet
Google sheets storage for test cases

**Kind**: global class  

* [TestsGsheet](#TestsGsheet)
    * [new TestsGsheet(sheetId, googleToken)](#new_TestsGsheet_new)
    * [.getTestCases()](#TestsGsheet+getTestCases) ⇒ <code>Promise.&lt;Array.&lt;TestCase&gt;&gt;</code>

<a name="new_TestsGsheet_new"></a>

### new TestsGsheet(sheetId, googleToken)

| Param | Type |
| --- | --- |
| sheetId | <code>string</code> | 
| googleToken | <code>object</code> | 

<a name="TestsGsheet+getTestCases"></a>

### testsGsheet.getTestCases() ⇒ <code>Promise.&lt;Array.&lt;TestCase&gt;&gt;</code>
**Kind**: instance method of [<code>TestsGsheet</code>](#TestsGsheet)  
<a name="TestCaseStep"></a>

## TestCaseStep : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type |
| --- | --- |
| step | <code>number</code> | 
| rowNum | <code>number</code> | 
| action | <code>string</code> | 
| passedAction | <code>string</code> | 
| textContains | <code>string</code> | 
| quickRepliesContains | <code>string</code> | 
| stepDescription | <code>string</code> | 

<a name="TestCase"></a>

## TestCase : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type |
| --- | --- |
| list | <code>string</code> | 
| name | <code>string</code> | 
| steps | [<code>Array.&lt;TestCaseStep&gt;</code>](#TestCaseStep) | 

