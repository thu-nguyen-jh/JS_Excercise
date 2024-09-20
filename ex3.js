const decisionTree = {
    id: 1,
    question: "Can I guess your favorite food?",
    options: [
       {
          id: 2,
          text: "Is it liquid?",
          next: {
             id: 3,
             question: "Is it a soup?",
             options: [
                {
                   id: 4,
                   text: "Yes",
                   content: "You might like a hearty vegetable soup!",
                },
                { id: 5, text: "No", content: "Perhaps it's a smoothie or a juice?" },
             ],
          },
       },
       {
          id: 6,
          text: "Is it dry?",
          next: {
             id: 7,
             question: "Is it crunchy?",
             options: [
                { id: 8, text: "Yes", content: "Could it be chips or crackers?" },
                {
                   id: 9,
                   text: "No",
                   content: "Maybe it's a type of bread or pastry?",
                },
             ],
          },
       },
       {
          id: 10,
          text: "Is it a main course?",
          next: {
             id: 11,
             question: "Does it contain meat?",
             options: [
                {
                   id: 12,
                   text: "Yes",
                   next: {
                      id: 13,
                      question: "Is it grilled?",
                      options: [
                         {
                            id: 14,
                            text: "Yes",
                            content: "Sounds like you enjoy grilled steak or chicken!",
                         },
                         {
                            id: 15,
                            text: "No",
                            content: "Perhaps it's a hearty stew or casserole?",
                         },
                      ],
                   },
                },
                {
                   id: 16,
                   text: "No",
                   content:
                      "You might be a fan of vegetarian dishes like pasta or stir-fry!",
                },
             ],
          },
       },
    ],
 };
 
 
 // Function to add a node
 function addNode(parent, newOption) {
    parent.options.push(newOption);
 }
 
 
 // Function to edit a node
 function editNode(node, newContent) {
    if (node.content) {
       node.content = newContent;
    } else if (node.question) {
       node.question = newContent;
    } else {
       node.text = newContent;
    }
 }
 
 
 // Function to delete a node
 function deleteNode(parent, optionId) {
    parent.options = parent.options.filter((option) => option.id !== optionId);
 }
 
 
 // Helper function to find a node by id
 function findNodeById(dt, id) {
    if (dt.id === id) {
       return dt;
    }
    if (dt.options) {
       for (const option of dt.options) {
          const found = findNodeById(option, id);
          if (found) return found;
          if (option.next) {
             const foundInNext = findNodeById(option.next, id);
             if (foundInNext) return foundInNext;
          }
       }
    }
    return null;
 }
 
 
 // Function to add a node by parent id
 function addNodeById(dt, parentId, newOption) {
    const parent = findNodeById(dt, parentId);
    if (parent) {
       if (!parent.options) {
          parent.options = [];
       }
       parent.options.push(newOption);
    } else {
       console.log("Parent node not found.");
    }
 }
 
 
 // Function to edit a node by id
 function editNodeById(dt, nodeId, newContent) {
    const node = findNodeById(dt, nodeId);
    if (node) {
       editNode(node, newContent);
    } else {
       console.log("Node not found.");
    }
 }
 
 
 // Function to delete a node by parent id and option id
 function deleteNodeById(dt, parentId, optionId) {
    const parent = findNodeById(dt, parentId);
    if (parent && parent.options) {
       deleteNode(parent, optionId);
    } else {
       console.log("Parent node not found or has no options.");
    }
 }
 
 
 // Example usage:
 addNodeById(decisionTree, 7, {
    id: 17,
    text: "Is it sweet?",
    content: "You might enjoy cookies or pastries!",
 });
 
 
 editNodeById(decisionTree, 5, "It could be a refreshing beverage!");
 
 
 deleteNodeById(decisionTree, 11, 16);
 
 
 console.log(JSON.stringify(decisionTree, null, 2));
 