"use strict";

function List(){
	this.head = undefined;
	this.tail = undefined;
	this.cursor = new Node(undefined);
}

function Node(v){
	this.next = undefined;
	this.prev = undefined;
	this.data = v;
}

// Move cursor to start of list
List.prototype.cursorToStart = function(){
	this.cursor.prev = undefined;
	this.cursor.next = this.head;
}

// Move cursor to end of list
List.prototype.cursorToEnd = function(){
	this.cursor.next = undefined;
	this.cursor.prev = this.tail;
}

// Advance cursor to next position. If cursor is already at end, do nothing.
List.prototype.advanceCursor = function(){
	if(this.cursor.next === undefined){
		return false;
	}
	else{
		this.cursor.prev = this.cursor.next;
		this.cursor.next = this.cursor.next.next;
	}
}

// Move cursor back one place. If cursor is already at the head, do nothing
List.prototype.unadvanceCursor = function(){
	if(this.cursor.prev === undefined){
		return false;
	}
	else
		this.cursor.next = this.cursor.prev;
		this.cursor.prev = this.cursor.prev.prev;
}

// Return true if cursor is at start, false if not
List.prototype.cursorAtStart = function(){
	if(this.cursor.next == this.head){
		return true;
	}
	else
		return false;
}


// Return true if cursor at end, false if not
List.prototype.cursorAtEnd = function(){
	if(this.cursor.prev == this.tail){
		return true;
	}
	else
		return false;
}

// Get item after cursor. If cursor is at end, return undefined
List.prototype.getAfterCursor = function(){
	if(this.cursor.next === undefined){
		return undefined;
	}
	else
		return this.cursor.next.data;
}

// Get item before cursor. If cursor is at head, return undefined
List.prototype.getBeforeCursor = function(){
	if(this.cursor.prev === undefined){
		return undefined;
	}
	else
		return this.cursor.prev.data;
}

        
// Insert v after the cursor. Cursor position is unchanged.
List.prototype.insert = function(v){
	if(this.head == undefined && this.tail == undefined){
		var n = new Node(v);
		this.head = n;
		this.tail = n;
		this.cursor.next = undefined;
		this.cursor.prev = n;
		return;
	}
	else if(this.cursor.next == undefined){
		var n = new Node(v);
		n.prev = this.tail;
		n.next = undefined;
		this.tail.next = n;
		this.tail = n;
		this.cursor.prev = n;
		return;
	}
	else if(this.cursor.prev == undefined){
		var n = new Node(v);
		n.next = this.head;
		this.head.prev = n;
		this.cursor.prev = n;
		this.cursor.next = this.head;
		this.head = n;
		return;
	}
	else{
		var n = new Node(v);
		this.cursor.prev.next = n;
		n.prev = this.cursor.prev;
		this.cursor.next.prev = n;
		n.next = this.cursor.next;
		this.cursor.prev = n;
		return;
	}
}

/* Remove item after cursor; cursor is advanced to the one after
 * the removed element. If cursor is at the end: No action occurs. 
 */
List.prototype.remove = function(){
	if(this.head == undefined && this.tail == undefined){
		return false;
	}
	else if(this.cursor.next == undefined){
		return false;
	}
	else if(this.cursor.next == this.tail){
		if(this.cursor.prev == undefined){
			this.cursor.next = undefined;
			this.tail = undefined;
			this.head = undefined;
			return;
		}
		else{
			this.cursor.next.prev = undefined;
			this.cursor.prev.next = undefined;
			this.tail = this.cursor.prev;
			this.cursor.next = undefined;
			return;
		}
	}
	else if(this.cursor.next == this.head){
		this.cursor.next = this.cursor.next.next;
		this.head.next = undefined;
		this.cursor.next.prev = undefined;
		this.head = this.cursor.next;
		return;
	}
	else{
		this.cursor.prev.next = this.cursor.next.next;
		this.cursor.next.next.prev = this.cursor.prev;
		this.cursor.next.prev = undefined;
		this.cursor.next.next = undefined;
		this.cursor.next = this.cursor.prev.next;
	}
}

/* Execute the function ff for each element of the list.
 * The cursor is unaffected.*/
List.prototype.forEach = function(ff){
	var n = this.head;
	while(n != undefined){
		ff(n.data);
		n = n. next;
	}
}

//STACKS
function Stack(){
	this.S = [];
}

Stack.prototype.push = function(x){
	this.S.push(x);
}

Stack.prototype.top = function(){
	return this.S[this.S.length - 1];
}

Stack.prototype.pop = function(){
	this.S.pop();
}

