import { CellTypes } from 'constants/cell'

function dijkstra(grid, startRow, startCol, endRow, endCol) {
    let visitedListInOrder = [];
    let openList = [];
    let closedList = [];

    let goalNode = createNode(grid[endRow][endCol]);
    let startNode = createNode(grid[startRow][startCol]);

    openList.push(startNode);

    let solutionNode = null;
    while (openList.length !== 0) {
        let currentNode = removeLowestScoreNode(openList);
        
        if (currentNode.row === goalNode.row && currentNode.col === goalNode.col) {
            solutionNode = currentNode;
            break;
        }

       
        closedList.push(currentNode)
        visitedListInOrder.push(createVisitedNodeState(currentNode, CellTypes.VISITED));
        
        let neighbours = getNeighbours(currentNode, grid);
        for (const neighbour of neighbours) {
            // Ignore Obstacles
            if (neighbour.type === CellTypes.OBSTACLE)
                continue;
            if (closedList.find( node => neighbour.row === node.row && neighbour.col === node.col)) {
                continue;
            }
            
            let openNode = openList.find( node => neighbour.row === node.row && neighbour.col === node.col);
            if (!openNode) {
                openList.push(neighbour)
                
                visitedListInOrder.push(createVisitedNodeState(neighbour, CellTypes.CONSIDERING));
            }
            else {
                if (openNode.g > neighbour.g) {
                    openNode = neighbour;
                }
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


function removeLowestScoreNode(open) {
    let lowest = 0;
    for (let i = 1; i < open.length; ++i) {
        lowest = open[i].g < open[lowest].g ? i : lowest;
    }    
    return open.splice(lowest, 1)[0];
}

function createNode(cell) {
    return {
        row: cell.row,
        col: cell.col,
        type: cell.type,
        g: 0,
        parent: null,
        visited: false
    }
}

function getNeighbours(node, grid) {
    
    let neighbours = [];
    let maxCols = grid[0].length;
    let maxRows = grid.length;
    
    function getNeighbourNode(parentNode, cell) {
       
        let neighbour = createNode(cell);
        neighbour.g = parentNode.g + cell.cost;
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


export default dijkstra;