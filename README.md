# Full-Stack 11ty

This is a simple website that uses 11ty, Netlify Functions, and Netlify Edge Functions to demonstrate "full-stack" behavior within a static site generator.

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/seancdavis/full-stack-11ty)

## Setup

You need to make sure you have the following installed:

- Node.js v20 or higher
- Netlify CLI (`npm install -g netlify-cli@latest`)
- Deno (I'm running v1.40)

Install the dependencies. I've used Yarn, but you're welcome to remove `yarn.lock` and use `npm install` instead.

    yarn install

Run the development server:

    ntl dev

This will start the 11ty developer server and launch the Netlify dev server in a browser, most likely at `http://localhost:8888`.
