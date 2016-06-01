var Util = require('../core/Util');
var DiagonalMovement = require('../core/DiagonalMovement');

/**
 * Depth-First-Search path finder.
 * @constructor
 * @param {Object} opt
 * @param {boolean} opt.allowDiagonal Whether diagonal movement is allowed.
 *     Deprecated, use diagonalMovement instead.
 * @param {boolean} opt.dontCrossCorners Disallow diagonal movement touching
 *     block corners. Deprecated, use diagonalMovement instead.
 * @param {DiagonalMovement} opt.diagonalMovement Allowed diagonal movement.
 */
function DepthFirstFinder(opt) {
    opt = opt || {};
    this.allowDiagonal = opt.allowDiagonal;
    this.dontCrossCorners = opt.dontCrossCorners;
    this.diagonalMovement = opt.diagonalMovement;

    if (!this.diagonalMovement) {
        if (!this.allowDiagonal) {
            this.diagonalMovement = DiagonalMovement.Never;
        } else {
            if (this.dontCrossCorners) {
                this.diagonalMovement = DiagonalMovement.OnlyWhenNoObstacles;
            } else {
                this.diagonalMovement = DiagonalMovement.IfAtMostOneObstacle;
            }
        }
    }
}

/**
 * Find and return the the path.
 * @return {Array<Array<number>>} The path, including both start and
 *     end positions.
 */
DepthFirstFinder.prototype.findPath = function(startX, startY, endX, endY, grid) {
    var openList = [],
        diagonalMovement = this.diagonalMovement,
        startNode = grid.getNodeAt(startX, startY),
        endNode = grid.getNodeAt(endX, endY);

    startNode.opened = true;

    var search = function(node){
      node.opened = true;
      if (node === endNode) {
        return Util.backtrace(endNode);
      }
      node.closed = true;

      var neighbors = grid.getNeighbors(node, diagonalMovement);
      for (var i = 0, l = neighbors.length; i < l;  ++i) {
          var neighbor = neighbors[i];
          // skip this neighbor if it has been inspected before
          if (neighbor.closed || neighbor.opened) {
              continue;
          }

          neighbor.opened = true;

          neighbor.parent = node;
          var rec_call = search(neighbor);
          if( rec_call != [] ){
            return rec_call;
          } else {
            neighbor.closed = true;
          }
      }
      return [];
    }.bind(this);

    // fail to find the path
    return search(startNode);
};

module.exports = DepthFirstFinder;
