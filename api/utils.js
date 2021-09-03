const cheerio = require('cheerio')

const MAX_QTD_ARTICLES = 6

// get dates from string
const datesRegex = new RegExp(/[0-9]{2}\D+[0-9]{2}/g)

const formatDate = (dateString) => {
	const options = { year: undefined, month: 'long', day: 'numeric' }
	const mainLang = 'pt-BR'

	return new Date(dateString).toLocaleDateString(mainLang, options)
}

const extractMonthAndDay = (string) => {
	const [day, month] = string.split('/')
	return { month, day }
}

const mapContent = (arr) => {
	const mapped = arr.map((el) => {
		const { month, day } = extractMonthAndDay(el.match(datesRegex)[0])
		const year = new Date().getFullYear()
		const fullDate = `${day}/${month}/${year}`

		return {
			date: formatDate(fullDate),
			text: el.replace(datesRegex, '').trim()
		}
	})

	return mapped
}

const normalizeToSpeech = (arr) => {
	return arr.map(({ text, date }) => `Notícia do dia ${date}: ${text}`).join('. ').trim()
}

const formatPayload = (payload) => {
	const $ = cheerio.load(payload, {
		xml: { normalizeWhitespace: true }
	})

	const text = $('.texto').text()
	const textSplitted = text.split('  ')

	const contentMapped = mapContent(textSplitted)
	const content = normalizeToSpeech(contentMapped)

	return {
		contentMapped,
		content,
		length: MAX_QTD_ARTICLES
	}
}

module.exports = {
	formatPayload,
	MAX_QTD_ARTICLES
}