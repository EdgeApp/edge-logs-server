import { wordlists } from 'bip39'

const wordMap: { [key: string]: boolean } = {}

for (const word of wordlists.english) {
  wordMap[word] = true
}

const KEY_WORDS = [
  'avalancheKey',
  'avalancheMnemonic',
  'binanceMnemonic',
  'binanceKey',
  'binancesmartchainMnemonic',
  'binancesmartchainKey',
  'bitcoinKey',
  'bitcoincashKey',
  'celoMnemonic',
  'celoKey',
  'dashKey',
  'eosOwnerKey',
  'eosKey',
  'ethDevKey',
  'ethDevMnemonic',
  'ethereumclassicKey',
  'ethereumclassicMnemonic',
  'ethereumKey',
  'ethereumMnemonic',
  'ethereumpowKey',
  'ethereumpowMnemonic',
  'fantomKey',
  'fantomMnemonic',
  'hederaMnemonic',
  'hederaKey',
  'litecoinKey',
  'moneroMnemonic',
  'mnemonic',
  'optimismKey',
  'optimismMnemonic',
  'polkadotKey',
  'polkadotMnemonic',
  'rskKey',
  'rskMnemonic',
  'solanaKey',
  'solanaMnemonic',
  'stellarKey',

  // Internal Edge Key Names
  'allKeys',
  'displayPrivateSeed',
  'displayPublicSeed',
  'publicWalletInfo',
  'otpKey',
  'loginKey',
  'recoveryKey'
]

export function checkForKeys(data: any): undefined | string {
  const dataString = JSON.stringify(data)
  let badWords = ''
  KEY_WORDS.forEach(word => {
    const regexString = `"${word}\\\\*"`
    const regex = new RegExp(regexString)
    if (regex.test(dataString)) {
      badWords += word + ' '
    }
  })
  if (badWords !== '') {
    return `ERROR: Detected sensitive data ${badWords}`
  }

  const regex = /(\b[a-z]+\b\s){11,23}\b[a-z]+\b/g
  const matches = dataString.match(regex)
  const found = matches != null
  if (found) {
    for (const match of matches) {
      const words = match.split(' ')
      let allValid = true
      for (const word of words) {
        if (!wordMap[word]) {
          allValid = false
          break
        }
      }
      if (allValid) {
        return `ERROR: Mnemonic seed detected: ${words.slice(0, 3).join(' ')}`
      }
    }
  }
}
