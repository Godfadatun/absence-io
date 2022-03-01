import { Utils } from '../src/controllers/learningTest';

describe('test', () => {
  test('should work', () => {
    const firstString = Utils.toUpperCase('abc');
    expect(firstString).toEqual('ABC');
  });
});

describe('url Test', () => {
  beforeAll(() => {
    console.log('beforeAll');
  });

  beforeEach(() => {
    console.log('beforeEach');
  });

  afterAll(() => {
    console.log('afterAll');
  });

  test('simple Url', () => {
    const parseUrl = Utils.parseUrl('https://www.udemy.com/course/unit-testing-typescript-nodejs/learn/lecture/22720911#reviews');
    expect(parseUrl.href).toEqual('https://www.udemy.com/course/unit-testing-typescript-nodejs/learn/lecture/22720911#reviews');
    expect(parseUrl.protocol).toEqual('https:');
    expect(parseUrl.query).toEqual({});
  });

  test('simple Url with query', () => {
    const parseUrl = Utils.parseUrl('https://www.udemy.com/course/unit-testing-typescript-nodejs/learn/lecture/22720911?user=user&password=pass');
    const expectedQuery = {
      user: 'user',
      password: 'pass',
    };
    expect(parseUrl.query).toEqual(expectedQuery);
    expect(parseUrl.protocol).toEqual('https:');
  });

  test('Check for bad Url', () => {
    function badUrl() {
      Utils.parseUrl('');
    }
    expect(badUrl).toThrowError('Invalid Url Passed');
  });

  test('Check for bad Url with try and catch', () => {
    try {
      Utils.parseUrl('');
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });
});
