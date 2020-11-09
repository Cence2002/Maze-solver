class Graph {
    setSize(n) {
        this.size = n;
        this.vertices = [];
        for (let i = 0; i < this.size; i++) {
            this.vertices[i] = {
                id: i,
                neighbours: new Set(),
                position: createVector()
            };
        }
    }

    setRectangle(rangeX = [0, 100], rangeY = [0, 100]) {
        this.rectangle = {};
        this.rectangle.rangeX = rangeX;
        this.rectangle.rangeY = rangeY;
        this.rectangle.sideX = this.rectangle.rangeX[1] - this.rectangle.rangeX[0];
        this.rectangle.sideY = this.rectangle.rangeY[1] - this.rectangle.rangeY[0];
    }

    setBorder(border) {
        this.setRectangle([this.rectangle.rangeX[0] + border.x / 2, this.rectangle.rangeX[1] - border.x / 2],
            [this.rectangle.rangeY[0] + border.y / 2, this.rectangle.rangeY[1] - border.y / 2]);
    }


    getSquareGridSize(n, range = [0.01, 10000]) {
        if (range[1] - range[0] < 0.1) {
            return range[0];
        }
        let d = (range[0] + range[1]) / 2,
            w = floor(this.rectangle.sideX / d),
            h = floor(this.rectangle.sideY / d);
        if ((w + 1) * (h + 1) > n) {
            return this.getSquareGridSize(n, [d, range[1]]);
        }
        return this.getSquareGridSize(n, [range[0], d]);
    }

    fromSquareGrid(n) {
        let d = this.getSquareGridSize(n),
            w = floor(this.rectangle.sideX / d),
            h = floor(this.rectangle.sideY / d),
            border = {
                x: this.rectangle.sideX - w * d,
                y: this.rectangle.sideY - h * d
            };
        this.setBorder(border);
        this.setSize((w + 1) * (h + 1));
        let i = 0;
        for (let y = 0; y <= h; y++) {
            for (let x = 0; x <= w; x++) {
                let position = this.vertices[i].position;
                position.x = interpolate(x, [0, w], this.rectangle.rangeX);
                position.y = interpolate(y, [0, h], this.rectangle.rangeY);
                i++;
            }
        }
    }

    getTriangularGridSize(n, range = [0.01, 10000]) {
        if (range[1] - range[0] < 0.01) {
            return range[0];
        }
        let d = (range[0] + range[1]) / 2,
            w = floor(this.rectangle.sideX / d),
            h = floor(this.rectangle.sideY / d / sqrt(3));
        if (2 * w * h + w + h > n) {
            return this.getTriangularGridSize(n, [d, range[1]]);
        }
        return this.getTriangularGridSize(n, [range[0], d]);
    }

    fromTriangularGrid(n) {
        let d = this.getTriangularGridSize(n),
            w = floor(this.rectangle.sideX / d),
            h = floor(this.rectangle.sideY / d / sqrt(3)),
            border = {
                x: this.rectangle.sideX - w * d,
                y: this.rectangle.sideY - sqrt(3) * h * d
            };
        this.setBorder(border);
        this.setSize(2 * w * h + w + h);
        let i = 0;
        for (let y = 0; y <= 2 * h; y++) {
            if (y % 2 === 0) {
                for (let x = 0; x < w; x++) {
                    let position = this.vertices[i].position;
                    position.x = interpolate(2 * x + 1, [0, 2 * w], this.rectangle.rangeX);
                    position.y = interpolate(y, [0, 2 * h], this.rectangle.rangeY);
                    i++;
                }
            } else {
                for (let x = 0; x <= w; x++) {
                    let position = this.vertices[i].position;
                    position.x = interpolate(x, [0, w], this.rectangle.rangeX);
                    position.y = interpolate(y, [0, 2 * h], this.rectangle.rangeY);
                    i++;
                }
            }
        }
    }

    getHexagonalGridSize(n, range = [0.01, 10000]) {
        if (range[1] - range[0] < 0.01) {
            return range[0];
        }
        let d = (range[0] + range[1]) / 2,
            w = floor((this.rectangle.sideX / d - 2) / 3),
            h = floor(this.rectangle.sideY / d / sqrt(3));
        if (2 * (w + 1) * (2 * h + 1) > n) {
            return this.getHexagonalGridSize(n, [d, range[1]]);
        }
        return this.getHexagonalGridSize(n, [range[0], d]);
    }

    fromHexagonalGrid(n) {
        let d = this.getHexagonalGridSize(n),
            w = floor((this.rectangle.sideX / d - 2) / 3),
            h = floor(this.rectangle.sideY / d / sqrt(3)),
            border = {
                x: this.rectangle.sideX - (3 * w + 2) * d,
                y: this.rectangle.sideY - sqrt(3) * h * d
            };
        this.setBorder(border);
        this.setSize(2 * (w + 1) * (2 * h + 1));
        let i = 0;
        for (let y = 0; y <= 2 * h; y++) {
            if (y % 2 === 0) {
                for (let x = 0; x < 3 * (w + 1); x++) {
                    if (x % 3 === 2) {
                        continue;
                    }
                    let position = this.vertices[i].position;
                    position.x = interpolate(2 * x + 1, [0, 2 * (3 * (w + 1) - 1)], this.rectangle.rangeX);
                    position.y = interpolate(y, [0, 2 * h], this.rectangle.rangeY);
                    i++;
                }
            } else {
                for (let j = 0; j < 3 * (w + 1); j++) {
                    if (j % 3 === 1) {
                        continue;
                    }
                    let position = this.vertices[i].position;
                    position.x = interpolate(j, [0, 3 * (w + 1) - 1], this.rectangle.rangeX);
                    position.y = interpolate(y, [0, 2 * h], this.rectangle.rangeY);
                    i++;
                }
            }
        }
    }

    fromRandomGrid(n) {
        this.setSize(n);
        this.vertices.forEach(vertex => {
            let position = vertex.position;
            position.x = random(this.rectangle.rangeX[0], this.rectangle.rangeX[1]);
            position.y = random(this.rectangle.rangeY[0], this.rectangle.rangeY[1]);
        });
    }

    distortion(magnitude) {
        let seed = random(100);
        this.vertices.forEach(vertex => {
            let position = vertex.position;
            let magnitude2 = magnitude;
            magnitude2 = min(magnitude2, position.x - this.rectangle.rangeX[0]);
            magnitude2 = min(magnitude2, this.rectangle.rangeX[1] - position.x);
            magnitude2 = min(magnitude2, position.y - this.rectangle.rangeY[0]);
            magnitude2 = min(magnitude2, this.rectangle.rangeY[1] - position.y);
            let normalizedPosition = createVector();
            normalizedPosition.x = interpolate(position.x, this.rectangle.rangeX, [0, 5]);
            normalizedPosition.y = interpolate(position.y, this.rectangle.rangeY, [0, 5]);
            let vector = createVector();
            vector.x = noise(normalizedPosition.x, normalizedPosition.y, seed);
            vector.y = noise(normalizedPosition.x, normalizedPosition.y + 10, seed);
            position.add(vector.mult(2 * magnitude2).sub(magnitude2, magnitude2));
        });
    }


    setCloseNeighbors(distance) {
        this.vertices.forEach(vertex1 => {
            this.vertices.forEach(vertex2 => {
                let index1 = vertex1.id,
                    index2 = vertex2.id;
                if (index1 < index2) {
                    if (p5.Vector.dist(vertex1.position, vertex2.position) <= distance) {
                        vertex1.neighbours.add(index2);
                        vertex2.neighbours.add(index1);
                    }
                }
            });
        });
    }

    setDelaunayNeighbors() {
        let points = [];
        for (let i = 0; i < this.size; i++) {
            let position = this.vertices[i].position;
            points.push([position.x, position.y]);
        }
        let triangles = Delaunator.from(points).triangles;
        for (let i = 0; i < triangles.length; i += 3) {
            for (let j = 0; j < 3; j++) {
                let index1 = triangles[i + j],
                    index2 = triangles[i + (j + 1) % 3];
                this.vertices[index1].neighbours.add(index2);
                this.vertices[index2].neighbours.add(index1);
            }
        }
    }


    startSearch() {
        this.time = 0;
        this.vertices.forEach(vertex => {
            vertex.visited = false;
            vertex.time = 1000000;
        });
    }

    dfs(i) {
        let vertex = this.vertices[i];
        vertex.visited = true;
        vertex.time = this.time;
        this.time++;
        vertex.neighbours.forEach(j => {
            if (!this.vertices[j].visited) {
                this.dfs(j);
            }
        });
    }

    bfs(i) {
        let vertex = this.vertices[i],
            queue = [];
        queue.push(i);
        vertex.visited = true;
        vertex.time = 0;
        while (queue.length > 0) {
            let i = queue[0];
            queue.shift();
            this.vertices[i].neighbours.forEach(j => {
                let neighbour = this.vertices[j];
                if (!neighbour.visited) {
                    neighbour.visited = true;
                    neighbour.time = this.time;
                    this.time++;
                    queue.push(j);
                }
            });
        }
    }

    parallelBfs(i) {
        let vertex = this.vertices[i],
            current = [];
        current.push(i);
        vertex.visited = true;
        vertex.time = 0;
        while (current.length > 0) {
            this.time++;
            let next = [];
            current.forEach(i => {
                this.vertices[i].neighbours.forEach(j => {
                    let neighbour = this.vertices[j];
                    if (!neighbour.visited) {
                        neighbour.visited = true;
                        neighbour.time = this.time;
                        next.push(j);
                    }
                });
            });
            current = next.slice();
        }
    }


    show() {
        stroke(0, 0, 1);
        this.vertices.forEach(vertex => {
            vertex.neighbours.forEach(i => {
                let neighbour = this.vertices[i];
                if (vertex.id < i) {
                    line(vertex.position.x, vertex.position.y, neighbour.position.x, neighbour.position.y);
                }
            });
        });
        /*noStroke();
        fill(0, 0, 1);
        this.vertices.forEach(vertex => {
            circle(vertex.position.x, vertex.position.y, 3);
        });*/
    }

    showSearch() {
        stroke(1);
        let blueLines = [], greenLines = [];
        this.vertices.forEach(vertex => {
            vertex.neighbours.forEach(i => {
                let neighbour = this.vertices[i];
                if (vertex.visited) {
                    if (vertex.time < neighbour.time) {
                        let rate = constrain(this.time + 1 - neighbour.time, 0, 1),
                            vector = p5.Vector.lerp(vertex.position, neighbour.position, rate);
                        if (rate < 1) {
                            blueLines.push([vector, neighbour.position]);
                            //stroke(0, 0, 1);
                            //line(vector.x, vector.y, neighbour.position.x, neighbour.position.y);
                        }
                        if (rate > 0) {
                            greenLines.push([vertex.position, vector]);
                            //stroke(0, 1, 0);
                            //line(vertex.position.x, vertex.position.y, vector.x, vector.y);
                        }
                    } else if (vertex.time === neighbour.time) {
                        if (vertex.id < neighbour.id) {
                            let rate = constrain(this.time - vertex.time, 0, 0.5),
                                vector1 = p5.Vector.lerp(vertex.position, neighbour.position, rate),
                                vector2 = p5.Vector.lerp(vertex.position, neighbour.position, 1 - rate);
                            if (rate < 0.5) {
                                blueLines.push([vector1, vector2]);
                                //stroke(0, 0, 1);
                                //line(vector1.x, vector1.y, vector2.x, vector2.y);
                            }
                            if (rate > 0) {
                                if (rate === 0.5) {
                                    greenLines.push([vertex.position, neighbour.position]);
                                    //stroke(0, 1, 0);
                                    //line(vertex.position.x, vertex.position.y, neighbour.position.x, neighbour.position.y);
                                } else {
                                    greenLines.push([vertex.position, vector1]);
                                    greenLines.push([vector2, neighbour.position]);
                                    //stroke(0, 1, 0);
                                    //line(vertex.position.x, vertex.position.y, vector1.x, vector1.y);
                                    //line(neighbour.position.x, neighbour.position.y, vector2.x, vector2.y);
                                }
                            }
                        }
                    }
                } else {
                    if (vertex.id < neighbour.id) {
                        blueLines.push([vertex.position, neighbour.position]);
                        //stroke(0, 0, 1);
                        //line(vertex.position.x, vertex.position.y, neighbour.position.x, neighbour.position.y);
                    }
                }
            });
        });
        stroke(0, 0, 1);
        blueLines.forEach(pair => {
            line(pair[0].x, pair[0].y, pair[1].x, pair[1].y)
        });
        stroke(0, 1, 0);
        greenLines.forEach(pair => {
            line(pair[0].x, pair[0].y, pair[1].x, pair[1].y)
        });

        /*noStroke();
        this.vertices.forEach(vertex => {
            if (vertex.time <= this.time) {
                fill(0, 1, 0);
            } else {
                fill(0, 0, 1);
            }
            circle(vertex.position.x, vertex.position.y, 3);
        });*/
        this.time += 20 / frameRate();
        this.time += random(0.00000001);
    }
}

