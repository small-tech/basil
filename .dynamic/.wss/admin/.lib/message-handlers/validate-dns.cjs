const fetch = require('node-fetch')

module.exports = async (client, message) => {
  console.log('   📡️    ❨Domain❩ Validating DNS Provider settings.')
  const retrieveDomainUrl = `https://api.dnsimple.com/v2/${db.settings.dns.accountId}/domains/${db.settings.dns.domain}`
  const dnsAccountDetails = await (await fetch(retrieveDomainUrl, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${db.settings.dns.accessToken}`
    }
  })).json()

  if (dnsAccountDetails.message) {
    // Something went wrong (most likely an authentication failure)
    client.send(JSON.stringify({
      type: 'validate-dns-error',
      error: dnsAccountDetails.message
    }))
  } else {
    // Send the account details.
    client.send(JSON.stringify({
      type: 'validate-dns'
    }))
  }
}
