import { findOption } from './findOption';
import { NodeCG } from './nodecg';
import { twitter } from './twitter';

export = (nodecg: NodeCG): void => {
	const option = findOption(nodecg);
    twitter(nodecg, option);
}
