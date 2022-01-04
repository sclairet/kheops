/*
    this file is part of the Kheops framework
    MIT licence (see LICENCE.txt)
*/


var kh = kh || {};

Function.prototype.bind = function bind( obj) {
    
    var fx = this;
    return function() {
        return fx.apply( obj, arguments);
    };
};


Function.prototype.throttle = function( obj, minInterval) {

    var lastCall = 0, fx = this, now;
    return function() {
        if ((now = +new Date) - lastCall < minInterval)
            return;
        lastCall = now;
        fx.apply( obj, arguments);
    };
};


kh.toArray = function toArray(x) {
  var result = [];
  Array.prototype.push.apply( result, x);
  return result;
};


Function.prototype.curry = function curry() {
    
    var fx = this, args = kh.toArray( arguments);
    return function() {
        return fx.apply( this, args.concat( kh.toArray(arguments)));
    };
};


Array.prototype.remove = function remove( element) {
    var toRemove = this.indexOf( element);
    if (toRemove !== -1)
        this.splice( toRemove, 1);
    return (toRemove !== -1);
};


// each argument have this pattern: { 'property': propertyName, 'value': propertyValue}
// accept predicate function
Array.prototype.findByProperties = function findByProperties() {
    
    if (arguments.length < 1)
        return null;
        
    var result = null;
    var findPredicate = null;
    
    if (typeof(arguments[0]) == 'function') {
        findPredicate = arguments[0];
    }
    
    var iter = 0, len = this.length;
    while ((iter < len) && (result === null)) {
    
        var item = this[iter];
    
        if (findPredicate != null) {
            if (findPredicate( item))
                result = item;
        }
        else {

            var argIter = 0, argLen = arguments.length;
            while ( (argIter < argLen)
                    && (arguments[argIter].property in item)
                    && (item[arguments[argIter].property] === arguments[argIter].value) ) {
                ++argIter;
            }
                
            if (argIter === argLen)
                result = item;
        }

        ++iter;
    }
    
    return result;
};



kh.RGBColorToColor = function RGBColorToColor( rgbColor, alpha) {
    var red = parseInt( rgbColor.substring( 1, 3), 16);
    var green = parseInt( rgbColor.substring( 3, 5), 16);
    var blue = parseInt( rgbColor.substring( 5, 7), 16);
    return [red/255, green/255, blue/255, alpha || 1.0];
}



kh.installNode = function installNode( owner, nodePropertyName) {

    owner[nodePropertyName] = {
        'mName': nodePropertyName,
        'mOwner':owner,
        'mParent':null,
        'mChildren': [],
    
        setParent: function setParent( parent) {

            if ((this.mParent !== null) && (parent !== null)) {
                console.warn( 'the \'' + this.mName + '\' node has already a parent');
                return false;
            }
            this.mParent = parent;
            return true;
        },
    
        getParent: function getParent() {
            return this.mParent;
        },
    
        addChild: function addChild( child) {

            var done = false;
            if (child !== null) {

                if (!(this.mName in child))
                    kh.installNode( child, this.mName);
                
                if (this.mName in child) {
                    if (child[this.mName].setParent( this.mOwner)) {
                        this.mChildren.push( child);
                        done = true;
                    }
                }
                else {
                    console.warn( '\'' + this.mName + '\' node not found');
                }
            }
            return done;
        },

        removeChild: function removeChild( child) {

            var done = false;
            if (child !== null) {

                if (this.mName in child) {

                    var toRemove = this.mChildren.indexOf( child);
                    if (toRemove !== -1) {
                        this.mChildren[toRemove][this.mName].setParent( null);
                        this.mChildren.splice( toRemove, 1);
                        done = true;
                    }
                    else {
                        console.warn( 'child not found in \'' + this.mName + '\' node');
                    }

                }
                else {
                    console.warn( '\'' + this.mName + '\' node not found');
                }
            }
            return done;
        },

        forEach: function forEach( fx) {
            this.mChildren.forEach( fx);
        }
    };
};