let graph = new Graph();

function setup() {
    createCanvas(windowWidth, windowHeight);
    background(0);
    colorMode(RGB, 1);

    strokeWeight(2);

    let size = 1000,
        gridMode = 3,
        delaunay = false,
        distortion = true,
        magnitude = 50;

    graph.setRectangle([50, width - 50], [50, height - 50]);

    switch (gridMode) {
        case -1:
            graph.fromRandomGrid(size);
            graph.setDelaunayNeighbors();
            break;
        case 0:
            graph.fromSquareGrid(size);
            if (delaunay) {
                graph.setDelaunayNeighbors();
            } else {
                graph.setCloseNeighbors(graph.getSquareGridSize(size) + 0.1);
            }
            break;
        case 1:
            graph.fromSquareGrid(size);
            if (delaunay) {
                graph.setDelaunayNeighbors();
            } else {
                graph.setCloseNeighbors(1.5 * graph.getSquareGridSize(size) + 0.1);
            }
            break;
        case 2:
            graph.fromSquareGrid(size);
            if (delaunay) {
                graph.setDelaunayNeighbors();
            } else {
                graph.setCloseNeighbors(2.5 * graph.getSquareGridSize(size) + 0.1);
            }
            break;
        case 3:
            graph.fromTriangularGrid(size);
            if (delaunay) {
                graph.setDelaunayNeighbors();
            } else {
                graph.setCloseNeighbors(graph.getTriangularGridSize(size) + 0.1);
            }
            break;
        case 4:
            graph.fromTriangularGrid(size);
            if (delaunay) {
                graph.setDelaunayNeighbors();
            } else {
                graph.setCloseNeighbors(1.75 * graph.getTriangularGridSize(size) + 0.1);
            }
            break;
        case 5:
            graph.fromHexagonalGrid(size);
            if (delaunay) {
                graph.setDelaunayNeighbors();
            } else {
                graph.setCloseNeighbors(graph.getHexagonalGridSize(size) + 0.1);
            }
            break;
        case 6:
            graph.fromHexagonalGrid(size);
            if (delaunay) {
                graph.setDelaunayNeighbors();
            } else {
                graph.setCloseNeighbors(1.75 * graph.getHexagonalGridSize(size) + 0.1);
            }
            break;
        case 7:
            graph.fromHexagonalGrid(size);
            if (delaunay) {
                graph.setDelaunayNeighbors();
            } else {
                graph.setCloseNeighbors(2 * graph.getHexagonalGridSize(size) + 0.1);
            }
            break;
    }
    if (gridMode >= 0 && distortion) {
        graph.distortion(magnitude);
    }
}

