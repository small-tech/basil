// Create a new product.

const stripeWithSecretKey = require('stripe')

module.exports = async (client, message) => {

  const stripeDetails = db.settings.payment.modeDetails[message.mode === 'live' ? 1 : 0]
  const stripe = stripeWithSecretKey(stripeDetails.secretKey)

  const domain = db.settings.dns.domain

  const productDetails = {
    id: `prod_small-web_${domain}`,
    name: `${domain} (monthly)`,
    description: 'Monthly fee for your Small Web place',
    statement_descriptor: domain,
    tax_code: 'txcd_10103000', // Software as a Service
    images: ['https://small-web.org/small-web.svg'],
    url: `https://${domain}`
  }

  console.log('Creating product…', productDetails)

  let product
  try {
    product = await stripe.products.create(productDetails)
  } catch (error) {
    client.send(JSON.stringify({
      type: 'payment-providers.stripe.products.create.error',
      error
    }))
  }

  client.send(JSON.stringify({
    type: 'payment-providers.stripe.products.create.result',
    product
  }))
}
