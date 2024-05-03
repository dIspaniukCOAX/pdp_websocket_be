export default () => ({
  get: jest.fn((key: string) => {
    return key;
  }),
  set: jest.fn((key, value, options?: { ttl: number }) => {
    return { key, value, options };
  }),
  del: jest.fn((key: string) => {
    return key;
  }),
});
