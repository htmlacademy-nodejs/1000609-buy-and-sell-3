'use strict';

const DEFAULT_COMMAND = `--help`;
const API_PREFIX = `/api`;
const USER_ARGV_INDEX = 2;

const Env = {
  DEVELOPMENT: `development`,
  PRODUCTION: `production`
};

const ExitCode = {
  ERROR: 1,
  SUCCESS: 0,
};

const HttpCode = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
};

module.exports = {
  DEFAULT_COMMAND,
  API_PREFIX,
  USER_ARGV_INDEX,
  Env,
  ExitCode,
  HttpCode
};
