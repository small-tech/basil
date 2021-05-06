const set = require('keypather/set')

module.exports = function (client, request) {
  const password = request.params.password

  console.log(`   🔐️    ❨Basil❩ Socket connection request.`)

  // Set the client’s room to limit private broadcasts to people who are authenticated.
  client.room = this.setRoom({url: '/admin'})

  client.on('message', data => {
    const message = JSON.parse(data)
    if (message.type === 'update') {
      // console.log('Update', message)
      set(db, message.keyPath, message.value)
    }
  })

  if (password !== db.admin.password) {
    console.log(`   ⛔️    ❨Basil❩ Unauthorised password: ${password}`)
    client.send(JSON.stringify({
      type: 'error',
      body: 'Error: unauthorised.'
    }))
    client.close()
  } else {
    console.log(`   🔓️    ❨Basil❩ Authorised password: ${password}`)
    client.send(JSON.stringify({
      type: 'settings',
      body: db.settings
    }))
    // this.broadcast(client, `There’s been a new login from ${request._remoteAddress}`)
  }
}

if (db.settings === undefined) {
  // Dummy data for now.
  db.settings = {
    name: 'Small-Web.org',
    description: `<a href='https://small-tech.org/research-and-development'>Small Web</a> host.`,

    // Note: these will be arrays later on to accommodate other providers.
    payment: {
      provider: 'Stripe',
      modes: ['test', 'live'],
      mode: 'test',
      modeDetails: [
        {
          id: 'test',
          title: 'Test settings',
          publishableKey: 'pk_test_mLQRpGuO7qq3XMfSgwmt4n8U00FSZOIY1h',
          secretKey: 'notreallymysecretstripetestingkey',
          productId: 'notarealtestproductid',
          priceId: 'notarealtestpriceid'
        },
        {
          id: 'live',
          title: 'Live settings',
          publishableKey: 'pk_live_CYYwSVoh2kC4XcTPCudVIocg005StHQ47e',
          secretKey: 'notreallymysecretstripelivekey',
          productId: 'notarealliveproductid',
          priceId: 'notareallivepriceid'
        }
      ],
      // Note: as we progress, we will likely get this from the Stripe API
      // instead of redundantly declaring it here.
      currency: '€',
      price: 15,
    },

    dns: {
      domain: 'small-web.org',
      provider: 'DNSimple',
      accountId: '000000',
      zoneId: '123456',
      accessToken: 'asecretaccesstoken'
    },

    vps: {
      provider: 'Hetzner',
      apiToken: 'thisisnotmyrealapitoken',
      sshKeyName: '20201210-1',
      serverType: 'cpx11',
      location: 'hel1',
      image: 'ubuntu-20.04',
      cloudInit: `#cloud-config

  # Configures a basic Site.js server.
  write_files:
  - path: /home/site/public/index.html
    permissions: '0755'
    content: |
      <!DOCTYPE html>
      <html lang='en'>
      <title>Welcome to the Small Web!</title>
      <h1>Welcome to your Small Web site powered by Site.js.</h1>

  users:
  - name: site
    gecos: Site.JS
    sudo: ALL=(ALL) NOPASSWD:ALL
    lock_passwd: true
    ssh_authorized_keys:
      - {{sshKey}}
    groups: sudo
    shell: /bin/bash

  disable_root: true

  runcmd:
  - ufw allow OpenSSH
  - ufw enable
  - ufw allow 80/tcp
  - ufw allow 443/tcp
  - chown -R site:site /home/site
  - hostnamectl set-hostname {{subdomain}}.small-web.org
  - su site -c 'wget -qO- https://sitejs.org/install | bash'
  - su site -c 'mkdir /home/site/public'
  - su site -c 'site enable /home/site/public --skip-domain-reachability-check --ensure-can-sync'

  final_message: "Welcome to your Small Web site powered by Site.js. Setup took $UPTIME seconds."
      `
    }
  }
}