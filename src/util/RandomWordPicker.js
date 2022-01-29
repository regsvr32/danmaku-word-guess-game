export class RandomWordPicker {
  #resetLster = null
  #words = []
  #index = -1
  
  constructor(words) {
    this.reset(words)
  }

  reset(words) {
    this.#resetLster = words
  }

  next() {
    if (this.#resetLster) {
      this.#words = this.#resetLster.flatMap(group => group.active ? group.words.map(word => ({ category: group.category, word })) : [])
      this.#index = -1
      this.#resetLster = null
    }
    if (!this.#words.length) {
      return { category: '', word: '' }
    }
    this.#index = (this.#index + 1) % this.#words.length
    const swapWith = this.#index + Math.trunc((window.crypto.getRandomValues(new Uint32Array(1))[0] / 0x100000000) * (this.#words.length - this.#index))
    const result = this.#words[swapWith]
    this.#words[swapWith] = this.#words[this.#index]
    this.#words[this.#index] = result
    return result
  }
}