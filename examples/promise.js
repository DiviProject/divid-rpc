const RpcClient = require('@gnometech/divid-rpc')

const CFG = require('./config/')

const rpc = new RpcClient({
  user: CFG.divi.user,
  pass: CFG.divi.pass,
  protocol: 'http'
})

const rpcFunction = (functionName, argarray) =>
  new Promise(resolve =>
    rpc[functionName](
      ...[
        ...(argarray ? argarray : []),
        ...[(err, res) => resolve(err ? { error: err } : res)]
      ]
    )
  )

const rpcs = {}

for (let x in rpc) {
  const functionName = x
  if (!rpcs[functionName]) {
    rpcs[functionName] = (...args) =>
      rpcFunction(functionName, args ? args : [])
  }
}

module.exports = rpcs
