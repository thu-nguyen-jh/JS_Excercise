import config from "./configEx.js";

const QUESTION_TYPE = "question";
const ANSWER_TYPE = "answer";

class Node {
    constructor(id, type, content, option, next) {
        this.id = id;
        this.type = type;
        this[QUESTION_TYPE === type ? "question" : "answer"] = content;
        this.options = option || [];
        this.next = next || null;
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

const findNodeById = context => (node, id, object) => {
    const nodeType = node.type;
    if (node.id === id) {
        return node;
    }
    if (nodeType === QUESTION_TYPE) {
        for (const option of node.options) {
            if (option.id === id && object === config.PARENT_NODE) {
                return node;
            }
            const found = context.findNodeById(option, id, object);
            if (found) return found;
        }
    } else if (nodeType === ANSWER_TYPE && node.next) {
        if (node.next.id === id && object === config.PARENT_NODE) {
            return node;
        }
        return context.findNodeById(node.next, id, object);
    }
    return null;
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

    findNodeById(node, id, object) {
        const nodeType = node.type;
        if (node.id === id) {
            return node;
        }
        if (nodeType === QUESTION_TYPE) {
            for (const option of node.options) {
                if (option.id === id && object === config.PARENT_NODE) {
                    return node;
                }
                const found = this.findNodeById(option, id, object);
                if (found) return found;
            }
        } else if (nodeType === ANSWER_TYPE && node.next) {
            if (node.next.id === id && object === config.PARENT_NODE) {
                return node;
            }
            return this.findNodeById(node.next, id, object);
        }
        return null;
    }

    addNode(parentId, newNode) {
        const parent = this.findNodeById(this.root, parentId, config.CHILD_NODE);
        if (!parent) throw new Error("Parent node not found");

        if (parent.type === QUESTION_TYPE && newNode.type === ANSWER_TYPE) {
            parent.addOption(newNode);
        } else if (parent.type === ANSWER_TYPE && newNode.type === QUESTION_TYPE) {
            if (parent.next)
                throw new Error("Answer node already has a next Question");
            parent.setNext(newNode);
        } else {
            throw new Error("Invalid parent node type");
        }
    }

    createQuestion(id, question) {
        return new Node(id, QUESTION_TYPE, question);
    }

    createAnswer(id, answer, next = null) {
        const answerNode = new Node(id, ANSWER_TYPE, answer);
        if (next) answerNode.setNext(next);
        return answerNode;
    }

    editNode(nodeId, newContent) {
        const node = this.findNodeById(this.root, nodeId, config.CHILD_NODE);
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

    deleteNode(nodeId) {
        if (!this.findNodeById(this.root, nodeId, config.CHILD_NODE))
            throw new Error("Node to delete not found.");

        const parent = this.findNodeById(this.root, nodeId, config.PARENT_NODE);
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
    const node = new Node(
        data.id,
        data.type,
        data[QUESTION_TYPE === data.type ? "question" : "answer"]
    );
    if (data.options) {
        for (const option of data.options) {
            const childNode = createNodeFromData(option);
            node.addOption(childNode);
            if (option.next) {
                const nextNode = createNodeFromData(option.next);
                childNode.setNext(nextNode);
            }
        }
    }
    return node;
};

// Initialize the decision tree
const rootNode = createNodeFromData(config.DECISION_TREE);
const decisionTree = new DecisionTree(rootNode);

decisionTree.node.add(
    7,
    decisionTree.create.question(26, "Do you prefer raw or cooked fish?")
);
decisionTree.node.add(3, decisionTree.create.answer(27, "Korean"));

decisionTree.node.update(5, "Do you prefer traditional or fusion cuisine?");
decisionTree.node.delete(6);

// Example usage
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