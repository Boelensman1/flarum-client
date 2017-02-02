# Flarum-client
A simple client to the [flarum forum software](http://flarum.org/) api.

## Usage
First include the flarum client and initialise it.

```
const settings = {
  "apiUrl": "http://example.org/api",
  "adminUsername": "username", // you will need to create an account with admin privileges on flarum
  "adminPassword": "password"
}
const flarumClient = require('../').init(settings);
```

### logging
If you want better logging, you can install bunyan and pass an instance to the init, like this:
```
var bunyan = require('bunyan');
var logger = bunyan.createLogger({name: "myapp"});
const flarumClient = require('../').init(settings, logger);
```
