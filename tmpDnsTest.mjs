import dns from 'dns'

try {
  const records = await dns.promises.resolveSrv('_mongodb._tcp.cluster0.fs8reyq.mongodb.net')
  console.log('SRV records:', records)
} catch (err) {
  console.error('ERR:', err.code, err.message)
  process.exit(1)
}