function draw() {
    background(0);
    if (mouseIsPressed) {
        graph.vertices.forEach(vertex => {
            vertex.neighbours.forEach(i => {
                let neighbour = graph.vertices[i];
                if (intersects(vertex.position, neighbour.position, createVector(pmouseX, pmouseY), createVector(mouseX, mouseY))) {
                    vertex.neighbours.delete(neighbour.id);
                }
            });
        });
    }
    graph.showSearch();
}

function keyPressed() {
    if (keyCode === 32) {
        graph.startSearch();
        //graph.dfs(floor(graph.size / 2));
        graph.bfs(floor(graph.size / 2));
        graph.time = 0;
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function clockWise(vector1, vector2, vector3) {
    return Math.sign(p5.Vector.cross(p5.Vector.sub(vector3, vector2), p5.Vector.sub(vector1, vector2)).z);
}

function intersects(vector1, vector2, vector3, vector4) {
    return clockWise(vector1, vector2, vector3) !== clockWise(vector1, vector2, vector4)
        && clockWise(vector3, vector4, vector1) !== clockWise(vector3, vector4, vector2);
}

function interpolate(n, from, to) {
    if (from[0] === from[1]) {
        return (to[0] + to[1]) / 2;
    }
    return (n - from[0]) / (from[1] - from[0]) * (to[1] - to[0]) + to[0];
}

function clog(object) {
    console.log(object);
}
