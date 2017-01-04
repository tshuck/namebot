import Q from 'q';
import FS from 'fs';
import { pick_one, is_string, to_a } from './util.js';

Array.prototype.pick_one = pick_one;

let ascii_offset = 65;
let charset = 26;

export default class {
  constructor() {
    this.vowels = 'AEIOU'.split('');
    this.consonants = to_a(charset)
                        .map((num) => String.fromCharCode(num + ascii_offset))
                        .filter((char) => !this.vowels.includes(char))
  }

  async loadCacheFromCSV() {
    let json = await Q.nfcall(FS.readFile, './registration.json', 'utf-8');
    this.cache = JSON.parse(json);
  }

  async updateCache() {
    let jsonString = JSON.stringify(this.cache);
    await Q.nfcall(FS.writeFile, './registration.json', jsonString, 'utf-8');
  }

  pick_consonant(selection) {
    if(is_string(selection) && selection.length > 0) {
      return selection.toUpperCase();
    }

    if(selection instanceof Array) {
      return selection.pick_one().toUpperCase();
    }

    return this.consonants.pick_one();
  }

  async add(name, first=null, last=null, length=2) {
    length = parseInt(length);
    this.cache[name] = [first, last, length];
    await this.updateCache();
  }

  async remove(name) {
    delete this.cache[name];
    await this.updateCache();
  }

  hasCache() {
    return Object.keys(this.cache).length > 0;
  }

  printCache() {
    let response = Object.keys(this.cache).map((key) => key + 
                                          ": " + 
                                          " first from '" + 
                                          this.cache[key][0] + 
                                          "', second from '" + 
                                          this.cache[key][1] + 
                                          "', length " + 
                                          this.cache[key][2] + 
                                          ".");
    return response.join('\r\n');
  }

  has(name) {
    return !!this.cache[name];
  }

  nickname(name) {
    let [first, last, length] = this.cache[name];

    return to_a(length)
            .map(() => this.pick_consonant(first) + this.vowels.pick_one() + this.pick_consonant(last))
            .join('');
  }
}