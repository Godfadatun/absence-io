import urlShortener from '../src/controllers/urlShortener';

describe('Testing urlShortner Controller', () => {
  test('Testing encodeUrl function', async () => {
    const response = await urlShortener.encodeUrl(
      'https://www.udemy.com/course/unit-testing-typescript-nodejs/learn/lecture/22720911?user=user&password=pass',
    );
    expect(response.success).toBe(true);
    expect(response.message).toBe(`Url Encoded successfully`);
    expect(response).toHaveProperty('success', true);
    expect(response).toHaveProperty('data');
    expect(response).toBeDefined();
  });
});
