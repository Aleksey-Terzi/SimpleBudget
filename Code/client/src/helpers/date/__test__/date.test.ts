import { _dateParser } from "../_dateParser";
import { dateHelper } from "../dateHelper";

it("_dateParser.splitText", () => {
    expect(_dateParser.splitText(null)).toEqual(null);
    expect(_dateParser.splitText(undefined)).toEqual(null);
    expect(_dateParser.splitText("")).toEqual(null);
    expect(_dateParser.splitText("/,\\   ")).toEqual(null);
    expect(_dateParser.splitText("12/25/2005")).toEqual(["12", "25", "2005"]);
    expect(_dateParser.splitText("/12/,/-25, /-2005/  ")).toEqual(["12", "25", "2005"]);
    expect(_dateParser.splitText("Dec 25, 2005")).toEqual(["Dec", "25", "2005"]);
});

it("_dateParser.getDaysInMonth", () => {
    expect(_dateParser.getDaysInMonth(2025, 1)).toEqual(31);
    expect(_dateParser.getDaysInMonth(2025, 2)).toEqual(28);
    expect(_dateParser.getDaysInMonth(2025, 3)).toEqual(31);
    expect(_dateParser.getDaysInMonth(2025, 4)).toEqual(30);
    expect(_dateParser.getDaysInMonth(2025, 5)).toEqual(31);
    expect(_dateParser.getDaysInMonth(2025, 6)).toEqual(30);
    expect(_dateParser.getDaysInMonth(2025, 7)).toEqual(31);
    expect(_dateParser.getDaysInMonth(2025, 8)).toEqual(31);
    expect(_dateParser.getDaysInMonth(2025, 9)).toEqual(30);
    expect(_dateParser.getDaysInMonth(2025, 10)).toEqual(31);
    expect(_dateParser.getDaysInMonth(2025, 11)).toEqual(30);
    expect(_dateParser.getDaysInMonth(2025, 12)).toEqual(31);
});

it("_dateParser.parsers  - mm/dd/yyyy", () => {
    expect(_dateParser.parsers["mm/dd/yyyy"](["12", "25", "2025"])).toEqual({ day: 25, month: 12, year: 2025 });
    expect(_dateParser.parsers["mm/dd/yyyy"](["12", "25"])).toEqual({ day: 25, month: 12, year: new Date().getFullYear() });
    expect(_dateParser.parsers["mm/dd/yyyy"](["02", "28", "2025"])).toEqual({ day: 28, month: 2, year: 2025 });
    expect(_dateParser.parsers["mm/dd/yyyy"](["02", "29", "2025"])).toEqual(null);
    expect(_dateParser.parsers["mm/dd/yyyy"](["00", "28", "2025"])).toEqual(null);
    expect(_dateParser.parsers["mm/dd/yyyy"](["15", "28", "2025"])).toEqual(null);
    expect(_dateParser.parsers["mm/dd/yyyy"](["12", "-1", "2025"])).toEqual(null);
    expect(_dateParser.parsers["mm/dd/yyyy"](["12", "28", "20"])).toEqual(null);
});

it("_dateParser.parsers  - yyyy-mm-dd", () => {
    expect(_dateParser.parsers["yyyy-mm-dd"](["2025", "12", "25"])).toEqual({ day: 25, month: 12, year: 2025 });
    expect(_dateParser.parsers["yyyy-mm-dd"](["2025", "02", "28"])).toEqual({ day: 28, month: 2, year: 2025 });
    expect(_dateParser.parsers["yyyy-mm-dd"](["2025", "02"])).toEqual(null);
    expect(_dateParser.parsers["yyyy-mm-dd"](["2025", "02", "29"])).toEqual(null);
    expect(_dateParser.parsers["yyyy-mm-dd"](["2025", "00", "28"])).toEqual(null);
    expect(_dateParser.parsers["yyyy-mm-dd"](["2025", "15", "28"])).toEqual(null);
    expect(_dateParser.parsers["yyyy-mm-dd"](["2025", "12", "-1"])).toEqual(null);
    expect(_dateParser.parsers["yyyy-mm-dd"](["20", "12", "28"])).toEqual(null);
});

