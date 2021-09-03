const fetch = require('node-fetch')
const cheerio = require('cheerio')
const fastify = require('fastify')({ logger: true })

const MAX_QTD_ARTICLES = 6
const PORT = (process.env.PORT || 3000)
const HOST = (process.env.HOST || '0.0.0.0')

const datesRegex = new RegExp(/[0-9]{2}\D+[0-9]{2}/g) // remove dates from string

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

const mapContent = (str) => {
	const arr = str.split('  ')

	const mapped = arr.map((el) => {
		return {
			date: el.match(datesRegex)[0],
			text: el.replace(datesRegex, '').trim()
		}
	})

	return mapped
}

const normalizeToSpeech = (str) => {
	return str.replace(datesRegex, '').split('  ').slice(1, 7).join('. ')
}

const formatPayload = (payload) => {
	const $ = cheerio.load(payload, {
		xml: { normalizeWhitespace: true }
	})

	const text = $('.texto').text()

	const contentMapped = mapContent(text)
	const content = normalizeToSpeech(text)

	return {
		contentMapped,
		content,
		length: MAX_QTD_ARTICLES
	}
}

// Declare a route
fastify.get('/news', async (request, reply) => {
	const data = await getData()
	const payload = formatPayload(data)

	reply
		.code(200)
		.header('Content-Type', 'application/json; charset=utf-8')
		.header('Access-Control-Allow-Origin', '*')
		.send({ path: 'news', payload })
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