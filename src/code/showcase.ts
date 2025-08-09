import { PaginationData } from "../types";

const
    largeSuffix = {
        millions: `m`,
        billions: `b`,
    },
    configLargeSuffix = ({
        millions,
        billions,
    }: {
        millions?: string,
        billions?: string,
    }) => {
        if (millions) largeSuffix.millions;
        if (billions) largeSuffix.billions;
    },
    /** Process Number */
    processNumbers = (rawInput: number | string | bigint, roundingLimit = 3) => {
        rawInput = rawInput?.toString();
        const checkNumber = Number(rawInput);
        if (!rawInput || !checkNumber) return `${rawInput || ``}`;
        const
            absoluteNumber = Math.abs(checkNumber),
            processRounding = (input: string | number) => {
                const
                    checkNumber = Number(input),
                    absoluteNumber = checkNumber ? Math.abs(checkNumber) : 0,
                    roundingCheck = absoluteNumber > 1 && roundingLimit ? roundingLimit - (Math.round(absoluteNumber) + "").length : 0;
                return checkNumber ? (checkNumber < 0 ? -1 : 1) * (
                    Number.isInteger(absoluteNumber)
                        || absoluteNumber < 1e-16 ? absoluteNumber
                        : absoluteNumber > 1e5 ? Math.round(absoluteNumber)
                            : absoluteNumber > 1 ? Number(
                                absoluteNumber.toFixed(roundingCheck < 0 ? 0 : roundingCheck)
                            ) : ((input: number) => {
                                let t = 0;
                                for (const step of [
                                    1, .1, .01, .001, 1e-4, 1e-5, 1e-6, 1e-7, 1e-8, 1e-9, 1e-10,
                                    1e-11, 1e-12, 1e-13, 1e-14, 1e-15, 1e-16, 1e-17, 1e-18, 1e-19
                                ]) {
                                    if (step < input)
                                        return Number(input.toFixed(roundingLimit + t - 1)); t++
                                };
                                return input
                            })(absoluteNumber)
                ) : +input
            },
            processFractions = (input: number) => {
                const checkNumber = `${processRounding(input)}`.split(".");
                checkNumber[0] = checkNumber[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                return checkNumber.join(".")
            };
        return `${checkNumber < 0 ? `-` : ``}${absoluteNumber > 1e9 ?
            `${processFractions(absoluteNumber / 1e9)}${largeSuffix.billions}`
            : absoluteNumber > 1e6 ? `${processFractions(absoluteNumber / 1e6)}${largeSuffix.billions}`
                : absoluteNumber < 1e-6 && absoluteNumber > 1e-16 ?
                    (1 + processRounding(absoluteNumber) + ``)?.replace(/1./g, "0.")
                    : processFractions(absoluteNumber)
            }`
    },
    /** AM/PM time = 00:00AM */
    timeAMPM = (timeInput: string | number | Date) => {
        const
            doubleDigit = (rawNumber: string | number) =>
                Number(rawNumber) == 0 ? `00`
                    : Number(rawNumber) < 10 && Number(rawNumber) >= 1 ? `0` + rawNumber
                        : `` + rawNumber,
            time = new Date(timeInput),
            hours = time.getHours();
        return doubleDigit(hours > 12 ? hours - 12 : hours)
            + `:${doubleDigit(time.getMinutes())}`
            + (hours >= 12 ? `PM` : `AM`);
    },
    /** Day Month Year = 23 June 2022 */
    fullDateText = (timeInput: string | number | Date) => {
        const
            monthsNames = [
                `January`, `February`, `March`,
                `April`, `May`, `June`,
                `July`, `August`, `September`,
                `October`, `November`, `December`
            ],
            time = new Date(timeInput);
        return `${time.getDate()} ${monthsNames[time.getMonth()]} ${time.getFullYear()}`;
    },
    /** Shorten Text */
    truncateText = (text: string, limit = 5) => !text?.length || text?.length < ((limit * 2) + 2) ? text
        : `${text.substring(0, limit)}...${text.substring(text?.length - limit, text?.length)}`,
    /** Pagination Data */
    paginationData = ({
        pageSize,
        pageNo,
        totalNumber,
    }: {
        pageSize: string,
        pageNo: string,
        totalNumber?: string,
    }): PaginationData => {
        const
            totalPages = Math.ceil((+(totalNumber || `0`) || 1) / +pageSize)?.toFixed(0),
            previousDisabled = +pageNo <= 0,
            nextDisabled = +pageNo + 1 >= +totalPages;
        return {
            currentPage: (+pageNo + 1)?.toString(),
            previousPage: previousDisabled ? undefined : (+pageNo - 1)?.toFixed(0),
            nextPage: nextDisabled ? undefined : (+pageNo + 1)?.toFixed(0),
            totalPages,
        };
    };

export {
    configLargeSuffix,
    processNumbers,
    timeAMPM,
    fullDateText,
    truncateText,
    paginationData
}