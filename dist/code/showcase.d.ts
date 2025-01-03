import { PaginationData } from "../types";
declare const configLargeSuffix: ({ millions, billions, }: {
    millions?: string;
    billions?: string;
}) => void, 
/** Process Number */
processNumbers: (rawInput: number | string, roundingLimit?: number) => string, 
/** AM/PM time = 00:00AM */
timeAMPM: (timeInput: string | number | Date) => string, 
/** Day Month Year = 23 June 2022 */
fullDateText: (timeInput: string | number | Date) => string, 
/** Shorten Text */
truncateText: (text: string, limit?: number) => string, 
/** Pagination Data */
paginationData: ({ pageSize, pageNo, totalNumber, }: {
    pageSize: string;
    pageNo: string;
    totalNumber?: string;
}) => PaginationData;
export { configLargeSuffix, processNumbers, timeAMPM, fullDateText, truncateText, paginationData };
