# JWT Working Space

This is a test project that I learn JWT and trying to improve my JWT skills.

[Server link](https://9i6j96-5000.preview.csb.app/)

## Routes to send request

### /login
Send JSON object that includes the email and password on the request body. It returns the access token and refresh token.

```js
{
  "email": "admin@gmail.com",
  "password": "123456"  
}
```

### /logout
Send JSON object that includes the refresh token on the request body. It removes the refresh token in the refresh tokens array and returns the 200 status code.

```js
{
  "refreshToken": "xxx.xxx.xxx",
}
```

### /refresh
Send JSON object that includes the refresh token on the request body. It returns a new access token with 2 minute expiration time.

```js
{
  "refreshToken": "xxx.xxx.xxx",
}
```

### /animals
It's a protected route and returns animals array. It is protected by auth middleware. We must pass the access token in the Authorization header.