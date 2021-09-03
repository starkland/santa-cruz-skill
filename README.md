# Alexa Skill

> POC to learn more about how to build alexa skills.

- [Live API](https://santa-cruz-skill.herokuapp.com/news)
- [Test you request using Postman](https://documenter.getpostman.com/view/64448/TzzGJEJH)

## How to Use

Once you've installed this skill, you can say:

> Alexa, inicie o **Santa Cruz Notícias**

## How it Works

The idea is to know the latest news regarding [Santa Cruz](http://www.santacruzpe.com.br/) soccer team. This repo contains **three different layers** and each one is explained below.

### intents

This is the **first layer** of the skill. In this file you're going to find the available keywords to trigger the skill.

The action `GetFactIntent` will accept these values as valid entries: `ultimas noticias`, `novidades` or `ultimas novidades`.

### api

This is the **second layer** of the skill. Built using [Fastify](https://www.fastify.io/), it is responsible for start a nodejs server, fetch the content and then return a JSON with the following structure:

In order to fetch the latest news regarding the soccer team, we exposed `/news` endpoint.

```json
{
	"path": "news",
	"payload": {
		"content": "Here is the news formatted to speech.",
        "contentMapped": [{ "date": "02/09", "text": "Here is the news title" }],
		"length": 1
	}
}
```

### lambda

This is the **third layer** of the skill. Built using [Alexa-hosted (Node.js)](https://developer.amazon.com/en-US/docs/alexa/hosted-skills/build-a-skill-end-to-end-using-an-alexa-hosted-skill.html), it is responsible for communicating with the API and speaking the data.

The method `GetFactIntentHandler` was created to handle the intent (`GetFactIntent`) of the **first layer**.

```js
const GetFactIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'GetFactIntent';
    },
    async handle(handlerInput) {        
        const response = await httpGet(); // request to external API
        const speakOutput = response.payload.content; // speak here

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
```

## Setup

In order to communicate with the API layer using a hosted skill, you need to publish the API in a public domain. All files from `lambda` path can be replaced by the files in your web console, and the files under `intents` path, can be replaced by the file in intents web section. 

### intents

This file will be used for **intents** web section.

- access your aws developer console
- click to edit your skill
- click on "Build" tab

### api

In order to make it running on your local environment, move to the `api` path and run:

To install all the dependencies:

```sh
$ npm install
```

To start a development server under `http://localhost:3000`:

```sh
$ npm run start
```

#### ngrok

An easy way to test your local API, interacting with the amazon hosted services is to expose a public tunnel using [`ngrok`](https://ngrok.com/).

#### heroku

Here are some useful commands:

```sh
$ heroku logs --tail --app=<app-name>
```

```sh
$ heroku buildpacks --app=<app-name>
```

```sh
$ heroku apps:info --app=<app-name>
```

### lambda

This file will be used for **code editor** web section.

- access your aws developer console
- click to edit your skill
- click on "Code" tab

## Resources

- https://www.sitepoint.com/amazon-alexa-skill/
- https://developer.amazon.com/alexa/console/ask
- https://developer.amazon.com/en-US/docs/alexa/alexa-design/get-started.html
- https://ngrok.com/

## License
[MIT License](https://thulioph.mit-license.org/) © Thulio Philipe