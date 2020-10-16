import { NodeCG } from './nodecg';

export type FindOption = {
	removeRetweet: boolean;
};

export const findOption = (nodecg: NodeCG): FindOption => {
	const defaultOption: FindOption = {
		removeRetweet: false
	};

	return Object.assign(defaultOption, nodecg.bundleConfig.findOption);
}
