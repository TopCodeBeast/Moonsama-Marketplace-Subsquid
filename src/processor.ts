import { Store, TypeormDatabase } from '@subsquid/typeorm-store';
import { lookupArchive } from '@subsquid/archive-registry';
import {
	EvmLogHandlerContext,
	SubstrateBatchProcessor,
} from '@subsquid/substrate-processor';
import {
	// handleContractUri,
	// handleNewContract,
	// handleTransfer,
	// handleUri,
	// handleUriAll,
	erc721handleTransfer,
} from './mappings';
import { saveAll } from './utils/entitiesManager';
import * as erc721 from './abi/erc721';
import * as erc1155 from './abi/erc1155';
import * as config from './utils/config';
// import { isKnownContract } from './helpers';

const database = new TypeormDatabase();
const processor = new SubstrateBatchProcessor()
	.setBatchSize(100)
	.setBlockRange({ from: 568970 })
	// .setBlockRange({ from: 2395293 })
	// .setDataSource({
	//   chain: config.CHAIN_NODE,
	//   archive: 'https://moonriver.archive.subsquid.io/graphql',
	// })
	// .setTypesBundle('moonriver')
	.setDataSource({
		chain: config.CHAIN_NODE,
		archive: lookupArchive('moonriver', { release: 'FireSquid' }),
	})
	.setTypesBundle('moonriver')
	.addEvmLog(config.MOONSAMA_ADDRESS, {
		filter: [[erc721.events['Transfer(address,address,uint256)'].topic]],
	});
// .addEvmLog(config.PONDSAMA_ADDRESS, {
// 	filter: [[erc721.events['Transfer(address,address,uint256)'].topic]],
// })
// .addEvmLog(config.PLOT_ADDRESS, {
// 	filter: [[erc721.events['Transfer(address,address,uint256)'].topic]],
// })
// .addEvmLog(config.MOONX_ADDRESS, {
// 	filter: [
// 		[
// 			erc1155.events[
// 				'TransferSingle(address,address,address,uint256,uint256)'
// 			].topic,
// 			erc1155.events[
// 				'TransferBatch(address,address,address,uint256[],uint256[])'
// 			].topic,
// 		],
// 	],
// })
// .addEvmLog(config.FACTORY_ADDRESS, {
// 	filter: [
// 		[
// 			erc1155.events[
// 				'TransferSingle(address,address,address,uint256,uint256)'
// 			].topic,
// 			erc1155.events[
// 				'TransferBatch(address,address,address,uint256[],uint256[])'
// 			].topic,
// 		],
// 	],
// })
// .addEvmLog(config.ART_ADDRESS, {
// 	filter: [
// 		[
// 			erc1155.events[
// 				'TransferSingle(address,address,address,uint256,uint256)'
// 			].topic,
// 			erc1155.events[
// 				'TransferBatch(address,address,address,uint256[],uint256[])'
// 			].topic,
// 		],
// 	],
// })
// .addEvmLog(config.BOX_ADDRESS, {
// 	filter: [
// 		[
// 			erc1155.events[
// 				'TransferSingle(address,address,address,uint256,uint256)'
// 			].topic,
// 			erc1155.events[
// 				'TransferBatch(address,address,address,uint256[],uint256[])'
// 			].topic,
// 		],
// 	],
// })
// .addEvmLog(config.EMBASSY_ADDRESS, {
// 	filter: [
// 		[
// 			erc1155.events[
// 				'TransferSingle(address,address,address,uint256,uint256)'
// 			].topic,
// 			erc1155.events[
// 				'TransferBatch(address,address,address,uint256[],uint256[])'
// 			].topic,
// 		],
// 	],
// });

processor.run(database, async (ctx) => {
	for (const block of ctx.blocks) {
		for (const item of block.items) {
			if (item.kind === 'event') {
				if (item.name === 'EVM.Log') {
					await handleEvmLog({
						...ctx,
						block: block.header,
						event: item.event,
					});
				}
			}
		}
	}
	await saveAll(ctx.store);
});

async function handleEvmLog(ctx: EvmLogHandlerContext<Store>) {
	const contractAddress = ctx.event.args.address;
	if (
		contractAddress === config.MOONSAMA_ADDRESS &&
		ctx.event.args.topics[0] ===
			erc721.events['Transfer(address,address,uint256)'].topic
	) {
		await erc721handleTransfer(ctx);
	}

	// if (
	// 	((contractAddress === config.MOONSAMA_ADDRESS &&
	// 		config.MOONSAMA_HEIGHT >= ctx.block.height) ||
	// 		(contractAddress === config.PONDSAMA_ADDRESS &&
	// 			config.PONDSAMA_HEIGHT >= ctx.block.height) ||
	// 		(contractAddress === config.PLOT_ADDRESS &&
	// 			config.PLOT_HEIGHT >= ctx.block.height)) &&
	// 	ctx.event.args.topics[0] ===
	// 		erc721.events['Transfer(address,address,uint256)'].topic
	// ) {
	// 	await erc721handleTransfer(ctx);
	// }

	// else if (
	// 	await isKnownContract(ctx.store, contractAddress, ctx.block.height)
	// )
	// 	switch (ctx.event.args.topics[0]) {
	// 		case raresamaCollection.events['Transfer(address,address,uint256)']
	// 			.topic:
	// 			await handleTransfer(ctx);
	// 			break;
	// 		case raresamaCollection.events['URI(uint256)'].topic:
	// 			await handleUri(ctx);
	// 			break;
	// 		case raresamaCollection.events['URIAll()'].topic:
	// 			await handleUriAll(ctx);
	// 			break;
	// 		case raresamaCollection.events['ContractURI()'].topic:
	// 			await handleContractUri(ctx);
	// 			break;
	// 		default:
	// 	}
}
