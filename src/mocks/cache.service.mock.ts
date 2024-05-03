export default () => ({
  get: jest.fn((key) => {
    return key;
  }),
  set: jest.fn((key, value, options) => {
    return { key, value, options };
  }),
  delete: jest.fn((key) => {
    return key;
  }),
});
