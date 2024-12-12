const InvariantError = require('./InvariantError');
const AuthorizationError = require('./AuthorizationError');

const DomainErrorTranslator = {
  translate(error) {
    return DomainErrorTranslator._directories[error.message] || error;
  },
};

DomainErrorTranslator._directories = {
  'REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada'),
  'REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat membuat user baru karena tipe data tidak sesuai'),
  'REGISTER_USER.USERNAME_LIMIT_CHAR': new InvariantError('tidak dapat membuat user baru karena karakter username melebihi batas limit'),
  'REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER': new InvariantError('tidak dapat membuat user baru karena username mengandung karakter terlarang'),
  'USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('harus mengirimkan username dan password'),
  'USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('username dan password harus string'),
  'REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN': new InvariantError('harus mengirimkan token refresh'),
  'REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('refresh token harus string'),
  'DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN': new InvariantError('harus mengirimkan token refresh'),
  'DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('refresh token harus string'),
  'THREAD_PAYLOAD.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('properti payload thread kurang'),
  'THREAD_PAYLOAD.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tipe properti data payload thread tidak sesuai'),
  'THREAD_PAYLOAD.TITLE_LIMIT_CHAR': new InvariantError('karakter judul thread melebihi batas limit'),
  'THREAD_COMMENT_PAYLOAD.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('properti payload thread comment kurang'),
  'THREAD_COMMENT_PAYLOAD.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tipe properti data payload thread comment tidak sesuai'),
  'DELETE_THREAD_COMMENT_USE_CASE.COMMENT_DO_NOT_BELONG_TO_LOGGED_USER': new AuthorizationError('thread comment bukan milik pengguna yang sedang login'),
};

module.exports = DomainErrorTranslator;
