const RpcClient = require('@gnometech/divid-rpc')

const CFG = require('./config/')

const rpc = new RpcClient({
  user: CFG.divi.user,
  pass: CFG.divi.pass,
  host: CFG.divi.host,
  protocol: 'http'
})

const formatArgs = argarray => {
  if (!argarray) {
    argarray = []
  }
  for (let i = 0; i < argarray.length; i++) {
    if (Array.isArray(argarray[i]) || typeof argarray[i] == 'object') {
      argarray[i] = JSON.stringify(argarray[i])
    }
  }
  return argarray
}

const rpcFunction = (functionName, argarray) =>
  new Promise(resolve =>
    rpc[functionName](
      ...[
        ...formatArgs(argarray),
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
