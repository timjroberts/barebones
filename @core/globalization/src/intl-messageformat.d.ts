declare module "intl-messageformat"
{
    export default class IntlMessageFormat
    {
        constructor(message: string, locales: string | string[], formats?: any);
        format(context?: any): string;
    }
}
