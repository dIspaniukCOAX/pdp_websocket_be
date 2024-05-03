export default () => ({
  sendForgotPasswordEmail: jest.fn(),
  sendPasswordChangedEmail: jest.fn(),
  sendNewLoginEmail: jest.fn(),
  sendRegisteredEmail: jest.fn(),
});
