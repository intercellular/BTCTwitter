Stream = {
  id: "stream",
  $cell: true,
  class: "container",
  _timestamps: function(){ return this.querySelectorAll(".timestamp") },
  $init: function(){
    this._bitcoin = Bitcoin(this);
  },
  _add: function(data){
    console.log("data", data);
    if(data[1] !== "hb"){
      this.$components.unshift(Item({dollars: data[1], timestamp: Date.now()}))
      this._timestamps().forEach(function(timestamp){ timestamp._refresh() })
    }
  },
  $components: []
};
Item = function(o){
  return {
    class: "row hidden",
    $init: function(){
      var t = this;
      setTimeout(function(){ t._display() }, 200)
    },
    _display: function(){
      this.class = "row";
    },
    $components: [
      {
        $type: "h1",
        $text: "$" + o.dollars
      },
      {
        class: "timestamp",
        _timestamp: o.timestamp,
        _refresh: function(){ this.$text = Timeago(this._timestamp) },
        $text: Timeago(o.timestamp)
      }
    ]
  }
};
Bitcoin = function($el){
  var ws = new WebSocket('wss://api.bitfinex.com/ws')
  ws.addEventListener('message', function (event) {
    if(Array.isArray(JSON.parse(event.data))) $el._add(JSON.parse(event.data))
  })
  ws.addEventListener('open', function (event) {
    ws.send(JSON.stringify({ "event":"subscribe", "channel":"ticker", "pair":"BTCUSD" }))
  })
  return ws;
};
Timeago = function(d){
  return timeago().format(d);
};
