const fetch = require('node-fetch')
const cheerio = require('cheerio')
const fastify = require('fastify')({ logger: true })

const MAX_QTD_ARTICLES = 6

const getApiURL = () => {
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
	const API_URL = getApiURL()

	return fetch(API_URL, options).then(res => res.text()).then(body => body)
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
		.send({ path: 'santa-cruz', payload })
})

// Run the server!
const start = async () => {
  try {
    await fastify.listen(3000)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()