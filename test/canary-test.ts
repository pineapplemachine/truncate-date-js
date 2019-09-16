import {strict as assert} from "assert";

import {Group} from "canary-test";

const canary = Group("@pinemach/truncate-date");

import * as moment from "moment";
import * as luxon from "luxon";
import * as dayjs from "dayjs";

import {truncateDate, TruncateDateValue} from "../src/index";
import {TruncateDateUnitErrorMessage, TruncateDateValueErrorMessage} from "../src/index";

function testCommon(mapDateValue: ((date: Date) => TruncateDateValue)): void {
    const testDate = mapDateValue(new Date("2020-04-15T12:30:15.123Z"));
    assert.equal(
        truncateDate("millisecond", testDate).getTime(),
        new Date("2020-04-15T12:30:15.123Z").getTime()
    );
    assert.equal(
        truncateDate("second", testDate).getTime(),
        new Date("2020-04-15T12:30:15.000Z").getTime()
    );
    assert.equal(
        truncateDate("minute", testDate).getTime(),
        new Date("2020-04-15T12:30:00.000Z").getTime()
    );
    assert.equal(
        truncateDate("hour", testDate).getTime(),
        new Date("2020-04-15T12:00:00.000Z").getTime()
    );
    assert.equal(
        truncateDate("day", testDate).getTime(),
        new Date("2020-04-15T00:00:00.000Z").getTime()
    );
    assert.equal(
        truncateDate("month", testDate).getTime(),
        new Date("2020-04-01T00:00:00.000Z").getTime()
    );
    assert.equal(
        truncateDate("year", testDate).getTime(),
        new Date("2020-01-01T00:00:00.000Z").getTime()
    );
}

canary.test("truncate JS date object input", function() {
    testCommon(i => i);
});

canary.test("truncate numeric Unix timestamp input", function() {
    testCommon(i => i.getTime());
});

canary.test("truncate ISO 8601 date string input", function() {
    testCommon(i => i.toISOString());
});

canary.test("truncate moment date object input", function() {
    testCommon(i => moment(i));
});

canary.test("truncate dayjs date object input", function() {
    testCommon(i => luxon.DateTime.fromJSDate(i, {zone: "utc"}));
});

canary.test("invalid date inputs produce invalid date outputs", function() {
    assert(Number.isNaN(truncateDate("second", NaN).getTime()));
    assert(Number.isNaN(truncateDate("second", +Infinity).getTime()));
    assert(Number.isNaN(truncateDate("second", -Infinity).getTime()));
    assert(Number.isNaN(truncateDate("second", new Date(NaN)).getTime()));
});

canary.test("unrecognized units produce a helpful error", function() {
    let errorMessage: string = "";
    try {
        truncateDate(<any> "shakes of a lamb's tail", new Date());
    }
    catch(error) {
        errorMessage = error.message;
    }
    assert.equal(errorMessage, TruncateDateUnitErrorMessage);
});

canary.test("unrecognized values produce a helpful error", function() {
    let errorMessage: string = "";
    try {
        truncateDate("minute", <any> ["Arrays", "aren't", "recognized", "as", "dates"]);
    }
    catch(error) {
        errorMessage = error.message;
    }
    assert.equal(errorMessage, TruncateDateValueErrorMessage);
});

canary.doReport();
