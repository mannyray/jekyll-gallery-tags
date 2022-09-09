import React, {Component} from 'react';
import Tag from './Tag';

export default class Upload extends Component {

	constructor(props){
		super(props)
		this.url_backend = this.props.url_backend;
		this.state = {
			height:this.props.height,
			width:this.props.width,
			imageURL:'',
			submit:false,
			images:[],
			dictionary:{}
		};
		this.handleUploadImage = this.handleUploadImage.bind(this);
	}

	handleUploadImage(e){
		fetch(this.url_backend+'/load_path?path='+this.save_directory.value, {method: 'POST'} ).then( res => res.json()).then(res => this.setState({images:res,submit:true}));
	}

	render() {
		if( this.state.submit === false ){
			return (
				<div>
					<div>
						<h1>Upload Directory</h1>
						<input ref={ (ref) => { this.save_directory = ref;} } />
					</div>
					<br/>
					<div>
						<button onClick={this.handleUploadImage}>Upload</button>
					</div>
				</div>
			);
		}
		else{
			return (
				<div>
					 <Tag url_backend={this.url_backend} save_directory={this.save_directory.value} height={this.state.height} width={this.state.width} firstImage={this.state.images[0]} images={this.state.images}/>
				</div>
			);
		}
	}
}
