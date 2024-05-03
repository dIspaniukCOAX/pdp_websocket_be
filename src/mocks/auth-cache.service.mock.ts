export default () => ({
  getUserIdByRefreshToken: jest.fn(),
  setRefreshToken: jest.fn(),
  deleteRefreshToken: jest.fn(),
  deletePasswordRecoveryTokenFromCache: jest.fn(),
  getUserIdByPasswordRecoveryTokenFromCache: jest.fn(),
  setPasswordRecoveryTokenToCache: jest.fn(),
});
