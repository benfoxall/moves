class Point {
    constructor (x, y) {
        this.x = x;
        this.y = y;
        this.next = null;
    }

    * [Symbol.iterator] () {
        let p = this

        do yield p
        while (p = p.next)
    }

    /*
        calculate the range of x & y for all
        points linked to this one
    */
    range() {
        let minX = this.x,
            maxX = this.x,
            minY = this.y,
            maxY = this.y;

        for(let n of this) {
            if (n.x < minX) {minX = n.x}
            else if (n.x > maxX) {maxX = n.x}

            if (n.y < minY) {minY = n.y}
            else if (n.y > maxY) {maxY = n.y}
        }

        return [minX, maxX, minY, maxY]
    }
}
