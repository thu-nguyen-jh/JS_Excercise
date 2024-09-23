const QUESTION_TYPE = "question";
const ANSWER_TYPE = "answer";
const decisionTree = {
    id: 1,
    type: "question",
    question: "What type of meal are you in the mood for?",
    options: [{
            id: 2,
            type: "answer",
            answer: "Light and fresh",
            next: {
                id: 3,
                type: "question",
                question: "What kind of protein do you prefer?",
                options: [{
                        id: 4,
                        type: "answer",
                        answer: "Seafood",
                        next: {
                            id: 5,
                            type: "question",
                            question: "Familiar or adventurous?",
                            options: [{
                                    id: 6,
                                    type: "answer",
                                    answer: "Familiar",
                                },
                                {
                                    id: 7,
                                    type: "answer",
                                    answer: "Adventurous",
                                },
                            ],
                        },
                    },
                    {
                        id: 8,
                        type: "answer",
                        answer: "Vegetarian",
                    },
                ],
            },
        },
        {
            id: 9,
            type: "answer",
            answer: "Hearty and filling",
            next: {
                id: 10,
                type: "question",
                question: "Do you prefer meat or vegetarian options?",
                options: [{
                        id: 11,
                        type: "answer",
                        answer: "Meat",
                    },
                    {
                        id: 12,
                        type: "answer",
                        answer: "Vegetarian",
                    },
                ],
            },
        },
    ],
};


function createQuestion(id, question, options = []) {
    return {
        id,
        type: QUESTION_TYPE,
        question,
        options,
    };
}


function createAnswer(id, answer, next = null) {
    return {
        id,
        type: ANSWER_TYPE,
        answer,
        next,
    };
}


function findNodeById(node, id) {
    if (node.id === id) {
        return node;
    }
    if (node.type === QUESTION_TYPE) {
        // Question
        for (const option of node.options) {
            const found = findNodeById(option, id);
            if (found) return found;
        }
    } else if (node.type === ANSWER_TYPE && node.next) {
        // Answer
        return findNodeById(node.next, id);
    }
    return null;
}


function addNode(tree, parentId, newNode) {
    const parent = findNodeById(tree, parentId);
    if (!parent) {
        throw new Error("Parent node not found");
    }

    if (parent.type === QUESTION_TYPE) {
        // Question
        if (newNode.type !== ANSWER_TYPE) {
            throw new Error("Can only add Answer nodes to a Question node");
        }
        parent.options.push(newNode);
    } else if (parent.type === ANSWER_TYPE) {
        // Answer
        if (newNode.type !== QUESTION_TYPE) {
            throw new Error("Can only add Question nodes to an Answer node");
        }
        if (parent.next) {
            throw new Error("Answer node already has a next Question");
        }
        parent.next = newNode;
    } else {
        // Add a type is not Question or Answer
        throw new Error("Invalid parent node type");
    }
}


function editNode(tree, nodeId, newContent) {
    const node = findNodeById(tree, nodeId);
    if (typeof newContent !== "string") {
        throw new Error("New content must be a string");
    }


    if (!node) {
        throw new Error("Node not found");
    }


    if (node.type === QUESTION_TYPE) {
        // Question
        node.question = newContent;
    } else if (node.type === ANSWER_TYPE) {
        // Answer
        node.answer = newContent;
    } else {
        throw new Error("Invalid node type");
    }
}


function findParentNode(node, childId) {
    if (node.type === QUESTION_TYPE) {
        // Question
        for (const option of node.options) {
            if (option.id === childId) {
                return node;
            }
            const found = findParentNode(option, childId);
            if (found) return found;
        }
    } else if (node.type === ANSWER_TYPE && node.next) {
        // Answer
        if (node.next.id === childId) {
            return node;
        }
        return findParentNode(node.next, childId);
    }
    return null;
}


function deleteNode(tree, nodeId) {
    const nodeToDelete = findNodeById(tree, nodeId);
    if (!nodeToDelete) {
        throw new Error("Node to delete not found.");
    }


    const parent = findParentNode(tree, nodeId);
    if (!parent) {
        throw new Error("Cannot delete the root node.");
    }


    if (parent.type === QUESTION_TYPE) {
        // Parent is Question then Current Node will be Answer
        parent.options = parent.options.filter((option) => option.id !== nodeId);
    } else if (parent.type === ANSWER_TYPE) {
        // Parent is Answer then Current Node will be a Question
        parent.next = null;
    }
}



addNode(
    decisionTree,
    7,
    createQuestion(26, "Do you prefer raw or cooked fish?")
);
editNode(decisionTree, 5, "Do you prefer traditional or fusion cuisine?");
deleteNode(decisionTree, 6);

console.log(JSON.stringify(decisionTree, null, 2));