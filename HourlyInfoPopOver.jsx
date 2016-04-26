HourlyInfo = React.createClass({

  mixins: [ReactMeteorData],

  getMeteorData : function(){
    var dataRecords = DataRecord.find({workcenterCode:{$in:this.props.workcenterCodes},recordTime:{$gte:_DayStart(), $lte:_DayEnd() }}).fetch();
    var info = {};
    var accumulativeCount = 0;
    dataRecords.forEach(function(record){
      var time = record.recordTime;
      var hour = time.getHours().toString();
      if (info[hour]) {
        info[hour] += record.count;
      }
      else {
        info[hour] = 1;
      }
      accumulativeCount += record.count;
    })
    return {
      dataRecords : dataRecords,
      info : info,
      accumulativeCount: accumulativeCount
    }
  },

  getHourlyInfoDivPos : function() {
    var pos_y = this.props.y;
    // Element out of scope of react as its defined using Blaze, so need to get it by vanilaJS.
    // Can use Jquery? sure we can. will include and change.
    var left_nav_menu = document.getElementById('app-left-menu');
    if ((pos_y + 180) > left_nav_menu.offsetHeight) {
      pos_y = pos_y - 180;
    }
    return pos_y
  },

  closePopUp : function(){
    ReactiveHourlyFieldsVisibleBoxId.set(Random.id())
  },

  // Can be hidden if clicked on any part of doccument. 
  componentDidMount() {
      $('body').on('click', this.onBodyClick);
  },

  // Remove the body listner..
  componentWillUnmount() {
      $('body').off('click', this.onBodyClick);
  },

  onBodyClick(event) {
      // var trigger = this.refs.trigger;
      var overlayElem = ReactDOM.findDOMNode(this.refs.overlay);
      var isTargetInOverlay = $(event.target).closest(overlayElem).length > 0;
      if (!isTargetInOverlay) {
          ReactiveHourlyFieldsVisibleBoxId.set(Random.id())
      }
  },

  plotInfo : function(){
    var info = this.data.info
    var all_keys = Object.keys(info)
    var hour_details = []
    var three_info = []
    var count = 0;
    all_keys.map(function(key){
      count += 1;
      var int_key = parseInt(key)
      var final_info =  key +":00 -"+(int_key + 1).toString()+ ":00"+ " :- "; 
      three_info.push(<span key={Random.id()}>{final_info} <b>{info[key].toString()},</b> </span>)
      if (count == 3)
      {
        three_info.push(<br key={Random.id()}/>);
        count = 0;
      }
    })
    return three_info
  },

  render : function(){
    var yaxis = this.getHourlyInfoDivPos();
    return(
      <div ref="overlay" style={{"top": yaxis + "px","left": this.props.x + "px"}} className="ShopFloorInfoBox">
        <div className="hourlyinfo_lft"> {this.props.levelName} </div>
        <a onClick={this.closePopUp} className="hourlyinfo_rgt"><font color="black">X</font></a>
        <div className="clr_div">
          {this.plotInfo()}
          <p> 累计产量 : <b>{this.data.accumulativeCount}</b> </p>
        </div>
      </div>
    )
  }
})
