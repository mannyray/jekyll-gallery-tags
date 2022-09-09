import React, {  Component } from 'react';
import {TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import configuration from "./config.json";
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  Crop,
  PixelCrop,
} from 'react-image-crop'
import "react-image-crop/dist/ReactCrop.css";

const loadedData = JSON.stringify(configuration);
const json = JSON.parse(loadedData);
const colour_coding = json['colour_coding'];


export default class Tag extends Component {

	constructor(props){
		super(props)
		this.state = {
			url_backend: this.props.url_backend,
			images: this.props.images,
			image_viewed:this.props.firstImage,
			height:this.props.height,
			imageCount:this.props.images.length,
			width:this.props.width,
			save_directory:this.props.save_directory,
			index:0,
			textBoxValue:'',
			crop:undefined,
			completedCrop:undefined,
			year:"",
			month:"",
			caption:"",
			imageHeight:undefined,
			imageWidth:undefined
		};
		this.handler = this.handler.bind(this);
		this.saveImageThumbnailInformation = this.saveImageThumbnailInformation.bind(this);
		this.handleChangeYear = this.handleChangeYear.bind(this);
		this.handleChangeMonth = this.handleChangeMonth.bind(this);
		this.handleChangeCaption = this.handleChangeCaption.bind(this);
		this.onImgLoad = this.onImgLoad.bind(this);
		this.getImageInfoHandler = this.getImageInfoHandler.bind(this);
		this.goToRightImage = this.goToRightImage.bind(this);
		this.goToLeftImage = this.goToLeftImage.bind(this);
		this.getImageInfo = this.getImageInfo.bind(this);
		
		fetch(this.state.url_backend+'/get_image_info?image='+this.state.image_viewed+'&path='+this.state.save_directory).then(res => res.json()).then(res => this.getImageInfoHandler(res));
	}
	
	getImageInfoHandler(res){
		if(res.length === 0){
			this.setState({crop:undefined,completedCrop:undefined});
			return;
		}
		const c = {
			aspect: 1 / 1,
			width: res['width']/res['actual_width']*this.state.imageWidth,
			height: res['width']/res['actual_width']*this.state.imageWidth,
			unit: "px",
			x: res['x']/res['actual_width']*this.state.imageWidth,
			y: res['y']/res['actual_height']*this.state.imageHeight,
		};
		this.setState({caption:res['caption'],month:res['month'],year:res['year'],crop:c,completedCrop:c})
	}
	
	getImageInfo(){
		var selected_image = [];
		selected_image = this.state.images[this.state.index];
		fetch(this.state.url_backend+'/get_image_info?image='+selected_image+'&path='+this.state.save_directory).then(res => res.json()).then(res => this.getImageInfoHandler(res));
		this.setState({image_viewed:selected_image});
	}
	
	goToRightImage(){
		this.state.index = this.state.index + 1;
		if(this.state.index === this.state.imageCount){
			this.state.index = 0;
		}
		this.getImageInfo();
	}
	goToLeftImage(){
		this.state.index = this.state.index - 1;
		if(this.state.index === -1 ){
			this.state.index = this.state.imageCount -1;
		}
		this.getImageInfo();
	}
	
	handler(event){
		if(event.key === 'Enter'){
			if(this.state.textBoxValue === 'n' || this.state.textBoxValue === 'b'){
				if(this.state.textBoxValue === 'n'){
					this.goToRightImage();
				}
				else{
					this.goToLeftImage();
				}
				this.setState({textBoxValue:''});
			}
		}
		else if(event.key === '='){
			if(this.state.textBoxValue !== ''){
				this.setState({textBoxValue:''});
			}
		}
		else{
			this.state.textBoxValue = this.state.textBoxValue + event.key;
			this.setState({textBoxValue:this.state.textBoxValue});
		}
	}
	
	onImgLoad({target:img}) {
		this.setState({imageHeight:img.offsetHeight,imageWidth:img.offsetWidth})
	}
	
