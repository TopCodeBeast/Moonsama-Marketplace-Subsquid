import { Store, EntityClass } from '@subsquid/typeorm-store'
import { assert } from 'console'
import { FindOptionsRelations, FindOptionsWhere } from 'typeorm'

import {
  ERC721Contract,
  ERC721Owner,
  ERC721Token,
  ERC721Transfer,
  ERC1155Contract,
  ERC1155Owner,
  ERC1155Token,
  ERC1155TokenOwner,
  ERC1155Transfer,
  Metadata,
} from '../model'

interface EntityWithId {
  id: string
}

class EntitiesBuffer<Entity extends EntityWithId> {
  protected saveBuffer: Set<Entity> = new Set()

  save(entity: Entity): void {
    this.saveBuffer.add(entity)
  }

  async saveAll(db: Store): Promise<void> {
    await db.save([...this.saveBuffer])
    this.saveBuffer.clear()
  }
}

class EntitiesCache<
  Entity extends EntityWithId
> extends EntitiesBuffer<Entity> {
  protected cache: Map<string, Entity> = new Map()

  protected addCache(entity: Entity): void {
    this.cache.set(entity.id, entity)
  }

  save(entity: Entity): void {
    this.saveBuffer.add(entity)
    this.addCache(entity)
  }

  async get(
    db: Store,
    entity: EntityClass<Entity>,
    id: string,
    relations?: FindOptionsRelations<Entity>,
    dieIfNull?: boolean
  ): Promise<Entity | undefined> {
    let item = this.cache.get(id)
    if (!item) {
      item = await db.get(entity, {
        where: { id } as FindOptionsWhere<Entity>,
        relations,
      })
    }
    if (item) {
      this.addCache(item)
    } else if (dieIfNull) {
      throw new Error('Not null assertion')
    }
    return item
  }

  async saveAll(db: Store, clear?: boolean): Promise<void> {
    await db.save([...this.saveBuffer])
    this.saveBuffer.clear()
    if (clear) {
      this.cache.clear()
    }
  }
}

class ERC721TokenCache extends EntitiesCache<ERC721Token> {
  async getAllContractTokens(
    db: Store,
    contractAddress: string
  ): Promise<Array<ERC721Token>> {
    const cachedTokens: ERC721Token[] = []
    this.cache.forEach((token, tokenId) => {
      if (tokenId.startsWith(contractAddress)) {
        cachedTokens.push(token)
      }
    })
    const allTokens = await db.find(ERC721Token, {
      where: {
        contract: {
          id: contractAddress,
        },
      },
    })

    // Replace db tokens that exists in cache
    cachedTokens.forEach((token) => {
      const replaceId = allTokens.findIndex((dbToken) => dbToken.id === token.id)
      // Tokens only that exist in db could be cached
      assert(replaceId >= 0)
      allTokens[replaceId] = token
    })

    // Add everything from db to in-memory cache
    allTokens.forEach((token)=>{
      this.addCache(token)
    })
    
    return allTokens
  }
}

class ERC1155TokenCache extends EntitiesCache<ERC1155Token> {
  async getAllContractTokens(
    db: Store,
    contractAddress: string
  ): Promise<Array<ERC1155Token>> {
    const cachedTokens: ERC1155Token[] = []
    this.cache.forEach((token, tokenId) => {
      if (tokenId.startsWith(contractAddress)) {
        cachedTokens.push(token)
      }
    })
    const allTokens = await db.find(ERC1155Token, {
      where: {
        contract: {
          id: contractAddress,
        },
      },
    })

    // Replace db tokens that exists in cache
    cachedTokens.forEach((token) => {
      const replaceId = allTokens.findIndex((dbToken) => dbToken.id === token.id)
      // Tokens only that exist in db could be cached
      assert(replaceId >= 0)
      allTokens[replaceId] = token
    })

    // Add everything from db to in-memory cache
    allTokens.forEach((token)=>{
      this.addCache(token)
    })
    
    return allTokens
  }
}

export const ERC721contracts = new EntitiesCache<ERC721Contract>()
export const ERC721owners = new EntitiesCache<ERC721Owner>()
export const ERC721tokens = new ERC721TokenCache()
export const ERC721transfers = new EntitiesCache<ERC721Transfer>()
export const ERC1155contracts = new EntitiesCache<ERC1155Contract>()
export const ERC1155owners = new EntitiesCache<ERC1155Owner>()
export const ERC1155tokens = new ERC1155TokenCache()
export const ERC1155tokenOwners = new EntitiesCache<ERC1155TokenOwner>()
export const ERC1155transfers = new EntitiesCache<ERC1155Transfer>()
export const metadatas = new EntitiesCache<Metadata>()

export async function saveAll(db: Store): Promise<void> {
  await metadatas.saveAll(db)
  await ERC721owners.saveAll(db)
  await ERC721contracts.saveAll(db)
  await ERC721tokens.saveAll(db)
  await ERC721transfers.saveAll(db)
  await ERC1155owners.saveAll(db)
  await ERC1155contracts.saveAll(db)
  await ERC1155tokenOwners.saveAll(db)
  await ERC1155tokens.saveAll(db)
  await ERC1155transfers.saveAll(db)
}
