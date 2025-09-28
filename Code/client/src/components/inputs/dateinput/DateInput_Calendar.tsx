import { useMemo, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/16/solid";
import { dateHelper } from "@/helpers/date/dateHelper";
import { DateParts, months } from "@/helpers/date/dateTypes";
import PopupPanel from "@/components/PopupPanel";

const _weekdays = ["S", "M", "T", "W", "T", "F", "S"];

interface Day {
    key: number;
    year: number;
    month: number;
    day: number;
}

interface Props {
    relative: HTMLElement,
    trigger: HTMLButtonElement | null;
    value: DateParts | null;
    onChange: (value: DateParts) => void;
    onClose: (escPressed: boolean) => void;
}

export default function DateInput_Calendar({ relative, trigger, value, onChange, onClose }: Props) {
    const now = new Date();

    const [{ currentYear, currentMonth }, setCurrentMonth] = useState(() => ({
        currentYear: value?.year ?? now.getFullYear(),
        currentMonth: getMonth(value?.month ?? (now.getMonth() + 1))
    }));

    const days = useMemo(() => getDays(currentYear, currentMonth.number), [currentYear, currentMonth]);

    function selectDay(newYear: number, newMonth: number, newDay: number) {
        if (newMonth != currentMonth.number) {
            setCurrentMonth({
                currentYear: newYear,
                currentMonth: getMonth(newMonth)
            });
        }
        onChange({
            year: newYear,
            month: newMonth,
            day: newDay
        });
    }

    function selectNextMonth() {
        const newMonth = currentMonth.number < 12 ? currentMonth.number + 1 : 1;
        const newYear = currentMonth.number < 12 ? currentYear : currentYear + 1;

        setCurrentMonth({
            currentYear: newYear,
            currentMonth: getMonth(newMonth)
        });
    }

    function selectPrevMonth() {
        const newMonth = currentMonth.number > 1 ? currentMonth.number - 1 : 12;
        const newYear = currentMonth.number > 1 ? currentYear : currentYear - 1;

        setCurrentMonth({
            currentYear: newYear,
            currentMonth: getMonth(newMonth)
        });
    }
    
    return (
        <PopupPanel
            relative={relative}
            trigger={trigger}
            className="w-72 p-5"
            onClose={onClose}
        >
            <header className="pb-1 flex items-center justify-between">
                <div className="font-bold text-base">
                    {currentMonth.name} {currentYear}
                </div>
                <div>
                    <button
                        type="button"
                        tabIndex={-1}
                        className="w-8 p-1.5 rounded-full hover:bg-gray-hover me-2"
                        title="Previous Month"
                        onClick={selectPrevMonth}
                    >
                        <ChevronLeftIcon />
                    </button>
                    <button
                        type="button"
                        tabIndex={-1}
                        className="w-8 p-1.5 rounded-full hover:bg-gray-hover"
                        title="Next Month"
                        onClick={selectNextMonth}
                    >
                        <ChevronRightIcon />
                    </button>
                </div>
            </header>
            <div className="
                grid grid-cols-7 gap-1 text-center text-xs

                [&>div]:w-8 [&>div]:h-8 [&>div]:flex [&>div]:items-center [&>div]:justify-center [&>div]:font-bold [&>div]:text-description-text

                [&>button]:transition
                [&>button]:w-8 [&>button]:h-8 [&>button]:rounded-full [&>button]:outline-none
                hover:[&>button]:bg-gray-hover
                focus:[&>button]:bg-gray-hover
                data-[now]:[&>button]:border data-[now]:[&>button]:border-gray-border
                data-[other-month]:[&>button]:text-gray-disabled
                data-[selected]:[&>button]:bg-blue-bg data-[selected]:[&>button]:text-contrast-text data-[selected]:data-[other-month]:[&>button]:text-contrast-text
            ">
                {_weekdays.map((d, index) => (
                    <div key={index}>
                        {d}
                    </div>
                ))}
                {days.map(d => (
                    <button
                        key={d.key}
                        type="button"
                        tabIndex={-1}
                        data-other-month={d.month !== currentMonth.number ? true : undefined}
                        data-now={d.year === now.getFullYear() && d.month === now.getMonth() + 1 && d.day === now.getDate() ? true : undefined}
                        data-selected={value && d.year === value.year && d.month === value.month && d.day === value.day ? true : undefined}
                        onClick={() => selectDay(d.year, d.month, d.day)}
                    >
                        {d.day}
                    </button>
                ))}
            </div>
        </PopupPanel>
    );
}

function getDays(year: number, month: number): Day[] {
    const days: Day[] = [];

    const daysInMonth = dateHelper.getDaysInMonth(year, month);
    const firstDayOfWeek = new Date(year, month - 1, 1).getDay();
    const lastDayOfWeek = new Date(year, month - 1, daysInMonth).getDay();

    if (firstDayOfWeek !== 0) {
        const prevYear = month > 1 ? year : year - 1;
        const prevMonth = month > 1 ? month - 1 : 12;
        const prevDaysInMonth = dateHelper.getDaysInMonth(prevYear, prevMonth);

        for (let i = 0; i < firstDayOfWeek; i++) {
            const prevDay = prevDaysInMonth - firstDayOfWeek + i + 1;
            days.push({ key: prevMonth * 100 + prevDay, year: prevYear, month: prevMonth, day: prevDay});
        }
    }

    for (let i = 1; i <= daysInMonth; i++) {
        days.push({ key: month * 100 + i, year, month, day: i});
    } 

    if (lastDayOfWeek !== 6) {
        const nextYear = month < 12 ? year : year + 1;
        const nextMonth = month < 12 ? month + 1 : 1;

        for (let i = lastDayOfWeek; i < 6; i++) {
            const nextDay = i - lastDayOfWeek + 1;
            days.push({ key: nextMonth * 100 + nextDay, year: nextYear, month: nextMonth, day: nextDay});
        }
    }

    return days;
}

function getMonth(month: number) {
    if (month < 1 || month > 12) {
        throw new Error(`Invalid month: ${month}`);
    }
    return months[month - 1];
}