it("_dateParser.parsers  - mmm d, yyyy", () => {
    expect(_dateParser.parsers["mmm d, yyyy"](["Dec", "25", "2025"])).toEqual({ day: 25, month: 12, year: 2025 });
    expect(_dateParser.parsers["mmm d, yyyy"](["December", "25"])).toEqual({ day: 25, month: 12, year: new Date().getFullYear() });
    expect(_dateParser.parsers["mmm d, yyyy"](["Feb", "28", "2025"])).toEqual({ day: 28, month: 2, year: 2025 });
    expect(_dateParser.parsers["mmm d, yyyy"](["Feb", "29", "2025"])).toEqual(null);
    expect(_dateParser.parsers["mmm d, yyyy"](["Feby", "28", "2025"])).toEqual(null);
    expect(_dateParser.parsers["mmm d, yyyy"](["Dec", "-1", "2025"])).toEqual(null);
    expect(_dateParser.parsers["mmm d, yyyy"](["Dec", "28", "20"])).toEqual(null);
});

it("dateHelper.isSeparator", () => {
    expect(dateHelper.isSeparator("/")).toEqual(true);
    expect(dateHelper.isSeparator("\\")).toEqual(true);
    expect(dateHelper.isSeparator("-")).toEqual(true);
    expect(dateHelper.isSeparator(" ")).toEqual(true);
    expect(dateHelper.isSeparator(",")).toEqual(true);
    expect(dateHelper.isSeparator(".")).toEqual(false);
});

it("dateHelper.parse", () => {
    expect(dateHelper.parse("2025-12-25", "yyyy-mm-dd")).toEqual({ day: 25, month: 12, year: 2025 });
    expect(dateHelper.parse("2025-12-25", "mm/dd/yyyy")).toEqual(null);
    expect(dateHelper.parse("12/25/2025")).toEqual({ day: 25, month: 12, year: 2025 });
    expect(dateHelper.parse("2-27-2025")).toEqual({ day: 27, month: 2, year: 2025 });
    expect(dateHelper.parse("Apr 15, 2025")).toEqual({ day: 15, month: 4, year: 2025 });
    expect(dateHelper.parse("January 10, 2023")).toEqual({ day: 10, month: 1, year: 2023 });
    expect(dateHelper.parse("May 10")).toEqual({ day: 10, month: 5, year: new Date().getFullYear() });
    expect(dateHelper.parse("May")).toEqual(null);
    expect(dateHelper.parse("Janu 10, 2023")).toEqual(null);
    expect(dateHelper.parse("")).toEqual(null);
    expect(dateHelper.parse(undefined)).toEqual(null);
    expect(dateHelper.parse(null)).toEqual(null);
});

it("dateHelper.format", () => {
    expect(dateHelper.format({ day: 15, month: 4, year: 2025 }, "mmm d, yyyy")).toEqual("Apr 15, 2025");
    expect(dateHelper.format({ day: 25, month: 9, year: 2023 }, "mmm d, yyyy")).toEqual("Sep 25, 2023");
    expect(dateHelper.format({ day: 29, month: 2, year: 2025 }, "mmm d, yyyy")).toEqual(null);
    expect(dateHelper.format(null, "mmm d, yyyy")).toEqual(null);
    expect(dateHelper.format({ day: 15, month: 4, year: 2025 }, "mm/dd/yyyy")).toEqual("04/15/2025");
    expect(dateHelper.format({ day: 25, month: 11, year: 2023 }, "mm/dd/yyyy")).toEqual("11/25/2023");
    expect(dateHelper.format({ day: 29, month: 2, year: 2025 }, "mm/dd/yyyy")).toEqual(null);
    expect(dateHelper.format(null, "mm/dd/yyyy")).toEqual(null);
    expect(dateHelper.format({ day: 15, month: 4, year: 2025 }, "yyyy-mm-dd")).toEqual("2025-04-15");
    expect(dateHelper.format({ day: 25, month: 11, year: 2023 }, "yyyy-mm-dd")).toEqual("2023-11-25");
    expect(dateHelper.format({ day: 29, month: 2, year: 2025 }, "yyyy-mm-dd")).toEqual(null);
    expect(dateHelper.format(null, "yyyy-mm-dd")).toEqual(null);
});