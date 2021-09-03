const fetch = require('node-fetch')
const fastify = require('fastify')({ logger: true })

const { formatPayload, MAX_QTD_ARTICLES } = require('./utils')

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