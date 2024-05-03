export default () => ({
  get: jest.fn((key: string) => {
    return process.env[key];
  }),
});
