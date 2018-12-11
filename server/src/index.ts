import * as express from 'express'

const app = express()

function generateData () {

  const rowsCount = Math.floor(3 * Math.random()) + 1

  const rows = []

  for (let i = 0; i <= rowsCount; i++) {
    rows.push({
      o: Math.random(),
      h: Math.random(),
      l: Math.random(),
      c: Math.random()
    })
  }

  return {
    status: 200,
    ohlc: rows
  }
}

app.get(
  '/:year',
  (req, res) => {
    const callback = req.query['callback']

    if (!callback) {
      res.status(401)
    }

    res.send(`
      ${callback}(
        ${JSON.stringify(generateData())}
      )
    `)
    res.end()
  }
)

const port = process.env.PORT || 3001

app.listen(port)
console.log(`Server started on port: ${port}`)
