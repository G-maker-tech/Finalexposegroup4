// JavaScript program to solve knapsack problem using
// branch and bound

// Structure for Item which store weight and corresponding value of Item
class Item {
	constructor(weight, value) {
		this.weight = weight;
		this.value = value;
	}
}

// Node structure to store information of decision tree
class Node {
	constructor(level, profit, weight, bound) {
		this.level = level; // Level of node in decision tree (or index in arr[])
		this.profit = profit; // Profit of nodes on path from root to this node (including this node)
		this.weight = weight; // Weight of nodes on path from root to this node (including this node)
		this.bound = bound; // Upper bound of maximum profit in subtree of this node
	}
}

// Comparison function to sort Item according to val/weight ratio
function cmp(a, b) {
	let r1 = a.value / a.weight;
	let r2 = b.value / b.weight;
	return r1 < r2;
}

// Returns bound of profit in subtree rooted with u.
// This function mainly uses Greedy solution to find
// an upper bound on maximum profit.
function bound(u, n, W, arr) {
	// if weight overcomes the knapsack capacity, return 0 as expected bound
	if (u.weight >= W) {
		return 0;
	}

	// initialize bound on profit by current profit
	let profit_bound = u.profit;

	// start including items from index 1 more to current item index
	let j = u.level + 1;
	let totweight = u.weight;

	// checking index condition and knapsack capacity condition
	while (j < n && totweight + arr[j].weight <= W) {
		totweight += arr[j].weight;
		profit_bound += arr[j].value;
		j++;
	}

	// If k is not n, include last item partially for upper bound on profit
	if (j < n) {
		profit_bound += (W - totweight) * arr[j].value / arr[j].weight;
	}

	return profit_bound;
}

// Returns maximum profit we can get with capacity W
function knapsack(W, arr, n) {
	// sorting Item on basis of value per unit weight.
	arr.sort(cmp);

	// make a queue for traversing the node
	let Q = [];
	let u = new Node(-1, 0, 0, 0);
	let v;

	// dummy node at starting
	Q.push(u);

	// One by one extract an item from decision tree
	// compute profit of all children of extracted item
	// and keep saving maxProfit
	let maxProfit = 0;
	while (Q.length > 0) {
		// Dequeue a node
		u = Q.shift();

		// If it is starting node, assign level 0
		if (u.level == -1) {
			v = new Node(0, 0, 0, 0);
		}

		// If there is nothing on next level
		if (u.level == n - 1) {
			continue;
		}

		// Else if not last node, then increment level,
		// and compute profit of children nodes.
		v = new Node(u.level + 1, u.profit, u.weight, 0);

		// Taking current level's item add current
		// level's weight
		v.weight = u.weight + arr[v.level].weight;
		v.profit = u.profit + arr[v.level].value;
			// If cumulated weight is less than W and
	// profit is greater than previous profit,
	// update maxprofit
	if (v.weight <= W && v.profit > maxProfit) {
		maxProfit = v.profit;
	}

	// Get the upper bound on profit to decide
	// whether to add v to Q or not.
	v.bound = bound(v, n, W, arr);

	// If bound value is greater than profit,
	// then only push into queue for further
	// consideration
	if (v.bound > maxProfit) {
		Q.push(v);
	}

	// Do the same thing, but Without taking
	// the item in knapsack
	v = new Node(u.level + 1, u.profit, u.weight, 0);
	v.bound = bound(v, n, W, arr);
	if (v.bound > maxProfit) {
		Q.push(v);
	}
}

return maxProfit;
}

// driver program to test above function
function main() {
const W = 10; // Weight of knapsack
const arr = [
{ weight: 2, value: 40 },
{ weight: 3.14, value: 50 },
{ weight: 1.98, value: 100 },
{ weight: 5, value: 95 },
{ weight: 3, value: 30 },
];
const n = arr.length;

console.log(`Maximum possible profit = ${knapsack(W, arr, n)}`);
}
main();
