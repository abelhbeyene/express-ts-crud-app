## Overview

This project is built using [express-typescript boilerplate](https://github.com/edwinhern/express-typescript-2024/). The boilerplate has best practices in place such as logging, error handling, rate limiting, OpenAPI spec, unit testing and standarised separation of concerns in the codebase which makes it scalable/maintainable.

The app comprises of multiple endpoints which are documented on the homepage (swagger): http://localhost:8080/
- /brands/:id
- /brands/:brand_id/products
- /brands/:brand_id/stores
- /products/:product_id/stores

## Approach
The most performance intensive work in this app is reading the brand data and iterating through it all to get the data. To help with this:
1. I am storing the result of the DB lookup in memory (For the purposes of this test I have used node-cache - an in memory cache but would use Redis to share cache across multiple instances/containers).

2. Where there are instances duplicated data could be returned from the DB/json I am using `Set` to deduplicate the data rather than iterating over it.


## To run the app
- `npm i`
- To run in dev mode: `npm run dev`
- To run in production mode: `npm run build && npm run start`
- To run in Docker: `docker build . -t huggg && docker run -d -p 8081:8080 huggg`