	saveImageThumbnailInformation(){
		const caption_info='&caption='+this.state.caption;
		const image_dimensions='&image_height='+this.state.imageHeight+'&image_width='+this.state.imageWidth
		const image_info = '&path='+this.state.save_directory+'&image='+this.state.image_viewed
		const thumbnail_deets = "&thumbnail="+this.state.crop.x+"_"+this.state.crop.y+"_"+Math.floor(this.state.crop.width)
		//this.state.index = this.state.index + 1;
		fetch(this.state.url_backend+'/save_image_info?year='+this.state.year+"&month="+this.state.month+thumbnail_deets+image_info+image_dimensions+caption_info, {method: 'POST'} ).then( res => res.json()).then(this.goToRightImage());
	}
	
	handleChangeYear(event){
		this.setState({year:event.target.value})
	}
	
	handleChangeMonth(event){
		this.setState({month:event.target.value})
	}
	
	handleChangeCaption(event){
		this.setState({caption:event.target.value})
	}

	render(){
		return (
			<div style={{ float:'left'}}>
				<div>
					<div style={{float:'left',display:'flex'}}>
						<ReactCrop aspect={1} crop={this.state.crop} onComplete={(c) => this.setState({completedCrop:c})} onChange={crop => this.setState({crop:crop,gg:crop.x+" "+crop.y+" "+crop.width+" "+crop.height})}>
							<img onLoad={this.onImgLoad} src={this.state.url_backend+'/get_specific_image?path='+this.state.save_directory+'&image='+this.state.image_viewed} style={{height:this.state.height*0.7}} alt="test" />
						</ReactCrop>
						<div>
							{Boolean(this.state.completedCrop) && (
							  <div style={{width:this.state.crop.width+"px",height:this.state.crop.height+"px",overflow:"hidden"}}>
							    <img src={this.state.url_backend+'/get_specific_image?path='+this.state.save_directory+'&image='+this.state.image_viewed} style={{height:this.state.height*0.7,marginTop:("-"+this.state.crop.y+"px"),marginLeft:("-"+this.state.crop.x+"px"),}} alt="test" />
							</div>

						)}
						</div>
				
					</div>
				</div>
				<div>
					<div >
						<h2>Navigation</h2>
						<br/>
						<input type="text"  value={this.state.textBoxValue}  onKeyPress={(e) => this.handler(e)}  autofocus="autofocus" />
						
					</div>
				</div>
				<div>
					<div >
						<h2>Enter Image message:</h2>
						<br/>
						<textarea value={this.state.caption}  onChange={this.handleChangeCaption} id="image_caption" name="image_caption" rows="4" cols="50"></textarea>
					</div>
				</div>
				<div>
					<label for="year">Choose a year:</label>
					<select name="year" value={this.state.year} id="year" onChange={this.handleChangeYear}>
						<option value="2010">2010</option>
						<option value="2011">2011</option>
						<option value="2012">2012</option>
						<option value="2013">2013</option>
						<option value="2014">2014</option>
						<option value="2015">2015</option>
						<option value="2016">2016</option>
						<option value="2017">2017</option>
						<option value="2018">2018</option>
						<option value="2019">2019</option>
						<option value="2020">2020</option>
						<option value="2021">2021</option>
						<option value="2022">2022</option>
						<option value="2023">2023</option>
					</select>

					<label for="month">Choose a month:</label>
					<select name="month" value={this.state.month}  id="month" onChange={this.handleChangeMonth}>
						<option value="1">January</option>
						<option value="2">February</option>
						<option value="3">March</option>
						<option value="4">April</option>
						<option value="5">May</option>
						<option value="6">June</option>
						<option value="7">July</option>
						<option value="8">August</option>
						<option value="9">September</option>
						<option value="10">October</option>
						<option value="11">November</option>
						<option value="12">December</option>
					</select>
					<button onClick={this.saveImageThumbnailInformation} type="button">Submit</button> 
				</div>
			</div>
		);
	}
}
