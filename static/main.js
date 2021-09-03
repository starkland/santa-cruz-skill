const content = document.querySelector('#news-container')

const displayContent = (arr) => {
  const threeFirstNews = arr.slice(0, 3)

  threeFirstNews.forEach(({ date, text }) => {
    const li = document.createElement('li')
    const span = document.createElement('span')
    const p = document.createElement('p')

    span.innerHTML = date
    p.innerHTML = text

    li.appendChild(span)
    li.appendChild(p)
  
    content.appendChild(li)
  })

}

const getData = () => {
  const API_URL = 'https://santa-cruz-skill.herokuapp.com/news'

  const options = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    }
  }

  const request = fetch(API_URL, options)

  return request
    .then((response) => response.json())
    .then(data => {
      const { payload } = data
      displayContent(payload.contentMapped)
    })
    .catch((e) => {
      // add a log system here
      console.info("there is an error:", e)
    })
}

getData()