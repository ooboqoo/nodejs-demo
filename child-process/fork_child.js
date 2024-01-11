process.on('message', data => console.log('[child receive]', data))
process.send({ msg: 'message from child' })