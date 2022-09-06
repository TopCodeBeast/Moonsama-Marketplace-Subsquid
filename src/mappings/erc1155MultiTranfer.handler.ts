import { EvmLogHandlerContext } from '@subsquid/substrate-processor';
import { Store } from '@subsquid/typeorm-store';
import assert from 'assert';
import {
	ERC1155Contract,
	ERC1155Owner,
	ERC1155Token,
	ERC1155TokenOwner,
	ERC1155Transfer,
	Metadata,
} from '../model';
import * as erc1155 from '../abi/erc1155';
import {
	ERC1155contracts,
	ERC1155owners,
	ERC1155tokens,
	ERC1155tokenOwners,
	ERC1155transfers,
	metadatas,
} from '../utils/entitiesManager';
import {
	parseMetadata,
	fetchContractMetadata,
} from '../helpers/metadata.helper';
import { TOKEN_RELATIONS } from '../utils/config';
import { BigNumber } from 'ethers';

export async function erc1155handleMultiTransfer(
	ctx: EvmLogHandlerContext<Store>
): Promise<void> {
	const { event, block, store } = ctx;
	const evmLog = event.args;
	const contractAddress = evmLog.address.toLowerCase() as string;
	const contractAPI = new erc1155.Contract(ctx, contractAddress);
	const data =
		erc1155.events[
			'TransferBatch(address,address,address,uint256[],uint256[])'
		].decode(evmLog);

	for (let i = 0; i < data.ids.length; i++) {
		const [name, symbol, contractURI, decimals, totalSupply, uri] =
		await Promise.all([
			contractAPI.name(),
			contractAPI.symbol(),
			contractAPI.contractURI(),
			contractAPI.decimals(),
			contractAPI.totalSupply(data.ids[i]),
			contractAPI.uri(data.ids[i]),
		]);
		let oldOwner = await ERC1155owners.get(
			ctx.store,
			ERC1155Owner,
			data.from.toLowerCase()
		);
		if (oldOwner == null) {
			oldOwner = new ERC1155Owner({
				id: data.from.toLowerCase(),
			});
		}

		let owner = await ERC1155owners.get(
			ctx.store,
			ERC1155Owner,
			data.to.toLowerCase()
		);
		if (owner == null) {
			owner = new ERC1155Owner({
				id: data.to.toLowerCase(),
			});
		}

		ERC1155owners.save(oldOwner);
		ERC1155owners.save(owner);

		let contractData = await ERC1155contracts.get(
			ctx.store,
			ERC1155Contract,
			contractAddress
		);
		if (contractData == null) {
			contractData = new ERC1155Contract({
				id: contractAddress,
				address: contractAddress,
				name: name,
				symbol: symbol,
				totalSupply: BigInt(1),
				decimals: decimals,
				contractURI: contractURI,
				contractURIUpdated: BigInt(block.timestamp),
				startBlock: block.height,
			});
		} else {
			let contractTotalSupply =
				BigInt(data.ids[i].toString()) > contractData.totalSupply
					? BigInt(data.ids[i].toString())
					: contractData.totalSupply;
			contractData.name = name;
			contractData.symbol = symbol;
			contractData.decimals = decimals;
			contractData.totalSupply = contractTotalSupply;
			contractData.contractURI = contractURI;
			contractData.contractURIUpdated = BigInt(block.timestamp);
		}
		const rawMetadata = await fetchContractMetadata(ctx, contractURI);
		if (rawMetadata) {
			contractData.metadataName = rawMetadata.name;
			contractData.artist = rawMetadata.artist;
			contractData.artistUrl = rawMetadata.artistUrl;
			contractData.externalLink = rawMetadata.externalLink;
			contractData.description = rawMetadata.description;
			contractData.image = rawMetadata.image;
		}
		ERC1155contracts.save(contractData);

		let metadatId = contractAddress + '-' + data.ids[i].toString();
		let meta = await metadatas.get(ctx.store, Metadata, metadatId);
		if (!meta) {
			meta = await parseMetadata(ctx, uri, metadatId);
			if (meta) metadatas.save(meta);
		}

		let token = await ERC1155tokens.get(
			ctx.store,
			ERC1155Token,
			metadatId,
			TOKEN_RELATIONS
		);
		// assert(token);
		if (!token) {
			token = new ERC1155Token({
				id: metadatId,
				numericId: data.ids[i].toBigInt(),
				tokenUri: uri,
				metadata: meta,
				contract: contractData,
				updatedAt: BigInt(block.timestamp),
				createdAt: BigInt(block.timestamp),
			});
		}
		token.totalSupply = totalSupply.toBigInt();

		let senderTokenOwnerId = data.from
			.concat('-')
			.concat(data.ids[i].toString());
		let senderTokenOwner = await ERC1155tokenOwners.get(
			ctx.store,
			ERC1155TokenOwner,
			senderTokenOwnerId
		);
		if (senderTokenOwner == null) {
			senderTokenOwner = new ERC1155TokenOwner({
				id: senderTokenOwnerId,
				balance: 0n,
			});
		}
		senderTokenOwner.owner = oldOwner;
		senderTokenOwner.token = token;
		// if we mint tokens, we don't mark it
		// total minted ever can be caluclated by totalSupply + burned amount

		if (oldOwner.id != '0x0000000000000000000000000000000000000000' ) {
			senderTokenOwner.balance -= data[4][i].toBigInt();
		}

		let recipientTokenOwnerId = data.to
			.concat('-')
			.concat(data.ids[i].toString());
		let recipientTokenOwner = await ERC1155tokenOwners.get(
			ctx.store,
			ERC1155TokenOwner,
			recipientTokenOwnerId
		);
		if (recipientTokenOwner == null) {
			recipientTokenOwner = new ERC1155TokenOwner({
				id: recipientTokenOwnerId,
				balance: 0n,
			});
		}

		recipientTokenOwner.owner = owner;
		recipientTokenOwner.token = token;

		// in case of 0x0000000000000000000000000000000000000000 it's the burned amount
		// recipientTokenOwner.balance =
		// 	recipientTokenOwner.balance + data.values[i].toBigInt();

		ERC1155tokenOwners.save(senderTokenOwner);
		ERC1155tokenOwners.save(recipientTokenOwner);
		ERC1155tokens.save(token);

		let transferId = block.hash
			.concat('-'.concat(data.ids[i].toString()))
			.concat('-'.concat(event.indexInBlock.toString()));
		let transfer = await ERC1155transfers.get(
			ctx.store,
			ERC1155Transfer,
			transferId
		);
		if (!transfer) {
			transfer = new ERC1155Transfer({
				id: transferId,
				block: block.height,
				timestamp: BigInt(block.timestamp),
				transactionHash: block.hash,
				from: oldOwner,
				to: owner,
				token,
			});
		}
		ERC1155transfers.save(transfer);
		console.log('ERC1155Transfer', transfer);
	}
}
