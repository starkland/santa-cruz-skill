const fetch = require('node-fetch')
const cheerio = require('cheerio')
const fastify = require('fastify')({ logger: true })

const MAX_QTD_ARTICLES = 6
const PORT = (process.env.PORT || 3000)
const HOST = (process.env.HOST || '0.0.0.0')

const buildResourceURL = () => {
	const searchParams = new URLSearchParams({
		tipo: 'noticia',
		quantidade: MAX_QTD_ARTICLES,
		pagina: 1,
		busca: ''
	})

	const pathname = 'wp-content/themes/santacruzpe/ajax/multimidia.php'

	return `http://www.santacruzpe.com.br/${pathname}?${searchParams}`
}

const getData = () => {
	const options = { method: 'GET' }
	const RESOURCE_URL = buildResourceURL()

	return fetch(RESOURCE_URL, options).then(res => res.text()).then(body => body)
}

const formatPayload = (payload) => {
	const $ = cheerio.load(payload, {
		xml: { normalizeWhitespace: true }
	})

	const text = $('.texto').text()
	const dates = new RegExp(/[0-9]{2}\D+[0-9]{2}/g) // remove dates from string
	const content = text.replace(dates, '').split('  ').slice(1, 7).join('. ')

	return {
		content,
		length: MAX_QTD_ARTICLES
	}
}

// Declare a route
fastify.get('/santa-cruz', async (request, reply) => {
	const data = await getData()
	const payload = formatPayload(data)

	reply
		.code(200)
		.header('Content-Type', 'application/json; charset=utf-8')
		.header('Access-Control-Allow-Origin', '*')
		.send({ path: 'santa-cruz', payload })
})

// Run the server!
const start = async () => {
  try {
    await fastify.listen(PORT, HOST)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()