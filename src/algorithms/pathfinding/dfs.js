import { CellTypes } from 'constants/cell'



function dfs(grid, startRow, startCol, endRow, endCol) {
    let visitedListInOrder = [];
    let visitedNodes = [];
    let stack = [];

    let goalNode = createNode(grid[endRow][endCol]);
    let startNode = createNode(grid[startRow][startCol]);

    stack.push(startNode);

    let solutionNode = null;
    while (stack.length !== 0 && !solutionNode) {
        let currentNode = stack.pop();

        if (!visitedNodes.find(visited => visited.row === currentNode.row && visited.col === currentNode.col)) {
            visitedNodes.push(currentNode);
            visitedListInOrder.push(createVisitedNodeState(currentNode, CellTypes.VISITED));

            let neighbours = getNeighbours(currentNode, grid);
            for (const neighbour of neighbours ) {
                if (neighbour.type === CellTypes.OBSTACLE)
                    continue;
                if (visitedNodes.find(visited => visited.row === neighbour.row && visited.col === neighbour.col)) {
                    continue;
                }
                if (neighbour.row === goalNode.row && neighbour.col === goalNode.col) {
                    solutionNode = neighbour;
                    break;
                }
                stack.push(neighbour);
                
                visitedListInOrder.push(createVisitedNodeState(neighbour, CellTypes.CONSIDERING));
            }

        }

    }

    let solution = reconstructPath(solutionNode);
    return {
        visitedListInOrder,
        solution
    };
}


function reconstructPath(solutionNode) {
    let result = [];
    let itr = solutionNode;
    while(itr != null)
    {
        result.push(itr);
        itr = itr.parent;
    }

    return result.reverse();
}

function createVisitedNodeState(node, type) {
    return {
        node: node,
        type: type
    }
}



function createNode(cell) {
    return {
        row: cell.row,
        col: cell.col,
        type: cell.type,
        parent: null,
    }
}

function getNeighbours(node, grid) {
    
    let neighbours = [];
    let maxCols = grid[0].length;
    let maxRows = grid.length;
    
    function getNeighbourNode(parentNode, cell) {
        let neighbour = createNode(cell);
        neighbour.parent = parentNode;    
        return neighbour;
    }

    if (node.row - 1 >= 0) {
        let cell = grid[node.row - 1][node.col];
        neighbours.push(getNeighbourNode(node, cell));
    }
    if (node.col - 1 >= 0) {
        let cell = grid[node.row][node.col - 1];
        neighbours.push(getNeighbourNode(node, cell));
    }
    if (node.row + 1 < maxRows) {
        let cell = grid[node.row + 1][node.col];
        neighbours.push(getNeighbourNode(node, cell));
    }
    if (node.col + 1 < maxCols) {
        let cell = grid[node.row][node.col + 1];
        neighbours.push(getNeighbourNode(node, cell));
    }

    return neighbours;
}


export default dfs;