kh.Progress = function Progress( scheduler, properties) {
    var props = properties || {};
    this.mStart = ('start' in props) ? props.start : 0;
    this.mEnd = ('end' in props) ? props.end : 0;
    this.mStep = ('step' in props) ? props.step : 0;
    this.mCurrent = this.mStart;
    this.mPendingRepeat = 0;
    if ('repeatCount' in props) {
        this.mPendingRepeat = props.repeatCount;
    }
    else if (this.mStep != 0.0) {
        var pendingRepeat = (this.mStep > 0.0) ? (this.mEnd - this.mStart) / this.mStep : (this.mStart - this.mEnd) / Math.abs(this.mStep);
        this.mPendingRepeat = Math.round(pendingRepeat);
    }
    this.initialValues = {
        'mPendingRepeat': this.mPendingRepeat
    }
    this.mPaused = ('paused' in props) ? props.paused : 0;
    this.mInfinite = ('infinite' in props) ? props.infinite : false;
    if ('currentFunctor' in props) {
        this.currentFunctor = props.currentFunctor;
    }
    if ('stepFunctor' in props) {
        this.stepFunctor = props.stepFunctor;
    }

    var runFunction = this.run.bind( this);
    if (scheduler != null)
        scheduler.register( runFunction);
};


kh.Progress.prototype.pause = function pause() {
    ++this.mPaused;
};


kh.Progress.prototype.resume = function resume() {
    --this.mPaused;
}


kh.Progress.prototype.run = function run() {

    if (this.mPendingRepeat === 0)
        return false;

    if (this.mPaused > 0)
        return true;

    this.doProgress( this);

    if (this.mPendingRepeat > 0) {
        --this.mPendingRepeat;
    }

    if (this.mPendingRepeat === 0 && this.mInfinite) {
        this.onRepeat()
        return true;
    }

    return (this.mPendingRepeat !== 0);
};


kh.Progress.prototype.doProgress = function doProgress() {
    this.mCurrent += (this.stepFunctor) ? this.stepFunctor(this) : this.mStep;
};


kh.Progress.prototype.onRepeat = function onRepeat() {
    this.mCurrent = this.mStart;
    this.mPaused = 0;
    this.mPendingRepeat = this.initialValues.mPendingRepeat;
};


kh.Progress.prototype.isFinished = function isFinished() {
    return (this.mPendingRepeat === 0);
};


kh.Progress.prototype.current = function current() {
    return (this.currentFunctor) ? this.currentFunctor(this) : this.mCurrent;
};



kh.ShiftList = function ShiftList(matcher, maxShiftCount) {
    this.mList = [];
    this.mCurrent = -1;
    this.shiftCount = 0;
    this.maxShiftCount = maxShiftCount || -1;
    this.mMatcher = (typeof(matcher) != 'undefined') ? matcher : null;
};


kh.ShiftList.prototype.push = function push(value) {
    this.mList.push(value);
};


kh.ShiftList.prototype.current = function current() {
    if ((this.mCurrent >= 0) && (this.mCurrent < this.mList.length)) {
        return this.mList[this.mCurrent];
    }
    return null;
};


kh.ShiftList.prototype.begin = function begin() {
    this.mCurrent = 0;
    if (this.mMatcher != null) {
        var match = false;
        while ((this.mCurrent < this.mList.length) && (!match)) {
            match = this.mMatcher(this.mList[this.mCurrent]);
            if (!match) {
                ++this.mCurrent;
            }
        }
        if (!match) {
            this.reset();
        }
    }
    return this.current();
};


kh.ShiftList.prototype.end = function end() {
    this.mCurrent = this.mList.length-1;
    if (this.mMatcher != null) {
        var match = false;
        while ((this.mCurrent >= 0) && (!match)) {
            match = this.mMatcher(this.mList[this.mCurrent]);
            if (!match) {
                 --this.mCurrent;
            }
        }
        if (!match) {
            this.reset();
        }
    }
    return this.current();
};


