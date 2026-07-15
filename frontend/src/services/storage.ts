import { Dexie, Table } from 'dexie'
import { Manuscript, Dictionary, CheckResult } from '../types/index'

export class GenkoDB extends Dexie {
  manuscripts!: Table<Manuscript>
  dictionaries!: Table<Dictionary>
  checkResults!: Table<CheckResult>

  constructor() {
    super('GenkoDB')
    this.version(1).stores({
      manuscripts: '++id, uploadDate',
      dictionaries: '++id, uploadDate',
      checkResults: '++id, manuscriptId',
    })
  }
}

export const db = new GenkoDB()
