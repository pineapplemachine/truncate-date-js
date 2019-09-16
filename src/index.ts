/**
 * The {@link truncateDate} function accepts one of these values as its
 * "unit" input.
 */
export type TruncateDateUnit = (
    "millisecond" |
    "second" |
    "minute" |
    "hour" |
    "day" |
    "month" |
    "year"
)

/**
 * Represents the types which the {@link truncateDate} function will
 * accept as a "value" input.
 */
export type TruncateDateValue = (
    number | // Time in milliseconds since unix epoch
    string | // Date constructor supported timestamp strings
    Date | // Instance of JS date object
    {toDate: (() => Date)} | // Moment or Day.js date object
    {toJSDate: (() => Date)} // Luxon date object
);

/**
 * Error message produced when calling {@link truncateDate} with an
 * unrecognized time unit argument.
 *
 * See {@link TruncateDateUnit} for a list of recognized time units.
 */
export const TruncateDateUnitErrorMessage = "Unrecognized time unit.";

/**
 * Error message produced when calling {@link truncateDate} with an
 * unrecognized time value argument.
 *
 * See {@link TruncateDateValue} for a list of recognized value types.
 */
export const TruncateDateValueErrorMessage = "Unrecognized time value.";
    
/**
 * This function can be used to truncate a date so that any precision
 * beyond the specified unit is lost.
 * Dates are truncated in the UTC timezone.
 *
 * @param unit Remove all precision beyond this unit.
 * For example, when the unit is "hour", the minutes, seconds, and
 * milliseconds will all be set to zero. In this case the hour, day,
 * month, and year will remain unchanged.
 *
 * @param value The date value which should be truncated.
 * The function accepts one of these value types:
 *
 * - Numeric value representing a number of milliseconds since Unix epoch.
 * - ISO 8601 timestamp string or other string input recognized by the
 * JavaScript Date constructor.
 * - A JavaScript Date instance.
 * - A moment date object.
 * - A Day.js date object.
 * - A luxon date object.
 *
 * When the input represents an invalid date, so will the output be an
 * invalid date.
 *
 * @returns The truncated time value, represented as a JavaScript
 * Date instance.
 */
export function truncateDate(
    unit: TruncateDateUnit,
    value: TruncateDateValue
): Date {
    // Convert date value input to milliseconds since unix epoch
    let time: number;
    if(typeof(value) === "number") {
        time = value;
    }
    else if(typeof(value) === "string") {
        time = new Date(value).getTime();
    }
    else if(value instanceof Date) {
        time = value.getTime();
    }
    else if(value && typeof(value) === "object" &&
        "toDate" in value && typeof(value.toDate) === "function"
    ) {
        const date = value.toDate();
        time = date instanceof Date ? date.getTime() : NaN;
    }
    else if(value && typeof(value) === "object" &&
        "toJSDate" in value && typeof(value.toJSDate) === "function"
    ) {
        const date = value.toJSDate();
        time = date instanceof Date ? date.getTime() : NaN;
    }
    else {
        throw new Error(TruncateDateValueErrorMessage);
    }
    // Immediately exit given an invalid date input
    if(!Number.isFinite(time)) {
        return new Date(time);
    }
    // Truncate to the specified unit
    if(unit === "millisecond") {
        return new Date(time);
    }
    else if(unit === "second") {
        return new Date(time - (time % 1000));
    }
    else if(unit === "minute") {
        return new Date(time - (time % 60000));
    }
    else if(unit === "hour") {
        return new Date(time - (time % 3600000));
    }
    else if(unit === "day") {
        return new Date(time - (time % 86400000));
    }
    else if(unit === "month") {
        const truncatedDate = new Date(time - (time % 86400000));
        truncatedDate.setUTCDate(1); // Set to first day of the month
        return truncatedDate;
    }
    else if(unit === "year") {
        const truncatedDate = new Date(time - (time % 86400000));
        truncatedDate.setUTCMonth(0); // Set to January
        truncatedDate.setUTCDate(1); // Set to first day of the month
        return truncatedDate;
    }
    else {
        throw new Error(TruncateDateUnitErrorMessage);
    }
}
