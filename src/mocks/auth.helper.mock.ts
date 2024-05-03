export default () => ({
  generateForgotActionToken: jest.fn(),
  encodePassword: jest.fn(),
  decode: jest.fn(),
  verifyForgotActionToken: jest.fn(),
  isPasswordValid: jest.fn(),
  generateTokenPair: jest.fn(),
  verifyRefreshToken: jest.fn(),
});
