// config.js
const config = {
    DECISION_TREE: {
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
    },
    QUESTION_TYPE: "question",
    ANSWER_TYPE: "answer",
    PARENT_NODE: "parent",
    CHILD_NODE: "child"

};

export default config;