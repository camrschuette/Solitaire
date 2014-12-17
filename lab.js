"use strict";

var piles=[];
var mx,my;              
var draggingcard;       
var draggingpileidx;       
var cvs;
var ctx;
var drawWaste = new List();
var found = [];

var vgap = 20;
var vmargin = Card.h + 20;
var hgap = 5;

function main(){
    cvs = document.getElementById("cvs");
    ctx = cvs.getContext("2d");
    
    cvs.addEventListener("mousedown",mousedown);
    cvs.addEventListener("mouseup",mouseup);
    cvs.addEventListener("mousemove",mousemove);
    
    //MAKE DECK
    var deck=[];
    for(var r=1;r<=13;++r){
        for(var s=0;s<4;++s){
            deck.push(new Card(r,s));
        }
    }

    for( var i=0;i<deck.length;++i){
        var j = Math.floor( i + Math.random()*(deck.length-i)) ;
        if( j == deck.length )
            j = deck.length-1;
        var tmp = deck[i];
        deck[i]=deck[j];
        deck[j]=tmp;
    }
    
    //MAKE PILES
    for(var i=0;i<7;++i){
        piles.push([]);
        for(var j=0;j<=i;++j){
            var c = deck.pop();
            c.setPosition( hgap*(i+1)+Card.w*i, vmargin+vgap*j );
            piles[piles.length-1].push(c);
        }
        piles[i][piles[i].length-1].visible=true;
    }
    
    //DRAW / WASTE PILE
    while(deck.length > 0){
		drawWaste.insert(deck.pop());
	}
	drawWaste.forEach(function(c){
		c.setPosition(5,5);
	});
	drawWaste.cursorToStart();
	
	//FOUNDATIONS
	for(var z=0;z<4;z++){
		found.push(new Stack());
	}
    
    draw();
}

function draw(){
    ctx.fillStyle="rgb(38,113,70)";
	ctx.fillRect(0,0,1500,600);
	ctx.fillStyle="rgba(0,0,0,0.25)";
    for(var i=0;i<piles.length+1;++i){
        ctx.fillRect(hgap*i+Card.w*(i-1),vmargin, Card.w, Card.h);
    }
    ctx.fillRect(5,5, Card.w, Card.h);
    ctx.fillRect(105,5, Card.w, Card.h);
    for(var j=0;j<4;j++){
		ctx.fillRect(312 + (hgap * j) + (Card.w * j),5,Card.w,Card.h);
	}
    ctx.beginPath();
	ctx.arc(Card.w/2 + 5, Card.h/2 + 5,40,0,2*Math.PI);
	ctx.fillStyle="red";
	ctx.fill();
	ctx.stroke();
	ctx.beginPath();
	ctx.arc(Card.w/2 + 5, Card.h/2 + 5,30,0,2*Math.PI);
	ctx.fillStyle="rgba(0,0,0,0.25)";
	ctx.fill();
	ctx.stroke();

    piles.every(function(P){ 
        P.every(function(c){
            c.draw(ctx);
            return true;
        });
        return true;
    });
    

    
    if((drawWaste.getBeforeCursor() == undefined) && (drawWaste.getAfterCursor() == undefined)){

	}
	else if((drawWaste.getAfterCursor()) && (drawWaste.getBeforeCursor() == undefined)){
		drawWaste.getAfterCursor().draw(ctx);

	}
	else if((drawWaste.getAfterCursor() == undefined) && (drawWaste.getBeforeCursor())){
		drawWaste.getBeforeCursor().draw(ctx);

	}
	else{
		drawWaste.getBeforeCursor().draw(ctx);
		drawWaste.getAfterCursor().draw(ctx);
	}
	for(var j=0; j<4; j++){
		if(found[j].top() == undefined){
		}
		else{
			found[j].top().draw(ctx);
		}
	}
	if( draggingcard )
		draggingcard.draw(ctx);

}

