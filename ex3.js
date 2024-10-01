import config from "./configEx.js";

const QUESTION_TYPE = "question";
const ANSWER_TYPE = "answer";

class Node {
    constructor({ id, type, content, option, next }) {
        this.id = id;
        this.type = type;
        this[QUESTION_TYPE === type ? "question" : "answer"] = content;
        this.options = option || [];
        this.next = next || null;

        this.addOption = this.addOption.bind(this);
        this.setNext = this.setNext.bind(this);

        this.add = this.addOption
        this.set = this.setNext

    }

    addOption(option) {
        if (this.type !== QUESTION_TYPE) {
            throw new Error("Can only add options to a Question node");
        }
        this.options.push(option);
    }

    setNext(next) {
        if (this.type !== ANSWER_TYPE) {
            throw new Error("Can only set next node for an Answer node");
        }
        this.next = next;
    }
}

class DecisionTree {
    constructor(root) {
        this.root = root;

        this.findNodeById = this.findNodeById.bind(this);
        this.addNode = this.addNode.bind(this);
        this.editNode = this.editNode.bind(this);
        this.deleteNode = this.deleteNode.bind(this);
        this.createAnswer = this.createAnswer.bind(this);
        this.createQuestion = this.createQuestion.bind(this);

        this.node = {
            get: this.findNodeById,
            add: this.addNode,
            update: this.editNode,
            delete: this.deleteNode,
        };
        this.create = {
            answer: this.createAnswer,
            question: this.createQuestion,
        };
    }

    findNodeById({ node, id, object }) {
        const nodeType = node.type;
        if (node.id === id) {
            return node;
        }
        if (nodeType === QUESTION_TYPE) {
            for (const option of node.options) {
                if (option.id === id && object === config.PARENT_NODE) {
                    return node;
                }
                const found = this.findNodeById({ node: option, id: id, object: object });
                if (found) return found;
            }
        } else if (nodeType === ANSWER_TYPE && node.next) {
            if (node.next.id === id && object === config.PARENT_NODE) {
                return node;
            }
            return this.findNodeById({ node: node.next, id: id, object: object });
        }
        return null;
    }

    addNode({ parentId, newNode }) {
        const parent = this.findNodeById({ node: this.root, id: parentId, object: config.CHILD_NODE });
        if (!parent) throw new Error("Parent node not found");

        if (parent.type === QUESTION_TYPE && newNode.type === ANSWER_TYPE) {
            parent.add(newNode);
        } else if (parent.type === ANSWER_TYPE && newNode.type === QUESTION_TYPE) {
            if (parent.next)
                throw new Error("Answer node already has a next Question");
            parent.set(newNode);
        } else {
            throw new Error("Invalid parent node type");
        }
    }

    createQuestion({ id, question }) {
        return new Node({ id: id, type: QUESTION_TYPE, content: question });
    }

    createAnswer({ id, answer, next = null }) {
        const answerNode = new Node({ id: id, type: ANSWER_TYPE, content: answer });
        if (next) answerNode.set(next);
        return answerNode;
    }

    editNode({ nodeId, newContent }) {
        const node = this.findNodeById({ node: this.root, id: nodeId, object: config.CHILD_NODE });
        if (!node) throw new Error("Node not found");
        const nodeType = node && node.type;
        if (typeof newContent !== "string")
            throw new Error("New content must be a string");

        if (nodeType === QUESTION_TYPE) {
            node.question = newContent;
        } else if (nodeType === ANSWER_TYPE) {
            node.answer = newContent;
        } else {
            throw new Error("Invalid node type");
        }
    }

    deleteNode({ nodeId }) {
        if (!this.findNodeById({ node: this.root, id: nodeId, object: config.CHILD_NODE }))
            throw new Error("Node to delete not found.");

        const parent = this.findNodeById({ node: this.root, id: nodeId, object: config.PARENT_NODE });
        if (!parent) throw new Error("Cannot delete the root node.");
        const parentType = parent.type;
        if (parentType === QUESTION_TYPE) {
            parent.options = parent.options.filter((option) => option.id !== nodeId);
        } else if (parentType === ANSWER_TYPE) {
            parent.next = null;
        }
    }
}

// Create nodes from the data
const createNodeFromData = (data) => {
    const { id, type, options } = data
    const node = new Node({
        id: id,
        type: type,
        content: data[QUESTION_TYPE === type ? "question" : "answer"]
    });
    if (data.options) {
        for (const option of options) {
            const childNode = createNodeFromData(option);
            node.add(childNode);
            if (option.next) {
                childNode.set(createNodeFromData(option.next));
            }
        }
    }
    return node;
};

// Initialize the decision tree
const rootNode = createNodeFromData(config.DECISION_TREE);
const decisionTree = new DecisionTree(rootNode);

decisionTree.node.add({
    parentId: 7,
    newNode: decisionTree.create.question({ id: 26, question: "Do you prefer raw or cooked fish?" })
});
decisionTree.node.add({ parentId: 3, newNode: decisionTree.create.answer({ id: 27, answer: "Korean" }) });

decisionTree.node.update({ nodeId: 5, newContent: "Do you prefer traditional or fusion cuisine?" });
decisionTree.node.delete({ nodeId: 6 });

// // Example usage
console.log(JSON.stringify(decisionTree.root, null, 2));

// const myDecisionTree = new DecisionTree(config.DECISION_TREE)

// myDecisionTree.addNode({
//     tree: myDecisionTree,
//     parentId: 7,
//     newNode: myDecisionTree.createQuestion({ id: 26, question: "Do you prefer raw or cooked fish?" })
// });
// myDecisionTree.editNode({ tree: myDecisionTree, nodeId: 5, newContent: "Do you prefer traditional or fusion cuisine?" });
// myDecisionTree.deleteNode({ tree: myDecisionTree, nodeId: 6 });

// console.log(JSON.stringify(myDecisionTree.getTree(), null, 2));