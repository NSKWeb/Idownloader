import NodeCache from 'node-cache';

// stdTTL: time to live in seconds for every new entry. 0 = unlimited
// checkperiod: The period in seconds, as a number, used for the automatic delete check interval. 0 = no periodic check.
const cache = new NodeCache({ stdTTL: 3600, checkperiod: 120 });

export default cache;
