const jsonwebtoken = require("jsonwebtoken");

// options about the token
const options = {
  algorithm: "HS256",
  expiresIn: "1h",
};

// check if the env variable is set
if (process.env.SECRET_KEY) {
  var secretKey: string = process.env.SECRET_KEY;
} else {
  throw new Error("SECRET_KEY environment variable is not set");
}

/**
 * Decode the token in input and extract the payload
 *
 * @param token string hashed with the secret key
 * @returns informations in the token
 */
export const getPayload = function (token: string) {
  //token variable starts with "Bearer ", so now we cut that word
  token = token.slice(7, token.length);
  let decoded_token = jsonwebtoken.decode(token, { complete: true });
  return decoded_token;
};

/**
 * Generate the token from information about the user
 * @param username name of the user
 * @param role role of the user
 * @returns token and payload informations
 */
export const setToken = function (
  username: string,
  role: string,
  password: string,
  email: string
): [string, string] {
  try {
    let informations: Object = {
      username: username,
      role: role,
      password: password,
      email: email,
    };
    let token = jsonwebtoken.sign(informations, secretKey, options);
    let payload: string = jsonwebtoken.decode(token, { complete: true });
    return [token, payload];
  } catch (error: any) {
    return error;
  }
};

/**
 * throws an exception if the token is invalid
 * @param token token to verify
 */
export const verifyToken = function (token: string): boolean {
  try {
    //verifyng token
    jsonwebtoken.verify(token, secretKey, options);
    return true;
  } catch (error: any) {
    return error.message;
  }
};
