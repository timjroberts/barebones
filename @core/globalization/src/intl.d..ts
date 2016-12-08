declare module "intl"
{
    export class NumberFormat {
        constructor(locales: string | string[]);

        format(number: number): string;
    }

    export class DateTimeFormat {
        constructor(locales: string | string[]);

        format(dateTime: Date): string;
    }
}
