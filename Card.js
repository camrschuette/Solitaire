"use strict";
function Card(r,s){
    this.rank=r;
    this.suit=s;
    this.x=0;
    this.y=0;
    this.visible=false;
    this.rotangle=-0.05+Math.random()*0.1;
}

Card.prototype.makeMessy = function(){
    this.rotangle = -0.05 + Math.random()*0.1;
}

Card.prototype.setPosition = function(x,y){
    this.x=x;
    this.y=y;
}

Card.prototype.draw = function(ctx){
    ctx.save();
    ctx.translate(this.x+Card.w/2,this.y+Card.h/2);
    //ctx.rotate(this.rotangle);
    if( this.visible )
        ctx.drawImage(Card.tilesheet,
            (this.rank-1)*Card.w,this.suit*Card.h,
            Card.w, Card.h,
            -Card.w/2,-Card.h/2, //this.x,this.y,
            Card.w, Card.h);
    else
        ctx.drawImage(Card.tilesheet,
            2*Card.w,4*Card.h,
            Card.w,Card.h,
            -Card.w/2,-Card.h/2,//this.x,this.y,
            Card.w,Card.h);
            
    ctx.restore();
            
}

Card.prototype.isInside = function(x,y){
    if( x >= this.x && x <= this.x+Card.w && y >= this.y && y <= this.y+Card.h )
        return true;
    else
        return false;
}

Card.tilesheet = new Image();
Card.tilesheet.src = "allcards.png";
Card.w = 97;
Card.h = 129;
Card.DIAMONDS=0;
Card.HEARTS=1;
Card.SPADES=2;
Card.CLUBS=3;