kh.ShiftList.prototype.shift = function shift() {
    ++this.mCurrent;
    if (this.mCurrent == this.mList.length) {
        if (this.shiftCount < this.maxShiftCount) {
            ++this.shiftCount;
            this.mCurrent = 0;
        }
        else {
            this.mCurrent = -1;
        }
    }
    if (this.mMatcher != null && this.mCurrent != -1) {
        var match = false;
        while ((this.mCurrent < this.mList.length) && (!match)) {
            match = this.mMatcher(this.mList[this.mCurrent]);
            if (!match) {
                ++this.mCurrent;
            }
        }
        if (!match) {
            this.begin();
        }
    }
    return this.current();
};


kh.ShiftList.prototype.unshift = function unshift() {
    --this.mCurrent;
    if (this.mCurrent <  0) {
        this.mCurrent = this.mList.length-1;
    }
    if (this.mMatcher != null) {
        var match = false;
        while ((this.mCurrent >= 0) && (!match)) {
            match = this.mMatcher(this.mList[this.mCurrent]);
            if (!match) {
                 --this.mCurrent;
            }
        }
        if (!match) {
            this.end();
        }
    }
    return this.current();
};


kh.ShiftList.prototype.reset = function reset() {
    this.mCurrent = -1;
};



kh.createVertexPosBuffer = function createVertexPosBuffer( glContext, vertices, usage) {

    var vertexPosBuffer = glContext.createBuffer();
    var lUsage = usage || glContext.STATIC_DRAW;

    // set current array buffer
    glContext.bindBuffer( glContext.ARRAY_BUFFER, vertexPosBuffer);
                    
    // fill vertexPosBuffer buffer
    glContext.bufferData( glContext.ARRAY_BUFFER, new Float32Array( vertices), lUsage);
    vertexPosBuffer.itemSize = 3;
    vertexPosBuffer.numItems = vertices.length / 3;
    
    return vertexPosBuffer;
};


kh.createVertexColorBuffer = function createVertexColorBuffer( glContext, colors, usage) {

    var vertexColorBuffer = glContext.createBuffer();
    var lUsage = usage || glContext.STATIC_DRAW;

    // set current array buffer
    glContext.bindBuffer( glContext.ARRAY_BUFFER, vertexColorBuffer);
                    
    // fill vertexPosBuffer buffer
    glContext.bufferData( glContext.ARRAY_BUFFER, new Float32Array( colors), lUsage);
    vertexColorBuffer.itemSize = 4;
    vertexColorBuffer.numItems = colors.length / 4;
    
    return vertexColorBuffer;
};


kh.createVertexIndexBuffer = function createVertexIndexBuffer( glContext, indexes) {

    var vertexIndexBuffer = glContext.createBuffer();
    glContext.bindBuffer( glContext.ELEMENT_ARRAY_BUFFER, vertexIndexBuffer);
    glContext.bufferData( glContext.ELEMENT_ARRAY_BUFFER, new Uint16Array( indexes), glContext.STATIC_DRAW);
    vertexIndexBuffer.itemSize = 1;
    vertexIndexBuffer.numItems = indexes.length;
    return vertexIndexBuffer;
};


kh.createVertexNormalBuffer = function createVertexNormalBuffer( glContext, normals, usage) {

    var vertexNormalBuffer = glContext.createBuffer();
    var lUsage = usage || glContext.STATIC_DRAW;

    // set current array buffer
    glContext.bindBuffer( glContext.ARRAY_BUFFER, vertexNormalBuffer);
                    
    // fill vertexPosBuffer buffer
    glContext.bufferData( glContext.ARRAY_BUFFER, new Float32Array( normals), lUsage);
    vertexNormalBuffer.itemSize = 3;
    vertexNormalBuffer.numItems = normals.length / 3;
    
    return vertexNormalBuffer;
};


kh.createVertexTextureCoordBuffer = function createVertexTextureCoordBuffer( glContext, coords) {

    var textureCoordBuffer = glContext.createBuffer();
    glContext.bindBuffer( glContext.ARRAY_BUFFER, textureCoordBuffer);
    glContext.bufferData( glContext.ARRAY_BUFFER, new Float32Array( coords), glContext.STATIC_DRAW);
    textureCoordBuffer.itemSize = 2;
    textureCoordBuffer.numItems = coords.length / 2;

    return textureCoordBuffer;
};