function mousedown(e){
    var x = e.clientX-cvs.offsetLeft+window.pageXOffset;
    var y = e.clientY-cvs.offsetTop+window.pageYOffset;
    for(var i=0;i<piles.length;++i){
        var P = piles[i];
        if( P.length > 0 ){
            var c = P[P.length-1];
            if( c.isInside(x,y) ){
                draggingcard = P.pop();
                draggingpileidx = i;
                mx=x;
                my=y;
                return;
            }
        }
    }

	if(drawWaste.getAfterCursor() && drawWaste.getBeforeCursor() == undefined){
		if(drawWaste.getAfterCursor().isInside(x,y)){
			drawWaste.advanceCursor();
			var p = drawWaste.getBeforeCursor();
			p.setPosition(105,5);
			p.visible = true;
			return;
		}
	}
	else if(drawWaste.getAfterCursor() && drawWaste.getBeforeCursor()){
		if(drawWaste.getAfterCursor().isInside(x,y)){
			drawWaste.advanceCursor();
			var p = drawWaste.getBeforeCursor();
			p.setPosition(105,5);
			p.visible = true;
			return;
		}
		if(drawWaste.getBeforeCursor().isInside(x,y)){
			draggingcard = drawWaste.getBeforeCursor();
			draggingpileidx = -1;
			drawWaste.unadvanceCursor();
			drawWaste.remove();
			mx=x;
			my=y;
			return;
		}
	}
	else if(drawWaste.getAfterCursor() == undefined && drawWaste.getBeforeCursor()){
		if(drawWaste.getBeforeCursor().isInside(x,y)){
			draggingcard = drawWaste.getBeforeCursor();
			draggingpileidx = -1;
			drawWaste.unadvanceCursor();
			drawWaste.remove();
			mx=x;
			my=y;
			return;
		}
		if(drawWaste.getAfterCursor() == undefined && (x > 5 && x < 102 && y > 5 && y < 134)){
			while(drawWaste.getBeforeCursor()){
				drawWaste.getBeforeCursor().visible = false;
				drawWaste.getBeforeCursor().setPosition(5,5);
				drawWaste.unadvanceCursor();
			}
			drawWaste.cursorToStart();
			return;
		}
	}
	draw();
}

function mouseup(e){
	draw();
    if( !draggingcard)
        return;        
    var x = e.clientX-cvs.offsetLeft+window.pageXOffset;
    var y = e.clientY-cvs.offsetTop+window.pageYOffset;

    var pi=draggingpileidx;
    
    for(var i=0;i<piles.length;++i){
        var len = piles[i].length;
        if( len == 0 )
            len=1;      //always provide a drop zone, even if pile is empty
            
        var x1 = hgap*(i+1) + Card.w*(i);
        var x2 = x1 + Card.w
        var y1 = vmargin;

        if( x >= x1 && x <= x2 && y >= y1 ){
            var c = piles[i][piles[i].length - 1];
            if(c == undefined){
				pi=i;
				break;
			}
            else if(c.rank == (draggingcard.rank + 1)){
				if(oppCol(c.suit, draggingcard.suit)){
					pi=i;
					break;
				}
			}
            
        }
    }
    
    for(var j=0;j<4;j++){
		var x3 = 312 + (hgap * j) + (Card.w * j);
		var x4 = x3 + Card.w;
		var y2 = 5;
		var y3 = y2 + Card.h;
		
		if( x >= x3 && x <= x4 && y >= y2 ){
			var b = found[j].top();
			if(b == undefined){
				if(draggingcard.rank == 1){
					found[j].push(draggingcard);
					draggingcard.setPosition(312 + (hgap * j) + (Card.w * j), 5);
					if(draggingpileidx == -1){
					}
					else{
						var z = piles[draggingpileidx][piles[draggingpileidx].length - 1];
						if(z.visible == false){
							z.visible = true;
						}
					}
					draggingcard=undefined;
					draw();
					return;
				}	
			}
			else{
				if(b.rank == (draggingcard.rank - 1)){
					if(b.suit == draggingcard.suit){
						found[j].push(draggingcard);
						draggingcard.setPosition(312 + (hgap * j) + (Card.w * j), 5);
						if(draggingpileidx == -1){
						}
						else{
							var z = piles[draggingpileidx][piles[draggingpileidx].length - 1];
							if(z == undefined){
								draggingcard=undefined;
								draw();
								return;
							}
							if(z.visible == false){
								z.visible = true;
							}
						}
						draggingcard=undefined;
						draw();
						return;
					}
				}
			}
		}
		
	}
    
    if(pi == -1){
		draggingcard.setPosition(105,5);
		drawWaste.insert(draggingcard);
	}
	else{
		draggingcard.setPosition(hgap + pi*(hgap+Card.w),vmargin+vgap*piles[pi].length);
		piles[pi].push(draggingcard);
		if(draggingpileidx == -1){
		}
		else{
			var z = piles[draggingpileidx][piles[draggingpileidx].length - 1];
			if(z == undefined){
				draggingcard=undefined;
				draw();
				return;
			}
			else if(z.visible == false){
				z.visible = true;
			}
		}
	}
    draggingcard=undefined;
    draw();
}

function mousemove(e){
    if(!draggingcard)
        return;
    var x = e.clientX-cvs.offsetLeft+window.pageXOffset;
    var y = e.clientY-cvs.offsetTop+window.pageYOffset;
    var deltax = x-mx;
    var deltay = y-my;
    draggingcard.setPosition(draggingcard.x+deltax,draggingcard.y+deltay);
    mx=x;
    my=y;
    draw();
}

function oppCol(c1, c2){
	return((c1 <= 1 && c2 >= 2) || (c1 >= 2 && c2 <= 1));
}

