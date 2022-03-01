/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { UrlWithParsedQuery, parse } from 'url';

export class Utils {
  /**
   * static toUpperCase
   * @param arg convert to uperstring
   * @return empty string
   */
  public static toUpperCase(arg: string): string {
    return arg.toUpperCase();
  }

  public static parseUrl(url: string): UrlWithParsedQuery {
    if (!url) throw new Error('Invalid Url Passed');
    return parse(url, true);
  }
}
